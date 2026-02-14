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
