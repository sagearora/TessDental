-- ============================================================================
-- Patient Status Enum Table
-- ============================================================================
-- Creates an enum table for patient.status with values: active, inactive, archived, deleted, deceased
-- Follows audit-rules.md for audit columns and triggers
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Create patient_status_enum table with audit columns
-- ----------------------------------------------------------------------------

create table if not exists public.patient_status_enum (
  value text primary key,
  display_name text not null,
  display_order integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id)
);

-- ----------------------------------------------------------------------------
-- 2) Add audit triggers
-- ----------------------------------------------------------------------------

drop trigger if exists tr_stamp_audit_columns on public.patient_status_enum;
create trigger tr_stamp_audit_columns
before insert or update on public.patient_status_enum
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.patient_status_enum;
create trigger tr_audit_row_change
after insert or update or delete on public.patient_status_enum
for each row execute function audit.fn_row_change_to_event();

-- ----------------------------------------------------------------------------
-- 3) Insert enum values
-- ----------------------------------------------------------------------------

insert into public.patient_status_enum (value, display_name, display_order) values
  ('active', 'Active', 1),
  ('inactive', 'Inactive', 2),
  ('archived', 'Archived', 3),
  ('deleted', 'Deleted', 4),
  ('deceased', 'Deceased', 5)
on conflict (value) do nothing;

-- ----------------------------------------------------------------------------
-- 4) Clean up any invalid status values and add foreign key constraint
-- ----------------------------------------------------------------------------

-- First, clean up any invalid status values (set to 'active' as default)
update public.patient
set status = 'active'
where status is not null
  and status not in (select value from public.patient_status_enum);

-- Add foreign key constraint
alter table public.patient
add constraint fk_patient_status
foreign key (status) references public.patient_status_enum(value);

-- ----------------------------------------------------------------------------
-- 5) Add index for performance
-- ----------------------------------------------------------------------------

create index if not exists idx_patient_status_enum_active
on public.patient_status_enum(is_active, display_order)
where is_active = true;
