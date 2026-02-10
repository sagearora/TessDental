-- ============================================================================
-- Revert household_relationship validation to be based on responsible_party_id
-- ============================================================================

-- Restore original validation (based on responsible_party_id)
create or replace function public.fn_validate_person_responsible_party()
returns trigger
language plpgsql
as $$
declare
  v_is_responsible_for_others boolean;
begin
  -- Normalize relationship when root
  if NEW.responsible_party_id is null then
    if NEW.household_relationship is null then
      NEW.household_relationship := 'self';
    end if;
    if NEW.household_relationship <> 'self' then
      raise exception 'root_person_must_have_relationship_self';
    end if;
  else
    if NEW.responsible_party_id = NEW.id then
      raise exception 'responsible_party_id_cannot_reference_self';
    end if;
    if NEW.household_relationship is null then
      raise exception 'relationship_required_when_responsible_party_id_is_set';
    end if;
    if NEW.household_relationship = 'self' then
      raise exception 'relationship_self_not_allowed_when_responsible_party_id_is_set';
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
