-- ============================================================================
-- Patient Schema Implementation (v1)
-- ============================================================================
-- Implements specs/patient-v1.md
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) public.person - Universal contact table
-- ----------------------------------------------------------------------------

create table if not exists public.person (
  id bigserial primary key,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  preferred_name text null,
  dob date null,
  gender text null,
  preferred_language text null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id)
);

-- Indexes
create index if not exists idx_person_clinic_name
on public.person(clinic_id, last_name, first_name);

create index if not exists idx_person_clinic_dob
on public.person(clinic_id, dob);

-- Audit triggers
drop trigger if exists tr_stamp_audit_columns on public.person;
create trigger tr_stamp_audit_columns
before insert or update on public.person
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.person;
create trigger tr_audit_row_change
after insert or update or delete on public.person
for each row execute function audit.fn_row_change_to_event();

-- ----------------------------------------------------------------------------
-- 2) public.patient - Extension table for patients
-- ----------------------------------------------------------------------------

create table if not exists public.patient (
  person_id bigint primary key references public.person(id) on delete cascade,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  chart_no text null,
  status text not null default 'active',
  family_doctor_name text null,
  family_doctor_phone text null,
  imaging_id text null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id)
);

-- Trigger to enforce clinic_id matches person.clinic_id
create or replace function public.fn_ensure_patient_clinic_match()
returns trigger
language plpgsql
as $$
declare
  v_person_clinic_id bigint;
begin
  select clinic_id into v_person_clinic_id
  from public.person
  where id = NEW.person_id;
  
  if v_person_clinic_id is null then
    raise exception 'Person with id % does not exist', NEW.person_id;
  end if;
  
  if NEW.clinic_id != v_person_clinic_id then
    raise exception 'Patient clinic_id (%) must match person clinic_id (%)', NEW.clinic_id, v_person_clinic_id;
  end if;
  
  return NEW;
end;
$$;

drop trigger if exists tr_ensure_patient_clinic_match on public.patient;
create trigger tr_ensure_patient_clinic_match
before insert or update on public.patient
for each row execute function public.fn_ensure_patient_clinic_match();

-- Unique constraint: chart_no per clinic
create unique index if not exists idx_patient_chart_no_unique
on public.patient(clinic_id, chart_no)
where chart_no is not null;

-- Audit triggers
drop trigger if exists tr_stamp_audit_columns on public.patient;
create trigger tr_stamp_audit_columns
before insert or update on public.patient
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.patient;
create trigger tr_audit_row_change
after insert or update or delete on public.patient
for each row execute function audit.fn_row_change_to_event();

-- ----------------------------------------------------------------------------
-- 3) public.person_contact_point - Phone/email contacts
-- ----------------------------------------------------------------------------

create table if not exists public.person_contact_point (
  id bigserial primary key,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  person_id bigint not null references public.person(id) on delete cascade,
  kind text not null check (kind in ('phone', 'email')),
  label text null,
  value text not null,
  is_primary boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id)
);

-- Unique constraint: one primary per person+kind
create unique index if not exists idx_person_contact_point_primary_unique
on public.person_contact_point(person_id, kind)
where is_primary = true and is_active = true;

-- Indexes
create index if not exists idx_person_contact_point_person_kind
on public.person_contact_point(clinic_id, person_id, kind, is_active);

create index if not exists idx_person_contact_point_value
on public.person_contact_point(clinic_id, value);

-- Audit triggers
drop trigger if exists tr_stamp_audit_columns on public.person_contact_point;
create trigger tr_stamp_audit_columns
before insert or update on public.person_contact_point
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.person_contact_point;
create trigger tr_audit_row_change
after insert or update or delete on public.person_contact_point
for each row execute function audit.fn_row_change_to_event();

-- ----------------------------------------------------------------------------
-- 4) public.person_address - Addresses
-- ----------------------------------------------------------------------------

create table if not exists public.person_address (
  id bigserial primary key,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  person_id bigint not null references public.person(id) on delete cascade,
  kind text not null check (kind in ('mailing', 'billing')),
  line1 text not null,
  line2 text null,
  city text not null,
  region text not null,
  postal_code text not null,
  country text not null default 'Canada',
  is_primary boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id)
);

-- Unique constraint: one active primary per person+kind
create unique index if not exists idx_person_address_primary_unique
on public.person_address(person_id, kind)
where is_primary = true and is_active = true;

-- Audit triggers
drop trigger if exists tr_stamp_audit_columns on public.person_address;
create trigger tr_stamp_audit_columns
before insert or update on public.person_address
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.person_address;
create trigger tr_audit_row_change
after insert or update or delete on public.person_address
for each row execute function audit.fn_row_change_to_event();

-- ----------------------------------------------------------------------------
-- 5) public.household - Family units
-- ----------------------------------------------------------------------------

create table if not exists public.household (
  id bigserial primary key,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  name text null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id)
);

-- Audit triggers
drop trigger if exists tr_stamp_audit_columns on public.household;
create trigger tr_stamp_audit_columns
before insert or update on public.household
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.household;
create trigger tr_audit_row_change
after insert or update or delete on public.household
for each row execute function audit.fn_row_change_to_event();

-- ----------------------------------------------------------------------------
-- 6) public.household_member - Links people to households
-- ----------------------------------------------------------------------------

create table if not exists public.household_member (
  id bigserial primary key,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  household_id bigint not null references public.household(id) on delete cascade,
  person_id bigint not null references public.person(id) on delete cascade,
  role text not null check (role in ('head', 'member')),
  relationship_to_head text null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id),
  constraint chk_relationship_required check (
    (role = 'head') OR (relationship_to_head is not null)
  ),
  constraint chk_head_relationship_self check (
    (role != 'head') OR (relationship_to_head in ('self') OR relationship_to_head is null)
  )
);

-- Unique constraint: person can only be in one active household
create unique index if not exists idx_household_member_person_unique
on public.household_member(person_id)
where is_active = true;

-- Unique constraint: exactly one head per household
create unique index if not exists idx_household_member_head_unique
on public.household_member(household_id)
where role = 'head' and is_active = true;

-- Audit triggers
drop trigger if exists tr_stamp_audit_columns on public.household_member;
create trigger tr_stamp_audit_columns
before insert or update on public.household_member
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.household_member;
create trigger tr_audit_row_change
after insert or update or delete on public.household_member
for each row execute function audit.fn_row_change_to_event();

-- ----------------------------------------------------------------------------
-- 7) public.patient_financial - Responsible party info
-- ----------------------------------------------------------------------------

create table if not exists public.patient_financial (
  patient_person_id bigint primary key references public.patient(person_id) on delete cascade,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  responsible_party_person_id bigint not null references public.person(id) on delete restrict,
  billing_address_source text not null default 'responsible_party' check (billing_address_source in ('responsible_party', 'patient', 'custom')),
  custom_billing_address_id bigint null references public.person_address(id),
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id),
  constraint chk_custom_billing_address check (
    (billing_address_source != 'custom') OR (custom_billing_address_id is not null)
  )
);

-- Audit triggers
drop trigger if exists tr_stamp_audit_columns on public.patient_financial;
create trigger tr_stamp_audit_columns
before insert or update on public.patient_financial
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.patient_financial;
create trigger tr_audit_row_change
after insert or update or delete on public.patient_financial
for each row execute function audit.fn_row_change_to_event();

-- ----------------------------------------------------------------------------
-- 8) public.insurance_subscriber - Insurance info (optional)
-- ----------------------------------------------------------------------------

create table if not exists public.insurance_subscriber (
  id bigserial primary key,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  subscriber_person_id bigint not null references public.person(id) on delete cascade,
  carrier text null,
  policy_no text null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id)
);

-- Audit triggers
drop trigger if exists tr_stamp_audit_columns on public.insurance_subscriber;
create trigger tr_stamp_audit_columns
before insert or update on public.insurance_subscriber
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.insurance_subscriber;
create trigger tr_audit_row_change
after insert or update or delete on public.insurance_subscriber
for each row execute function audit.fn_row_change_to_event();

-- ============================================================================
-- Verification
-- ============================================================================
-- After applying this migration, verify:
-- 1. All tables created successfully
-- 2. Constraints and indexes are in place
-- 3. Audit triggers are attached
-- ============================================================================
