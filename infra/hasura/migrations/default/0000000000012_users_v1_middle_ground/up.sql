-- ============================================================================
-- Users v1 (Middle Ground) Implementation
-- ============================================================================
-- See specs/user-kinds.md for details
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Create public.user_profile table
-- ----------------------------------------------------------------------------

create table if not exists public.user_profile (
  user_id uuid primary key references public.app_user(id) on delete cascade,
  user_kind text not null,
  license_no text null,
  scheduler_color text null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id),
  constraint chk_user_kind check (user_kind in ('staff', 'dentist', 'hygienist', 'assistant', 'manager'))
);

-- Indexes for user_profile
create index if not exists idx_user_profile_kind on public.user_profile(user_kind);
create index if not exists idx_user_profile_active on public.user_profile(is_active);

-- Attach audit triggers to user_profile
drop trigger if exists tr_stamp_audit_columns on public.user_profile;
create trigger tr_stamp_audit_columns
before insert or update on public.user_profile
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.user_profile;
create trigger tr_audit_row_change
after insert or update or delete on public.user_profile
for each row execute function audit.fn_row_change_to_event();

-- ----------------------------------------------------------------------------
-- 2) Add audit columns to public.app_user (if missing)
-- ----------------------------------------------------------------------------

alter table public.app_user
  add column if not exists created_by uuid null references public.app_user(id),
  add column if not exists updated_by uuid null references public.app_user(id);

-- Attach audit triggers to app_user (if not already attached)
drop trigger if exists tr_stamp_audit_columns on public.app_user;
create trigger tr_stamp_audit_columns
before insert or update on public.app_user
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.app_user;
create trigger tr_audit_row_change
after insert or update or delete on public.app_user
for each row execute function audit.fn_row_change_to_event();

-- ----------------------------------------------------------------------------
-- 3) Add clinic-variant columns to public.clinic_user
-- ----------------------------------------------------------------------------

alter table public.clinic_user
  add column if not exists job_title text null,
  add column if not exists is_schedulable boolean not null default false,
  add column if not exists provider_kind text null,
  add column if not exists default_operatory_id bigint null references public.operatory(id) on delete set null,
  add column if not exists scheduler_color text null,
  add column if not exists created_by uuid null references public.app_user(id),
  add column if not exists updated_by uuid null references public.app_user(id);

-- Add constraints
alter table public.clinic_user
  drop constraint if exists chk_clinic_user_provider_kind,
  add constraint chk_clinic_user_provider_kind check (provider_kind is null or provider_kind in ('dentist', 'hygienist', 'assistant')),
  drop constraint if exists chk_clinic_user_schedulable,
  add constraint chk_clinic_user_schedulable check (
    (is_schedulable = false) or (is_schedulable = true and provider_kind is not null)
  );

-- Add indexes
create index if not exists idx_clinic_user_schedulable on public.clinic_user(clinic_id, is_schedulable) where is_schedulable = true;
create index if not exists idx_clinic_user_provider_kind on public.clinic_user(clinic_id, provider_kind) where provider_kind is not null;

-- Attach audit triggers to clinic_user (if not already attached)
drop trigger if exists tr_stamp_audit_columns on public.clinic_user;
create trigger tr_stamp_audit_columns
before insert or update on public.clinic_user
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.clinic_user;
create trigger tr_audit_row_change
after insert or update or delete on public.clinic_user
for each row execute function audit.fn_row_change_to_event();

-- ----------------------------------------------------------------------------
-- 4) Update app_user_v view to include audit columns
-- ----------------------------------------------------------------------------

drop view if exists public.app_user_v;
create view public.app_user_v as
select
  id,
  email,
  first_name,
  last_name,
  is_active,
  created_at,
  created_by,
  updated_at,
  updated_by,
  current_clinic_id
from public.app_user;

-- ----------------------------------------------------------------------------
-- 5) Create clinic_user_with_profile_v view
-- ----------------------------------------------------------------------------

drop view if exists public.clinic_user_with_profile_v;
create view public.clinic_user_with_profile_v as
select
  -- clinic_user fields
  cu.id as clinic_user_id,
  cu.clinic_id,
  cu.user_id,
  cu.job_title,
  cu.is_schedulable,
  cu.provider_kind,
  cu.default_operatory_id,
  cu.scheduler_color as clinic_scheduler_color,
  cu.joined_at,
  cu.is_active as clinic_membership_active,
  cu.created_at as clinic_user_created_at,
  cu.created_by as clinic_user_created_by,
  cu.updated_at as clinic_user_updated_at,
  cu.updated_by as clinic_user_updated_by,
  -- app_user_v fields
  au.email,
  au.first_name,
  au.last_name,
  au.is_active as user_account_active,
  -- user_profile fields
  up.user_kind,
  up.license_no,
  up.scheduler_color as global_scheduler_color,
  up.is_active as profile_active
from public.clinic_user cu
join public.app_user_v au on au.id = cu.user_id
left join public.user_profile up on up.user_id = cu.user_id;

-- ----------------------------------------------------------------------------
-- 6) Optional: Backfill defaults for existing users
-- ----------------------------------------------------------------------------

-- Create user_profile for existing users without one (set to 'staff' as safe default)
insert into public.user_profile (user_id, user_kind, is_active)
select id, 'staff', is_active
from public.app_user
where not exists (
  select 1 from public.user_profile where user_id = app_user.id
)
on conflict (user_id) do nothing;
