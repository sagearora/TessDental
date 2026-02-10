-- ============================================================================
-- Fix Trigger Function Syntax
-- ============================================================================
-- Removes nested declare block and fixes the trigger function
-- ============================================================================

create or replace function public.fn_ensure_patient_household_membership()
returns trigger
language plpgsql
as $$
declare
  v_age integer;
  v_relationship text;
  v_primary_contact_id bigint;
  v_role text;
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
      
      -- Determine relationship to primary contact and role
      if v_primary_contact_id = NEW.person_id then
        -- This person is the primary contact, so they're the head
        v_role := 'head';
        v_relationship := 'self';
      else
        -- Regular member
        v_role := 'member';
        if v_age is not null and v_age < 18 then
          v_relationship := 'child';
        else
          v_relationship := 'other';
        end if;
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
        v_role,
        v_relationship,
        true
      )
      on conflict do nothing;
    end if;
  end if;
  
  return NEW;
end;
$$;

comment on function public.fn_ensure_patient_household_membership() is 'Ensures that when a patient is assigned to a household, a household_member record is created automatically.';
