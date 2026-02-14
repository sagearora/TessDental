-- ============================================================================
-- Expose Household Function for Hasura
-- ============================================================================
-- Creates a wrapper function that returns household_id so it can be used as a mutation
-- ============================================================================

-- Wrapper function that returns the household_id after setting defaults
create or replace function public.fn_set_patient_household_defaults_v2(p_patient_person_id bigint)
returns bigint
language plpgsql
security definer
as $$
declare
  v_household_id bigint;
begin
  -- Call the original function
  perform public.fn_set_patient_household_defaults(p_patient_person_id);
  
  -- Get the household_id
  select household_id into v_household_id
  from public.patient
  where person_id = p_patient_person_id;
  
  return v_household_id;
end;
$$;

comment on function public.fn_set_patient_household_defaults_v2(bigint) is 'Sets patient household defaults and returns the household_id. Can be called via Hasura.';
