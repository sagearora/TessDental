-- ============================================================================
-- Person Relationships Implementation
-- ============================================================================
-- Implements specs/person-relationships.md
-- Adds primary contact, responsible party, and proper household relationships
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Add primary_contact_person_id and default_responsible_party_person_id to household
-- ----------------------------------------------------------------------------

alter table public.household
add column if not exists primary_contact_person_id bigint null references public.person(id) on delete restrict,
add column if not exists default_responsible_party_person_id bigint null references public.person(id) on delete restrict;

create index if not exists idx_household_primary_contact
on public.household(primary_contact_person_id)
where primary_contact_person_id is not null;

create index if not exists idx_household_responsible_party
on public.household(default_responsible_party_person_id)
where default_responsible_party_person_id is not null;

-- ----------------------------------------------------------------------------
-- 2) Migrate household_member: relationship_to_head -> relationship_to_primary_contact
-- ----------------------------------------------------------------------------

-- Add new column
alter table public.household_member
add column if not exists relationship_to_primary_contact text null;

-- Migrate existing data: relationship_to_head -> relationship_to_primary_contact
update public.household_member
set relationship_to_primary_contact = relationship_to_head
where relationship_to_primary_contact is null and relationship_to_head is not null;

-- Add constraint for new column
alter table public.household_member
drop constraint if exists chk_household_member_rel;

alter table public.household_member
add constraint chk_household_member_rel
check (
  relationship_to_primary_contact is null
  or relationship_to_primary_contact in ('self','child','spouse','parent','guardian','other')
);

-- Update constraint for relationship_to_head (keep for backward compatibility during migration)
-- We'll deprecate relationship_to_head later, but keep it for now

-- ----------------------------------------------------------------------------
-- 3) Add household_id to patient if missing
-- ----------------------------------------------------------------------------

alter table public.patient
add column if not exists household_id bigint null references public.household(id) on delete set null;

create index if not exists idx_patient_household
on public.patient(clinic_id, household_id)
where household_id is not null;

-- ----------------------------------------------------------------------------
-- 4) Helper function: Get patient age
-- ----------------------------------------------------------------------------

create or replace function public.fn_get_patient_age_years(p_person_id bigint)
returns integer
language plpgsql
stable
as $$
declare
  v_dob date;
  v_age integer;
begin
  select dob into v_dob
  from public.person
  where id = p_person_id;
  
  if v_dob is null then
    return null;
  end if;
  
  v_age := extract(year from age(v_dob))::integer;
  return v_age;
end;
$$;

-- ----------------------------------------------------------------------------
-- 5) Trigger: Ensure household contact/responsible are members
-- ----------------------------------------------------------------------------

create or replace function public.fn_ensure_household_contact_membership()
returns trigger
language plpgsql
as $$
begin
  -- If primary_contact_person_id is set, ensure membership exists
  if NEW.primary_contact_person_id is not null then
    if not exists (
      select 1
      from public.household_member
      where household_id = NEW.id
        and person_id = NEW.primary_contact_person_id
        and is_active = true
    ) then
      -- Auto-create membership
      insert into public.household_member (
        clinic_id,
        household_id,
        person_id,
        role,
        relationship_to_primary_contact,
        is_active
      )
      values (
        NEW.clinic_id,
        NEW.id,
        NEW.primary_contact_person_id,
        'head', -- Primary contact is typically the head
        'self',
        true
      )
      on conflict do nothing;
    end if;
  end if;
  
  -- If default_responsible_party_person_id is set, ensure membership exists
  if NEW.default_responsible_party_person_id is not null then
    if not exists (
      select 1
      from public.household_member
      where household_id = NEW.id
        and person_id = NEW.default_responsible_party_person_id
        and is_active = true
    ) then
      -- Auto-create membership
      insert into public.household_member (
        clinic_id,
        household_id,
        person_id,
        role,
        relationship_to_primary_contact,
        is_active
      )
      values (
        NEW.clinic_id,
        NEW.id,
        NEW.default_responsible_party_person_id,
        'member',
        case
          when NEW.default_responsible_party_person_id = NEW.primary_contact_person_id then 'self'
          else 'other'
        end,
        true
      )
      on conflict do nothing;
    end if;
  end if;
  
  return NEW;
end;
$$;

drop trigger if exists tr_ensure_household_contact_membership on public.household;
create trigger tr_ensure_household_contact_membership
after insert or update on public.household
for each row execute function public.fn_ensure_household_contact_membership();

-- ----------------------------------------------------------------------------
-- 6) Trigger: Ensure patient in household implies membership exists
-- ----------------------------------------------------------------------------

create or replace function public.fn_ensure_patient_household_membership()
returns trigger
language plpgsql
as $$
declare
  v_age integer;
  v_relationship text;
  v_primary_contact_id bigint;
begin
  -- If household_id is set, ensure membership exists
  if NEW.household_id is not null then
    if not exists (
      select 1
      from public.household_member
      where household_id = NEW.household_id
        and person_id = NEW.person_id
        and is_active = true
    ) then
      -- Get patient age
      v_age := public.fn_get_patient_age_years(NEW.person_id);
      
      -- Get primary contact from household
      select primary_contact_person_id into v_primary_contact_id
      from public.household
      where id = NEW.household_id;
      
      -- Determine relationship to primary contact
      if v_primary_contact_id = NEW.person_id then
        v_relationship := 'self';
      elsif v_age is not null and v_age < 18 then
        v_relationship := 'child';
      else
        v_relationship := 'other';
      end if;
      
      -- Insert membership
      insert into public.household_member (
        clinic_id,
        household_id,
        person_id,
        role,
        relationship_to_primary_contact,
        is_active
      )
      values (
        NEW.clinic_id,
        NEW.household_id,
        NEW.person_id,
        'member',
        v_relationship,
        true
      );
    end if;
  end if;
  
  return NEW;
end;
$$;

drop trigger if exists tr_ensure_patient_household_membership on public.patient;
create trigger tr_ensure_patient_household_membership
after insert or update on public.patient
for each row execute function public.fn_ensure_patient_household_membership();

-- ----------------------------------------------------------------------------
-- 7) Function: Set patient household defaults
-- ----------------------------------------------------------------------------

create or replace function public.fn_set_patient_household_defaults(p_patient_person_id bigint)
returns void
language plpgsql
as $$
declare
  v_patient record;
  v_household_id bigint;
  v_household_name text;
  v_age integer;
  v_primary_contact_id bigint;
  v_responsible_party_id bigint;
begin
  -- Get patient info
  select pt.*, p.last_name, p.clinic_id
  into v_patient
  from public.patient pt
  join public.person p on p.id = pt.person_id
  where pt.person_id = p_patient_person_id;
  
  if not found then
    raise exception 'Patient not found: %', p_patient_person_id;
  end if;
  
  -- If patient has no household, create one
  if v_patient.household_id is null then
    v_household_name := v_patient.last_name || ' Household';
    
    insert into public.household (clinic_id, name, is_active)
    values (v_patient.clinic_id, v_household_name, true)
    returning id into v_household_id;
    
    -- Update patient
    update public.patient
    set household_id = v_household_id
    where person_id = p_patient_person_id;
  else
    v_household_id := v_patient.household_id;
  end if;
  
  -- Get patient age
  v_age := public.fn_get_patient_age_years(p_patient_person_id);
  
  -- Set primary contact
  if v_age is not null and v_age >= 18 then
    v_primary_contact_id := p_patient_person_id;
  else
    -- Find first adult in household
    select hm.person_id into v_primary_contact_id
    from public.household_member hm
    join public.person p on p.id = hm.person_id
    where hm.household_id = v_household_id
      and hm.is_active = true
      and public.fn_get_patient_age_years(hm.person_id) >= 18
    limit 1;
    
    -- If no adult found, use patient
    if v_primary_contact_id is null then
      v_primary_contact_id := p_patient_person_id;
    end if;
  end if;
  
  -- Set default responsible party = primary contact
  v_responsible_party_id := v_primary_contact_id;
  
  -- Update household
  update public.household
  set primary_contact_person_id = v_primary_contact_id,
      default_responsible_party_person_id = v_responsible_party_id
  where id = v_household_id;
  
  -- Ensure patient_financial exists
  insert into public.patient_financial (
    patient_person_id,
    clinic_id,
    responsible_party_person_id,
    billing_address_source
  )
  values (
    p_patient_person_id,
    v_patient.clinic_id,
    v_responsible_party_id,
    'responsible_party'
  )
  on conflict (patient_person_id) do update
  set responsible_party_person_id = v_responsible_party_id;
end;
$$;

-- ----------------------------------------------------------------------------
-- 8) Function: Set responsible party
-- ----------------------------------------------------------------------------

create or replace function public.fn_set_responsible_party(
  p_patient_person_id bigint,
  p_responsible_person_id bigint,
  p_apply_to_household boolean default false
)
returns void
language plpgsql
as $$
declare
  v_patient record;
  v_household_id bigint;
begin
  -- Get patient info
  select pt.* into v_patient
  from public.patient pt
  where pt.person_id = p_patient_person_id;
  
  if not found then
    raise exception 'Patient not found: %', p_patient_person_id;
  end if;
  
  -- Update patient_financial for this patient
  insert into public.patient_financial (
    patient_person_id,
    clinic_id,
    responsible_party_person_id,
    billing_address_source
  )
  values (
    p_patient_person_id,
    v_patient.clinic_id,
    p_responsible_person_id,
    'responsible_party'
  )
  on conflict (patient_person_id) do update
  set responsible_party_person_id = p_responsible_person_id;
  
  -- If apply to household, update household default and all patient_financial rows
  if p_apply_to_household and v_patient.household_id is not null then
    -- Update household default
    update public.household
    set default_responsible_party_person_id = p_responsible_person_id
    where id = v_patient.household_id;
    
    -- Update all patient_financial for household patients
    update public.patient_financial pf
    set responsible_party_person_id = p_responsible_person_id
    from public.patient pt
    where pt.person_id = pf.patient_person_id
      and pt.household_id = v_patient.household_id;
  end if;
end;
$$;

-- ----------------------------------------------------------------------------
-- 9) Update unique constraint name for household_member (per spec)
-- ----------------------------------------------------------------------------

drop index if exists public.idx_household_member_person_unique;
create unique index if not exists uq_household_member_person_active
on public.household_member(person_id)
where is_active = true;

drop index if exists public.idx_household_member_head_unique;
create unique index if not exists uq_household_member_household_head
on public.household_member(household_id)
where is_active = true and role = 'head';

-- ----------------------------------------------------------------------------
-- 10) Update patient_financial to add is_active (per spec)
-- ----------------------------------------------------------------------------

alter table public.patient_financial
add column if not exists is_active boolean not null default true;

-- Add index for responsible party lookup
create index if not exists idx_patient_financial_responsible
on public.patient_financial(clinic_id, responsible_party_person_id)
where is_active = true;
