-- ============================================================================
-- Fix household_relationship to be related to household_head_id, not responsible_party_id
-- ============================================================================
-- Updates validation trigger to enforce:
-- - If household_head_id is null => household_relationship must be 'self' or null
-- - If household_head_id is set => household_relationship must be set and not 'self'
-- ============================================================================

-- 1) Update validation trigger function
create or replace function public.fn_validate_person_responsible_party()
returns trigger
language plpgsql
as $$
declare
  v_is_responsible_for_others boolean;
begin
  -- Validate household_relationship based on household_head_id (not responsible_party_id)
  if NEW.household_head_id is null then
    -- If no household head, relationship should be 'self' or null
    if NEW.household_relationship is not null and NEW.household_relationship <> 'self' then
      raise exception 'household_relationship must be "self" or null when household_head_id is null';
    end if;
    -- Normalize to 'self' if null
    if NEW.household_relationship is null then
      NEW.household_relationship := 'self';
    end if;
  else
    -- If household_head_id is set, relationship must be set and not 'self'
    if NEW.household_head_id = NEW.id then
      raise exception 'person cannot be their own household head';
    end if;
    if NEW.household_relationship is null then
      raise exception 'household_relationship is required when household_head_id is set';
    end if;
    if NEW.household_relationship = 'self' then
      raise exception 'household_relationship cannot be "self" when household_head_id is set';
    end if;
    
    -- Household head must be a valid head (household_head_id = null)
    if exists (
      select 1
      from public.person hh
      where hh.id = NEW.household_head_id
        and hh.household_head_id is not null
    ) then
      raise exception 'household_head_id must point to a person with household_head_id = null (a household head)';
    end if;
  end if;

  -- Keep existing responsible_party_id validations (unchanged)
  if NEW.responsible_party_id is null then
    -- Root person for responsible party
    -- (household_relationship validation is now based on household_head_id above)
  else
    if NEW.responsible_party_id = NEW.id then
      raise exception 'responsible_party_id_cannot_reference_self';
    end if;

    -- Responsible party must be a root (must have null responsible_party_id)
    if exists (
      select 1
      from public.person rp
      where rp.id = NEW.responsible_party_id
        and rp.responsible_party_id is not null
    ) then
      raise exception 'responsible_party_must_be_root_with_null_responsible_party_id';
    end if;
  end if;

  -- If NEW is responsible party for others, NEW must be root (responsible_party_id null)
  select exists (
    select 1
    from public.person p
    where p.responsible_party_id = NEW.id
      and p.is_active = true
  ) into v_is_responsible_for_others;

  if v_is_responsible_for_others and NEW.responsible_party_id is not null then
    raise exception 'person_who_is_responsible_party_for_others_must_have_null_responsible_party_id';
  end if;

  return NEW;
end;
$$;

comment on function public.fn_validate_person_responsible_party() is 'Validates person relationships: household_relationship is based on household_head_id, responsible_party_id has separate validation';
