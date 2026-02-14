-- ============================================================================
-- Patient Referral System
-- ============================================================================
-- Implements referral tracking for patients with three types:
-- 1. Contact - refers to another person in the system
-- 2. Source - refers to a clinic-managed referral source (e.g., "Facebook Ad")
-- 3. Other - free-form text referral
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) referral_kind_enum - Enum table for referral types
-- ----------------------------------------------------------------------------

create table if not exists public.referral_kind_enum (
  value text primary key,
  display_name text not null,
  display_order integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Insert enum values
insert into public.referral_kind_enum (value, display_name, display_order) values
  ('contact', 'Contact', 1),
  ('source', 'Source', 2),
  ('other', 'Other', 3)
on conflict (value) do nothing;

-- Index for performance
create index if not exists idx_referral_kind_enum_active
on public.referral_kind_enum(is_active, display_order)
where is_active = true;

-- ----------------------------------------------------------------------------
-- 2) referral_source - Clinic-scoped referral sources (e.g., "Facebook Ad")
-- ----------------------------------------------------------------------------

create table if not exists public.referral_source (
  id bigserial primary key,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id)
);

-- Unique constraint: source name per clinic
create unique index if not exists idx_referral_source_clinic_name_unique
on public.referral_source(clinic_id, name)
where is_active = true;

-- Indexes
create index if not exists idx_referral_source_clinic_active
on public.referral_source(clinic_id, is_active);

-- Audit triggers
drop trigger if exists tr_stamp_audit_columns on public.referral_source;
create trigger tr_stamp_audit_columns
before insert or update on public.referral_source
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.referral_source;
create trigger tr_audit_row_change
after insert or update or delete on public.referral_source
for each row execute function audit.fn_row_change_to_event();

-- ----------------------------------------------------------------------------
-- 3) patient_referral - Stores referral information for patients
-- ----------------------------------------------------------------------------

create table if not exists public.patient_referral (
  patient_person_id bigint primary key references public.patient(person_id) on delete cascade,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  referral_kind text not null references public.referral_kind_enum(value),
  referral_source_id bigint null references public.referral_source(id) on delete set null,
  referral_contact_person_id bigint null references public.person(id) on delete set null,
  referral_other_text text null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id),
  -- Constraint: exactly one referral value must be set based on kind
  constraint chk_referral_contact check (
    (referral_kind != 'contact') OR (referral_contact_person_id is not null)
  ),
  constraint chk_referral_source check (
    (referral_kind != 'source') OR (referral_source_id is not null)
  ),
  constraint chk_referral_other check (
    (referral_kind != 'other') OR (referral_other_text is not null and referral_other_text != '')
  ),
  -- Ensure only the relevant field is set
  constraint chk_referral_exclusive check (
    (referral_kind = 'contact' and referral_source_id is null and referral_other_text is null) OR
    (referral_kind = 'source' and referral_contact_person_id is null and referral_other_text is null) OR
    (referral_kind = 'other' and referral_source_id is null and referral_contact_person_id is null)
  )
);

-- Trigger to ensure clinic_id matches patient.clinic_id
create or replace function public.fn_ensure_patient_referral_clinic_match()
returns trigger
language plpgsql
as $$
declare
  v_patient_clinic_id bigint;
begin
  select clinic_id into v_patient_clinic_id
  from public.patient
  where person_id = NEW.patient_person_id;
  
  if v_patient_clinic_id is null then
    raise exception 'Patient with person_id % does not exist', NEW.patient_person_id;
  end if;
  
  if NEW.clinic_id != v_patient_clinic_id then
    raise exception 'Patient referral clinic_id (%) must match patient clinic_id (%)', NEW.clinic_id, v_patient_clinic_id;
  end if;
  
  return NEW;
end;
$$;

drop trigger if exists tr_ensure_patient_referral_clinic_match on public.patient_referral;
create trigger tr_ensure_patient_referral_clinic_match
before insert or update on public.patient_referral
for each row execute function public.fn_ensure_patient_referral_clinic_match();

-- Indexes
create index if not exists idx_patient_referral_clinic_kind
on public.patient_referral(clinic_id, referral_kind, is_active);

create index if not exists idx_patient_referral_contact
on public.patient_referral(referral_contact_person_id)
where referral_contact_person_id is not null;

create index if not exists idx_patient_referral_source
on public.patient_referral(referral_source_id)
where referral_source_id is not null;

-- Audit triggers
drop trigger if exists tr_stamp_audit_columns on public.patient_referral;
create trigger tr_stamp_audit_columns
before insert or update on public.patient_referral
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.patient_referral;
create trigger tr_audit_row_change
after insert or update or delete on public.patient_referral
for each row execute function audit.fn_row_change_to_event();
