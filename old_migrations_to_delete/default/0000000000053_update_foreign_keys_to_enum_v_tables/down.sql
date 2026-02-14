-- Rollback for foreign key updates to enum_v tables

BEGIN;

-- Drop new foreign keys
ALTER TABLE IF EXISTS public.role_capability
  DROP CONSTRAINT IF EXISTS role_capability_capability_key_v_fkey;

ALTER TABLE IF EXISTS public.patient_referral
  DROP CONSTRAINT IF EXISTS patient_referral_referral_kind_v_fkey;

ALTER TABLE IF EXISTS public.patient
  DROP CONSTRAINT IF EXISTS fk_patient_status_v;

ALTER TABLE IF EXISTS public.person
  DROP CONSTRAINT IF EXISTS fk_person_gender_v;

-- Restore original foreign keys
ALTER TABLE IF EXISTS public.role_capability
  ADD CONSTRAINT role_capability_capability_key_fkey
  FOREIGN KEY (capability_key) REFERENCES public.capability(key) ON DELETE RESTRICT;

ALTER TABLE IF EXISTS public.patient_referral
  ADD CONSTRAINT patient_referral_referral_kind_fkey
  FOREIGN KEY (referral_kind) REFERENCES public.referral_kind_enum(value);

ALTER TABLE IF EXISTS public.patient
  ADD CONSTRAINT fk_patient_status
  FOREIGN KEY (status) REFERENCES public.patient_status_enum(value);

ALTER TABLE IF EXISTS public.person
  ADD CONSTRAINT fk_person_gender
  FOREIGN KEY (gender) REFERENCES public.gender_enum(value);

COMMIT;
