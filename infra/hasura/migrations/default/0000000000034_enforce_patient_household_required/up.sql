-- ============================================================================
-- Enforce Patient Household Required (v1 Best Practice)
-- ============================================================================
-- Implements: Every patient must belong to exactly one active household
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Add deactivated_at to household (for audit trail)
-- ----------------------------------------------------------------------------

alter table public.household
add column if not exists deactivated_at timestamptz null;

create index if not exists idx_household_deactivated_at
on public.household(deactivated_at)
where deactivated_at is not null;

-- ----------------------------------------------------------------------------
-- 2) Function: Create household for patient
-- ----------------------------------------------------------------------------

create or replace function public.fn_create_household_for_patient(p_person_id bigint)
returns bigint
language plpgsql
as $$
declare
  v_person record;
  v_household_id bigint;
  v_household_name text;
  v_age integer;
begin
  -- Get person info
  select p.* into v_person
  from public.person p
  where p.id = p_person_id;
  
  if not found then
    raise exception 'Person not found: %', p_person_id;
  end if;
  
  -- Generate household name
  if v_person.last_name is not null and v_person.last_name != '' then
    v_household_name := v_person.last_name || ' Household';
  elsif v_person.first_name is not null then
    v_household_name := v_person.first_name || ' Household';
  else
    v_household_name := 'Household';
  end if;
  
  -- Create household
  insert into public.household (clinic_id, name, is_active)
  values (v_person.clinic_id, v_household_name, true)
  returning id into v_household_id;
  
  -- Get patient age to determine primary contact
  v_age := public.fn_get_patient_age_years(p_person_id);
  
  -- Set primary contact and default responsible party
  -- For adults: self; for children: self (will be updated when parent added)
  update public.household
  set primary_contact_person_id = p_person_id,
      default_responsible_party_person_id = p_person_id
  where id = v_household_id;
  
  -- Create household_member record
  -- The trigger on household will ensure membership exists, but we create it explicitly
  insert into public.household_member (
    clinic_id,
    household_id,
    person_id,
    role,
    relationship_to_primary_contact,
    is_active
  )
  values (
    v_person.clinic_id,
    v_household_id,
    p_person_id,
    'head', -- First member is the head
    'self',
    true
  )
  on conflict do nothing;
  
  return v_household_id;
end;
$$;

comment on function public.fn_create_household_for_patient(bigint) is 'Creates a new household for a patient, sets up primary contact and responsible party defaults, and creates household membership. Returns the household_id.';

-- ----------------------------------------------------------------------------
-- 3) Trigger: Auto-create household on patient insert if household_id is null
-- ----------------------------------------------------------------------------

create or replace function public.fn_patient_before_insert_auto_household()
returns trigger
language plpgsql
as $$
declare
  v_household_id bigint;
begin
  -- If household_id is null, create household automatically
  if NEW.household_id is null then
    v_household_id := public.fn_create_household_for_patient(NEW.person_id);
    NEW.household_id := v_household_id;
  end if;
  
  -- The existing tr_ensure_patient_household_membership trigger (AFTER INSERT)
  -- will handle creating the household_member record
  return NEW;
end;
$$;

drop trigger if exists tr_patient_auto_household on public.patient;
create trigger tr_patient_auto_household
before insert on public.patient
for each row execute function public.fn_patient_before_insert_auto_household();

comment on trigger tr_patient_auto_household on public.patient is 'Automatically creates a household for a patient if household_id is null on insert. Sets NEW.household_id before the row is inserted.';

-- ----------------------------------------------------------------------------
-- 4) Function: Check and deactivate empty households
-- ----------------------------------------------------------------------------

create or replace function public.fn_deactivate_empty_households()
returns void
language plpgsql
as $$
declare
  v_household_id bigint;
begin
  -- Find households with no active patient members
  -- Option B: no active patients (better for billing history)
  for v_household_id in
    select h.id
    from public.household h
    where h.is_active = true
      and not exists (
        select 1
        from public.patient pt
        join public.household_member hm on hm.person_id = pt.person_id
        where pt.household_id = h.id
          and pt.is_active = true
          and hm.is_active = true
          and hm.household_id = h.id
      )
  loop
    -- Soft deactivate (don't delete)
    update public.household
    set is_active = false,
        deactivated_at = now()
    where id = v_household_id;
  end loop;
end;
$$;

comment on function public.fn_deactivate_empty_households() is 'Deactivates households that have no active patient members. Soft deactivation (sets is_active=false) to preserve billing history.';

-- ----------------------------------------------------------------------------
-- 5) Trigger: Deactivate empty households after membership/patient changes
-- ----------------------------------------------------------------------------

create or replace function public.fn_check_household_after_membership_change()
returns trigger
language plpgsql
as $$
begin
  -- Check if the household has any active patient members
  -- This runs after UPDATE or DELETE on household_member
  if TG_OP = 'UPDATE' then
    -- Check the household from the updated/deleted row
    perform public.fn_deactivate_empty_households();
  elsif TG_OP = 'DELETE' then
    -- Check the household from the deleted row
    perform public.fn_deactivate_empty_households();
  end if;
  
  return case when TG_OP = 'DELETE' then OLD else NEW end;
end;
$$;

drop trigger if exists tr_check_household_after_membership_change on public.household_member;
create trigger tr_check_household_after_membership_change
after update of is_active or delete on public.household_member
for each row execute function public.fn_check_household_after_membership_change();

comment on trigger tr_check_household_after_membership_change on public.household_member is 'Checks and deactivates empty households after membership changes.';

-- Also check when patient is deactivated or household_id changes
create or replace function public.fn_check_household_after_patient_change()
returns trigger
language plpgsql
as $$
begin
  -- If patient is deactivated or household_id changed, check old household
  if TG_OP = 'UPDATE' then
    if (OLD.is_active = true and NEW.is_active = false) or 
       (OLD.household_id is distinct from NEW.household_id) then
      -- Check old household
      if OLD.household_id is not null then
        perform public.fn_deactivate_empty_households();
      end if;
    end if;
  elsif TG_OP = 'DELETE' then
    -- Check old household
    if OLD.household_id is not null then
      perform public.fn_deactivate_empty_households();
    end if;
  end if;
  
  return case when TG_OP = 'DELETE' then OLD else NEW end;
end;
$$;

drop trigger if exists tr_check_household_after_patient_change on public.patient;
create trigger tr_check_household_after_patient_change
after update of is_active, household_id or delete on public.patient
for each row execute function public.fn_check_household_after_patient_change();

comment on trigger tr_check_household_after_patient_change on public.patient is 'Checks and deactivates empty households after patient changes.';

-- ----------------------------------------------------------------------------
-- 6) Backfill: Create households for existing patients without households
-- ----------------------------------------------------------------------------

do $$
declare
  v_patient record;
  v_household_id bigint;
begin
  -- Loop through all patients without households
  for v_patient in
    select pt.person_id, pt.clinic_id, p.last_name, p.first_name
    from public.patient pt
    join public.person p on p.id = pt.person_id
    where pt.household_id is null
      and pt.is_active = true
  loop
    -- Create household for this patient
    v_household_id := public.fn_create_household_for_patient(v_patient.person_id);
    
    -- Update patient with household_id
    update public.patient
    set household_id = v_household_id
    where person_id = v_patient.person_id;
  end loop;
end;
$$;

-- ----------------------------------------------------------------------------
-- 7) Make household_id NOT NULL (after backfill)
-- ----------------------------------------------------------------------------

alter table public.patient
alter column household_id set not null;

-- Update index to remove the partial index (since all rows will have household_id)
drop index if exists public.idx_patient_household;
create index if not exists idx_patient_household
on public.patient(clinic_id, household_id);

comment on column public.patient.household_id is 'Required: Every patient must belong to exactly one active household. Automatically created on patient insert if not provided.';
