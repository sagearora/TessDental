-- ============================================================================
-- Rollback: Person family links v2 (recreate household tables)
-- ============================================================================
-- Note: This rollback recreates household tables but cannot restore exact data
-- ============================================================================

-- Recreate household table
create table if not exists public.household (
  id bigserial primary key,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  name text null,
  primary_contact_person_id bigint null references public.person(id) on delete restrict,
  default_responsible_party_person_id bigint null references public.person(id) on delete restrict,
  is_active boolean not null default true,
  deactivated_at timestamptz null,
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id)
);

create index if not exists idx_household_clinic_active
on public.household (clinic_id, is_active);

-- Recreate household_member table
create table if not exists public.household_member (
  id bigserial primary key,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  household_id bigint not null references public.household(id) on delete cascade,
  person_id bigint not null references public.person(id) on delete cascade,
  role text not null default 'member',
  relationship_to_primary_contact text null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id)
);

create unique index if not exists uq_household_member_person_active
on public.household_member (person_id)
where is_active = true;

create index if not exists idx_household_member_household
on public.household_member (household_id, is_active);

-- Add household_id back to patient
alter table public.patient
add column if not exists household_id bigint null references public.household(id) on delete set null;

create index if not exists idx_patient_household
on public.patient(clinic_id, household_id)
where household_id is not null;

-- Recreate household_members_v view
create or replace view public.household_members_v as
select
  hm.household_id,
  hm.person_id,
  p.first_name,
  p.last_name,
  p.preferred_name,
  p.dob,
  hm.relationship_to_primary_contact,
  hm.role,
  case when pt.person_id is not null then true else false end as is_patient,
  pt.chart_no,
  hm.is_active,
  hm.created_at,
  hm.updated_at
from public.household_member hm
join public.person p on p.id = hm.person_id
left join public.patient pt on pt.person_id = hm.person_id
where hm.is_active = true;

-- Note: Functions and triggers would need to be recreated separately if needed
