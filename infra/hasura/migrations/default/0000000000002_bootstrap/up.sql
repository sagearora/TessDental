-- 1) Cheap read
create or replace function public.fn_is_bootstrapped()
returns boolean
language sql
stable
as $$
  select exists(select 1 from public.app_user);
$$;

-- 2) A real table to return from the function (Hasura-trackable)
create table if not exists public.bootstrap_event (
  id bigserial primary key,
  admin_user_id uuid not null,
  clinic_id bigint not null,
  clinic_user_id bigint not null,
  role_id bigint not null,
  success boolean not null default true,
  created_at timestamptz not null default now()
);

-- optional: make sure only one bootstrap happens
create unique index if not exists bootstrap_event_singleton on public.bootstrap_event ((true));

-- 3) One-time bootstrap command
create or replace function public.fn_bootstrap_system(
  p_admin_email text,
  p_admin_password_hash text,
  p_admin_first_name text,
  p_admin_last_name text,
  p_clinic_name text,
  p_clinic_timezone text
) returns setof public.bootstrap_event
language plpgsql
as $$
declare
  v_user_id uuid;
  v_clinic_id bigint;
  v_clinic_user_id bigint;
  v_role_id bigint;
  v_event_id bigint;
begin
  -- lock to prevent concurrent bootstraps
  perform pg_advisory_xact_lock(9223372036854775807);

  -- if any user exists, setup is complete
  if exists(select 1 from public.app_user) then
    raise exception 'setup_complete';
  end if;

  insert into public.app_user (email, password_hash, first_name, last_name, is_active)
  values (lower(trim(p_admin_email)), p_admin_password_hash, p_admin_first_name, p_admin_last_name, true)
  returning id into v_user_id;

  insert into public.clinic (name, timezone, is_active)
  values (p_clinic_name, coalesce(nullif(p_clinic_timezone, ''), 'America/Toronto'), true)
  returning id into v_clinic_id;

  insert into public.clinic_user (clinic_id, user_id, is_active, joined_at)
  values (v_clinic_id, v_user_id, true, now())
  returning id into v_clinic_user_id;

  insert into public.role (clinic_id, name, description, is_active)
  values (v_clinic_id, 'Owner', 'Clinic owner / full access', true)
  returning id into v_role_id;

  insert into public.capability (key, description, module, is_deprecated)
  values
    ('system.admin', 'Full administrative access', 'system', false),
    ('clinic.manage', 'Manage clinic settings', 'clinic', false),
    ('users.manage', 'Manage users, roles, permissions', 'users', false)
  on conflict (key) do update
    set description = excluded.description,
        module = excluded.module,
        is_deprecated = excluded.is_deprecated;

  insert into public.role_capability (role_id, capability_key)
  values
    (v_role_id, 'system.admin'),
    (v_role_id, 'clinic.manage'),
    (v_role_id, 'users.manage'),
    (v_role_id, 'audit.export')
  on conflict do nothing;

  insert into public.clinic_user_role (clinic_user_id, role_id)
  values (v_clinic_user_id, v_role_id)
  on conflict do nothing;

  insert into public.bootstrap_event (admin_user_id, clinic_id, clinic_user_id, role_id, success)
  values (v_user_id, v_clinic_id, v_clinic_user_id, v_role_id, true)
  returning id into v_event_id;

  return query
  select * from public.bootstrap_event where id = v_event_id;
end;
$$;
