# Auth Service as Control Plane + First-Class Auditing

## 0) Principles (non-negotiable)

1. **No direct writes from browser** to RBAC tables (`role`, `role_capability`, `clinic_user_role`, `user_capability_override`, `clinic_user`, `app_user`)
2. **No secrets** in browser (no admin secret)
3. Every privileged action must:

   * check `users.manage` capability
   * write an audit entry
4. Every write must be **clinic scoped** (except global capability registry if you keep it global)

---

## 1) Database: Add auditing schema + request context

Create a migration:

```
infra/hasura/migrations/default/0000000000003_audit_init/up.sql
infra/hasura/migrations/default/0000000000003_audit_init/down.sql
```

### 1.1 `up.sql` (audit log + context helpers)

```sql
create schema if not exists audit;

-- Request context captured per-transaction via set_config(...)
-- We'll use current_setting('audit.*', true) from triggers/functions.
create or replace function audit.fn_ctx_text(key text)
returns text
language sql
stable
as $$
  select nullif(current_setting(key, true), '');
$$;

create or replace function audit.fn_ctx_uuid(key text)
returns uuid
language sql
stable
as $$
  select (nullif(current_setting(key, true), ''))::uuid;
$$;

create or replace function audit.fn_ctx_bigint(key text)
returns bigint
language sql
stable
as $$
  select (nullif(current_setting(key, true), ''))::bigint;
$$;

-- Main audit table (append-only)
create table if not exists audit.event (
  id bigserial primary key,
  occurred_at timestamptz not null default now(),

  -- who/where
  actor_user_id uuid null,
  clinic_id bigint null,
  request_id text null,
  ip text null,
  user_agent text null,

  -- what
  action text not null,              -- e.g. 'user.create', 'role.assign'
  entity_type text not null,         -- e.g. 'app_user', 'clinic_user_role'
  entity_id text null,               -- store as text for mixed id types
  success boolean not null default true,

  -- details
  payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_audit_event_time on audit.event(occurred_at desc);
create index if not exists idx_audit_event_actor on audit.event(actor_user_id, occurred_at desc);
create index if not exists idx_audit_event_clinic on audit.event(clinic_id, occurred_at desc);
create index if not exists idx_audit_event_action on audit.event(action, occurred_at desc);

-- Helper to insert audit row (use inside auth service transactions)
create or replace function audit.fn_log(
  p_action text,
  p_entity_type text,
  p_entity_id text,
  p_payload jsonb,
  p_success boolean default true
) returns void
language plpgsql
as $$
begin
  insert into audit.event (
    actor_user_id,
    clinic_id,
    request_id,
    ip,
    user_agent,
    action,
    entity_type,
    entity_id,
    payload,
    success
  )
  values (
    audit.fn_ctx_uuid('audit.actor_user_id'),
    audit.fn_ctx_bigint('audit.clinic_id'),
    audit.fn_ctx_text('audit.request_id'),
    audit.fn_ctx_text('audit.ip'),
    audit.fn_ctx_text('audit.user_agent'),
    p_action,
    p_entity_type,
    p_entity_id,
    coalesce(p_payload, '{}'::jsonb),
    p_success
  );
end;
$$;
```

### 1.2 `down.sql`

```sql
drop function if exists audit.fn_log(text, text, text, jsonb, boolean);
drop table if exists audit.event;
drop function if exists audit.fn_ctx_bigint(text);
drop function if exists audit.fn_ctx_uuid(text);
drop function if exists audit.fn_ctx_text(text);
drop schema if exists audit;
```

---

## 2) Auth service: enforce request context on every DB call

### 2.1 Add middleware that generates:

* `request_id` (uuid)
* parses JWT → `actor_user_id`, `clinic_id`
* captures `ip`, `user-agent`

### 2.2 For every request that performs writes:

Open a transaction and do:

```sql
select set_config('audit.actor_user_id', $1, true);
select set_config('audit.clinic_id', $2, true);
select set_config('audit.request_id', $3, true);
select set_config('audit.ip', $4, true);
select set_config('audit.user_agent', $5, true);
```

Then any call to `audit.fn_log(...)` automatically includes that context.

**Cursor instruction:** implement a helper `withTx(ctx, fn)` that sets configs once per tx.

---

## 3) Capability check is mandatory

In DB you already have:

* `public.fn_has_capability(clinic_id, user_id, capability_key)`

Auth service must call that before each privileged operation.

**Rule:** if `users.manage` is missing → `403`.

---

## 4) Auth service endpoints (control plane)

Implement these endpoints (Fastify recommended):

### Auth core

* `POST /auth/login`
* `POST /auth/refresh`
* `POST /auth/logout`
* `GET /auth/me`

### User management

* `POST /auth/users` (create user + membership + optional roleIds)
* `PATCH /auth/users/:userId` (activate/deactivate, name updates)
* `POST /auth/clinics/:clinicId/users/:userId/roles` (assign role)
* `DELETE /auth/clinics/:clinicId/users/:userId/roles/:roleId` (remove role)
* `POST /auth/clinics/:clinicId/roles` (create role)
* `PATCH /auth/clinics/:clinicId/roles/:roleId` (rename/disable)
* `POST /auth/clinics/:clinicId/roles/:roleId/capabilities` (add capability)
* `DELETE /auth/clinics/:clinicId/roles/:roleId/capabilities/:capabilityKey` (remove capability)
* `POST /auth/clinics/:clinicId/users/:userId/capability-overrides` (grant/deny)
* `DELETE /auth/clinics/:clinicId/users/:userId/capability-overrides/:capabilityKey`

All of these:

* require JWT
* require `users.manage` scoped to clinic
* run inside tx
* call `audit.fn_log(...)` with payload

---

## 5) Auditing: what to log (minimum standard)

For each action, log:

* action string (stable)
* entity_type + entity_id
* payload with:

  * before/after (when feasible)
  * target user id
  * role id/capability key
  * clinic id
  * reason (for overrides / deactivation)

### Example audit calls

**Create user:**

```sql
select audit.fn_log(
  'user.create',
  'app_user',
  v_user_id::text,
  jsonb_build_object(
    'email', p_email,
    'clinic_id', v_clinic_id,
    'clinic_user_id', v_clinic_user_id,
    'role_ids', coalesce(p_role_ids, '[]'::jsonb)
  ),
  true
);
```

**Assign role:**

```sql
select audit.fn_log(
  'role.assign',
  'clinic_user_role',
  (p_clinic_user_id::text || ':' || p_role_id::text),
  jsonb_build_object('clinic_user_id', p_clinic_user_id, 'role_id', p_role_id),
  true
);
```

Also log failures (optional but recommended):

* on catch → `audit.fn_log(..., success=false)` then rethrow

---

## 6) DB-side invariants (safety rails)

Add these invariants in DB or auth service (prefer DB where possible):

* You cannot remove the last active “Owner” (or last user with `system.admin`) for a clinic.
* You cannot disable yourself if you’re the last admin.
* Email is always stored lowercase + unique.

Implement “last admin check” in auth service transaction before removing roles/deactivating.

---

## 7) Hasura role: read-only views for UI

Keep Hasura for reads:

* Track `app_user_v`, `clinic_user_v`, `role_v`, `clinic_user_effective_capabilities_v`
* UI reads users + roles + capabilities from Hasura using JWT
* UI performs writes via auth service REST endpoints

This keeps Hasura permissions simpler and reduces blast radius.

---

## 8) Frontend flow (minimal)

* Login page calls `POST /auth/login`
* Store access token (memory + localStorage if you want)
* Apollo client uses `Authorization: Bearer <token>` for Hasura HTTP + WS
* User Management page:

  * Queries Hasura for list of users/roles
  * Calls auth service for create user / assign roles
  * After mutation, refetch query (or later: trigger subscriptions)

---

## 9) Testing (auditing included)

### Integration tests for auth service (Vitest)

For each endpoint:

1. unauthorized → 401
2. authorized without `users.manage` → 403
3. success → 200 AND audit row exists with correct:

   * actor_user_id
   * clinic_id
   * action
   * payload keys

### E2E test (Playwright)

1. login as owner
2. create a new user
3. assign role
4. verify UI shows role assigned
5. verify audit page shows events (optional page)

---

## 10) “Definition of Done”

* Any user management write creates an `audit.event` row
* Audit rows include request_id, actor_user_id, clinic_id, ip, user_agent
* No browser access to password hashes or privileged Hasura mutations
* Role/capability changes are consistent and protected from “last admin” footgun
