# Dynamic RBAC (Users + Roles + Capabilities) for Hasura PMS

## Design decisions (v1)

* Single schema: `public`
* Multi-tenant ready: **clinic-scoped roles and assignments**
* Permissions are **capability keys** like:

  * `patients.read`, `patients.write`
  * `schedule.read`, `schedule.write`
  * `billing.claims.submit`
* Hasura permissions later will reference:

  * `x-hasura-user-id`
  * `x-hasura-clinic-id`
* We keep **auth** separate from **identity**:

  * `app_user` = identity + login fields
  * `clinic_user` = membership in clinic
* “Granular permissions” are implemented as: **capability set** evaluation

---

## 1) Migration deliverable (one migration folder)

Tell Cursor to create a single migration:

```text
infra/hasura/migrations/default/0000000000001_rbac_init/up.sql
infra/hasura/migrations/default/0000000000001_rbac_init/down.sql
```

### 1.1 `up.sql` (tables + constraints + indexes + contract views + helper functions)

```sql
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Core identity (login + profile)
-- ------------------------------------------------------------
create table if not exists public.app_user (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  first_name text null,
  last_name text null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_app_user_active on public.app_user(is_active);

-- ------------------------------------------------------------
-- Tenancy boundary: clinic + membership
-- ------------------------------------------------------------
create table if not exists public.clinic (
  id bigserial primary key,
  name text not null,
  timezone text not null default 'America/Toronto',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_clinic_active on public.clinic(is_active);

create table if not exists public.clinic_user (
  id bigserial primary key,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  user_id uuid not null references public.app_user(id) on delete cascade,
  is_active boolean not null default true,
  joined_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (clinic_id, user_id)
);

create index if not exists idx_clinic_user_clinic on public.clinic_user(clinic_id);
create index if not exists idx_clinic_user_user on public.clinic_user(user_id);
create index if not exists idx_clinic_user_active on public.clinic_user(clinic_id, is_active);

-- ------------------------------------------------------------
-- Capability registry (global)
-- Admin defines the vocabulary of actions (or you can ship defaults)
-- ------------------------------------------------------------
create table if not exists public.capability (
  key text primary key,
  description text not null,
  module text not null,              -- e.g. 'patients', 'schedule', 'billing'
  is_deprecated boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_capability_module on public.capability(module);

-- ------------------------------------------------------------
-- Dynamic roles (clinic-scoped)
-- Admin creates these per clinic (e.g. Front Desk, Hygienist, Manager)
-- ------------------------------------------------------------
create table if not exists public.role (
  id bigserial primary key,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  name text not null,
  description text null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (clinic_id, name)
);

create index if not exists idx_role_clinic_active on public.role(clinic_id, is_active);

-- Role -> capability mapping
create table if not exists public.role_capability (
  role_id bigint not null references public.role(id) on delete cascade,
  capability_key text not null references public.capability(key) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (role_id, capability_key)
);

create index if not exists idx_role_capability_cap on public.role_capability(capability_key);

-- User assignment to role (by membership)
create table if not exists public.clinic_user_role (
  clinic_user_id bigint not null references public.clinic_user(id) on delete cascade,
  role_id bigint not null references public.role(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (clinic_user_id, role_id)
);

create index if not exists idx_clinic_user_role_role on public.clinic_user_role(role_id);

-- ------------------------------------------------------------
-- Overrides: admin can grant/deny individual caps for a specific user
-- Deny wins.
-- ------------------------------------------------------------
do $$ begin
  create type public.override_effect as enum ('grant', 'deny');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.user_capability_override (
  clinic_user_id bigint not null references public.clinic_user(id) on delete cascade,
  capability_key text not null references public.capability(key) on delete restrict,
  effect public.override_effect not null,
  reason text null,
  created_at timestamptz not null default now(),
  primary key (clinic_user_id, capability_key)
);

create index if not exists idx_uco_capability on public.user_capability_override(capability_key);

-- ------------------------------------------------------------
-- Contract views (stable API surface)
-- ------------------------------------------------------------

-- Safe user projection (no password_hash)
create or replace view public.app_user_v as
select
  id, email, first_name, last_name, is_active, created_at, updated_at
from public.app_user;

create or replace view public.clinic_v as
select
  id, name, timezone, is_active
from public.clinic;

create or replace view public.clinic_user_v as
select
  id, clinic_id, user_id, is_active, joined_at
from public.clinic_user;

create or replace view public.role_v as
select
  id, clinic_id, name, description, is_active
from public.role;

-- Effective capabilities for a given clinic_user (set)
-- Rule: base from roles (active only) then apply overrides (deny removes, grant adds)
create or replace view public.clinic_user_effective_capabilities_v as
with
base_caps as (
  select
    cu.clinic_id,
    cu.user_id,
    cu.id as clinic_user_id,
    rc.capability_key
  from public.clinic_user cu
  join public.clinic c on c.id = cu.clinic_id and c.is_active = true
  join public.clinic_user_role cur on cur.clinic_user_id = cu.id
  join public.role r on r.id = cur.role_id and r.is_active = true
  join public.role_capability rc on rc.role_id = r.id
  where cu.is_active = true
),
grants as (
  select
    cu.clinic_id,
    cu.user_id,
    cu.id as clinic_user_id,
    uco.capability_key
  from public.clinic_user cu
  join public.clinic c on c.id = cu.clinic_id and c.is_active = true
  join public.user_capability_override uco on uco.clinic_user_id = cu.id
  where cu.is_active = true and uco.effect = 'grant'
),
denies as (
  select
    cu.clinic_id,
    cu.user_id,
    cu.id as clinic_user_id,
    uco.capability_key
  from public.clinic_user cu
  join public.clinic c on c.id = cu.clinic_id and c.is_active = true
  join public.user_capability_override uco on uco.clinic_user_id = cu.id
  where cu.is_active = true and uco.effect = 'deny'
),
unioned as (
  select * from base_caps
  union
  select * from grants
)
select
  u.clinic_id,
  u.user_id,
  u.clinic_user_id,
  u.capability_key
from unioned u
left join denies d
  on d.clinic_user_id = u.clinic_user_id
 and d.capability_key = u.capability_key
where d.capability_key is null;

-- ------------------------------------------------------------
-- Helper functions (optional but useful)
-- ------------------------------------------------------------

-- Fast boolean check used by policies/tests
create or replace function public.fn_has_capability(
  p_clinic_id bigint,
  p_user_id uuid,
  p_capability_key text
) returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from public.clinic_user_effective_capabilities_v v
    where v.clinic_id = p_clinic_id
      and v.user_id = p_user_id
      and v.capability_key = p_capability_key
  );
$$;

-- Return set of capability keys
create or replace function public.fn_effective_capabilities(
  p_clinic_id bigint,
  p_user_id uuid
) returns setof text
language sql
stable
as $$
  select v.capability_key
  from public.clinic_user_effective_capabilities_v v
  where v.clinic_id = p_clinic_id
    and v.user_id = p_user_id
  order by v.capability_key;
$$;
```

### 1.2 `down.sql`

```sql
drop function if exists public.fn_effective_capabilities(bigint, uuid);
drop function if exists public.fn_has_capability(bigint, uuid, text);

drop view if exists public.clinic_user_effective_capabilities_v;
drop view if exists public.role_v;
drop view if exists public.clinic_user_v;
drop view if exists public.clinic_v;
drop view if exists public.app_user_v;

drop table if exists public.user_capability_override;
drop type if exists public.override_effect;

drop table if exists public.clinic_user_role;
drop table if exists public.role_capability;
drop table if exists public.role;

drop table if exists public.capability;

drop table if exists public.clinic_user;
drop table if exists public.clinic;

drop table if exists public.app_user;
```

---

# 2) Hasura tracking plan (minimal but powerful)

Tell Cursor to track ONLY contract objects (not raw tables unless needed).

## Track these views (read contracts)

* `app_user_v` (safe user projection)
* `clinic_v`
* `clinic_user_v`
* `role_v`
* `clinic_user_effective_capabilities_v` (the permission engine)

## Track these tables (admin UI CRUD)

You *will* need these tracked for the admin to dynamically manage roles/caps:

* `capability` (create/edit capabilities)
* `role`
* `role_capability`
* `clinic_user_role`
* `user_capability_override`

Optional:

* track `clinic_user` if you want admin to manage membership in UI
* avoid tracking `app_user` (because it contains `password_hash`)

## Track these functions

* `fn_has_capability`
* `fn_effective_capabilities`

---

# 3) Hasura permissions pattern (the key part)

You said: “granular permissions for different functions in the PMS.”

The best pattern is:

### A) Row-level tenant filter (every clinic-scoped table)

For any future table like `patient`, `appointment`, etc:

* Select permission: `clinic_id = X-Hasura-Clinic-Id`

### B) Capability-gating writes (and optionally reads)

For the `insert/update/delete` permission on a table, add:

* `_exists` in `clinic_user_effective_capabilities_v`

Example (conceptual):

* allow insert on `patient` only if:

  * `clinic_id = X-Hasura-Clinic-Id`
  * and exists capability key `patients.write`

This scales because you only change DB role/cap assignments, not Hasura metadata.

---

# 4) Admin-first bootstrapping (how you create first admin + first clinic)

You have two choices:

## Option 1 (recommended): DB functions for bootstrapping

Add functions later:

* `fn_create_first_admin(email, password_hash) -> uuid`
* `fn_create_first_clinic(name, timezone) -> bigint`
* `fn_add_user_to_clinic(p_clinic_id, p_user_id) -> clinic_user_id`
* `fn_create_role(...)`
* `fn_assign_role(...)`

These keep invariants centralized.

## Option 2: do it via Hasura mutations with admin secret

Faster short-term, more footguns long-term.

---

# 5) Testing plan (what makes sense with this RBAC setup)

### Unit tests (fast)

* capability evaluation helpers (frontend)
* input validation schemas

### Integration tests (MSW)

* Admin UI: create role, assign caps, assign user role, set overrides
* Verify the UI calls correct GraphQL operations

### E2E (Playwright + real Hasura)

One “holy grail” RBAC test:

1. Create clinic, two users
2. Create role “Front Desk”
3. Attach caps: `patients.read` only
4. Assign role to user
5. Query `fn_has_capability` returns true for read and false for write
6. Add override deny for read -> now false
7. Add override grant for write -> now true

This proves your RBAC engine works end-to-end.

---

# 6) Cursor “Definition of Done”

1. Migration applies cleanly from empty DB.
2. Hasura metadata tracks the objects above.
3. Admin can:

   * create capabilities
   * create roles
   * link roles to capabilities
   * assign roles to clinic users
   * add grant/deny overrides
4. `clinic_user_effective_capabilities_v` reflects changes instantly.
5. `fn_has_capability()` returns correct results.

---

## One important security note (practical)

Hasura “admin secret in browser” is fine for early dev, but as soon as you ship:

* you’ll use JWT auth (or an auth service)
* you’ll set `x-hasura-user-id` and `x-hasura-clinic-id` via auth
* you’ll remove admin secret from the frontend entirely

---

If you want, I can also write the **exact Hasura permission JSON/YAML templates** for one example table (like `patient`) so Cursor can copy the pattern across every module without thinking.
