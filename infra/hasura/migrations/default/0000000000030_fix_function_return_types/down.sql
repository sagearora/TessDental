-- ============================================================================
-- Rollback: Fix Function Return Types
-- ============================================================================

-- Restore original function signatures (returning scalars)
drop function if exists public.fn_set_patient_household_defaults_v2(bigint);
drop function if exists public.fn_set_responsible_party_v2(bigint, bigint, boolean);

-- Recreate with scalar return types
create or replace function public.fn_set_patient_household_defaults_v2(p_patient_person_id bigint)
returns bigint
language plpgsql
security definer
as $$
declare
  v_household_id bigint;
begin
  perform public.fn_set_patient_household_defaults(p_patient_person_id);
  select household_id into v_household_id
  from public.patient
  where person_id = p_patient_person_id;
  return v_household_id;
end;
$$;

create or replace function public.fn_set_responsible_party_v2(
  p_patient_person_id bigint,
  p_responsible_person_id bigint,
  p_apply_to_household boolean default false
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_result jsonb;
begin
  perform public.fn_set_responsible_party(
    p_patient_person_id,
    p_responsible_person_id,
    p_apply_to_household
  );
  v_result := jsonb_build_object(
    'success', true,
    'patient_person_id', p_patient_person_id,
    'responsible_party_person_id', p_responsible_person_id,
    'apply_to_household', p_apply_to_household
  );
  return v_result;
end;
$$;
