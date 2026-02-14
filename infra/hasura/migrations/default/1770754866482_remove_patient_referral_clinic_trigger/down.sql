-- ============================================================================
-- Rollback: Recreate patient_referral clinic_id trigger
-- ============================================================================
-- Recreates the trigger and function for migration rollback capability
-- Note: This trigger references non-existent columns and will cause errors
-- ============================================================================

-- Recreate the function
CREATE FUNCTION public.fn_ensure_patient_referral_clinic_match() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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

-- Recreate the trigger
CREATE TRIGGER tr_ensure_patient_referral_clinic_match 
    BEFORE INSERT OR UPDATE ON public.patient_referral 
    FOR EACH ROW 
    EXECUTE FUNCTION public.fn_ensure_patient_referral_clinic_match();
