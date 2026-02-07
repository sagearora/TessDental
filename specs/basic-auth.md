# Add Auth Service + JWT + Frontend GraphQL (codegen + subscriptions)

## A) Create a dockerized Auth service (recommended)

Create a new app:

```
apps/auth/
  src/
    index.ts
    env.ts
    db.ts
    jwt.ts
    routes/
      login.ts
      refresh.ts
      logout.ts
      me.ts
  package.json
  tsconfig.json
  Dockerfile
```

### Goals

* `POST /auth/login` → returns `{ accessToken, refreshToken, clinicId, user }`
* `POST /auth/refresh` → rotates access token
* `POST /auth/logout` → revokes refresh token
* `GET /auth/me` → validates access token and returns session info
* `GET /auth/healthz` → basic health check

### Should it be dockerized?

**Yes**, so it runs with your existing compose stack, uses service networking, and matches prod deployment.

---

## B) Add tables needed for auth (minimal)

Assume you already have:

* `public.app_user (id, email, password_hash, is_active, ...)`
* `public.clinic_user (id, clinic_id, user_id, is_active, ...)`
* RBAC tables (role/capability)

Add two tiny tables (migration):

1. refresh token storage (hashed)
2. optional session audit

**Table: `auth_refresh_token`**

* `id bigserial pk`
* `user_id uuid not null references app_user(id)`
* `token_hash text not null`
* `revoked_at timestamptz null`
* `expires_at timestamptz not null`
* `created_at timestamptz not null default now()`

Indexes:

* `(user_id)`
* `(token_hash)` unique

This lets you implement logout and token rotation cleanly.

---

## C) Hasura JWT configuration

In your Hasura service env (compose), set `HASURA_GRAPHQL_JWT_SECRET` to verify tokens. Hasura supports JWT auth mode and uses JWT custom claims for `x-hasura-*` vars. ([Hasura][1])

Add to `infra/compose/.env`:

```
JWT_SECRET=super_long_random_dev_secret
JWT_ISSUER=tessdental-auth
JWT_AUDIENCE=tessdental-hasura
```

Add to Hasura container env:

```
HASURA_GRAPHQL_JWT_SECRET={"type":"HS256","key":"${JWT_SECRET}","issuer":"${JWT_ISSUER}","audience":"${JWT_AUDIENCE}","claims_namespace_path":"$.https://hasura.io/jwt/claims"}
```

Why `claims_namespace_path`?
So Hasura reads claims from the standard Hasura namespace key. ([Hasura][1])

---

## D) JWT claims structure (the important part)

Auth service must issue an **access token** containing:

```json
{
  "sub": "<user_uuid>",
  "iat": 0,
  "exp": 0,
  "iss": "tessdental-auth",
  "aud": "tessdental-hasura",
  "https://hasura.io/jwt/claims": {
    "x-hasura-user-id": "<user_uuid>",
    "x-hasura-clinic-id": "<clinic_id as string>",
    "x-hasura-default-role": "clinic_user",
    "x-hasura-allowed-roles": ["clinic_user"]
  }
}
```

`x-hasura-default-role` + `x-hasura-allowed-roles` are the mandatory ones in Hasura’s JWT approach. ([Hasura][1])

Clinic scoping:

* choose a clinic on login (if user belongs to multiple clinics, return a list + require clinic selection)
* embed chosen clinic into `x-hasura-clinic-id` as a string

---

## E) Auth service behavior

### Login flow

1. Validate email/password using `bcrypt.compare`
2. Fetch user memberships:

```sql
select clinic_id
from public.clinic_user
where user_id = $1 and is_active = true
order by clinic_id asc;
```

3. If multiple clinics: return clinic list and require client to choose (or accept `clinic_id` in login request).
4. Issue access token with claims.
5. Create refresh token random secret, store **hash** in DB.

### Refresh flow

* Accept refresh token cookie or JSON body
* Verify it exists, not revoked, not expired
* Rotate: revoke old, create new, mint new access token

### Logout flow

* Revoke refresh token

---

## F) Add auth service to Docker Compose

Add a service in your existing compose:

```
auth:
  build:
    context: ../../
    dockerfile: apps/auth/Dockerfile
  env_file:
    - .env
  environment:
    DATABASE_URL: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    JWT_SECRET: ${JWT_SECRET}
    JWT_ISSUER: ${JWT_ISSUER}
    JWT_AUDIENCE: ${JWT_AUDIENCE}
    PORT: 4000
  ports:
    - "4000:4000"
  depends_on:
    postgres:
      condition: service_healthy
```

Now:

* frontend talks to `http://localhost:4000/auth/*`
* frontend talks to Hasura at `http://localhost:8080/v1/graphql` using JWT

---

## G) Frontend: choose GraphQL client with subscriptions

Use **urql** (simple, solid subscriptions story) + `graphql-ws`.

Install:

```bash
pnpm -C apps/web add urql graphql-ws
```

urql will use:

* HTTP for queries/mutations
* WebSocket for subscriptions
  and you can pass token via **connectionParams**, which is the standard way for browser WebSockets (not headers). This is exactly the pain point people hit if they try to set headers directly. ([Stack Overflow][3])

### Required: token-aware urql client

Create:

`apps/web/src/gql/client.ts`

* store access token in memory (and optionally localStorage for dev)
* add `fetchOptions` to attach `Authorization: Bearer ...` on HTTP
* add `subscriptionExchange` with `graphql-ws` and pass `connectionParams: { headers: { Authorization: `Bearer ${token}` } }`

Also: when token changes (login/logout/refresh), recreate the WS client so subscriptions re-auth.

---

## H) Frontend auth UX

Create:

* `AuthProvider` (React context)

  * `login(email, password, clinicId?)`
  * `logout()`
  * `refresh()` timer or on 401
  * `session` contains `user`, `clinicId`
* Routes:

  * `/login`
  * `/app/*` guarded route
* On login success:

  * save access token
  * create urql client
  * navigate to `/app`

Logout:

* clear token
* reset urql cache
* navigate `/login`

---

## I) GraphQL Codegen (typed ops)

Use GraphQL Code Generator to generate:

* typed documents
* typed results/variables

Recommended config uses The Guild docs. ([The Guild][2])

Install:

```bash
pnpm -C apps/web add -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typed-document-node
```

Create `apps/web/codegen.ts`:

* schema: `http://localhost:8080/v1/graphql`
* headers for introspection:

  * in dev you can use admin secret **only for codegen**, not runtime
* documents: `src/**/*.graphql`
* output: `src/gql/generated.ts`

Add scripts:

* `pnpm -C apps/web codegen`
* `pnpm -C apps/web codegen:watch`

Write operations under `apps/web/src/gql/*.graphql`.

---

## J) Hasura permissions plan (clinic scoping)

Once JWT is enabled, remove admin-secret usage from browser.

For each clinic-scoped table:

* select filter: `clinic_id = X-Hasura-Clinic-Id`

For mutation permissions:

* add `_exists` check against your effective capabilities view (RBAC)

This ties your “dynamic roles/capabilities” into Hasura enforcement cleanly.

---

## K) “Working login/logout” minimal deliverable

1. Auth service runs in compose at `:4000`
2. Hasura validates JWT and recognizes session vars
3. Frontend can:

   * login and store token
   * run a query to `app_user_v` or `me` view (scoped)
   * logout and lose access immediately
4. Subscriptions:

   * connect over WS with token in connectionParams
   * a simple subscription updates in real time

---

[1]: https://hasura.io/docs/2.0/auth/authentication/jwt/?utm_source=chatgpt.com "Authentication Using JWTs | Hasura GraphQL Docs"
[2]: https://the-guild.dev/graphql/codegen/docs/guides/react-vue?utm_source=chatgpt.com "Guide: React and Vue"
[3]: https://stackoverflow.com/questions/70139462/apollo-and-hasura-subscriptions-missing-auth-header?utm_source=chatgpt.com "Apollo and Hasura - Subscriptions missing auth header"
