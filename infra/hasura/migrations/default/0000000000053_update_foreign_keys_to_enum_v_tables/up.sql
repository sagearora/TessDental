-- =========================================================
-- Update foreign keys to reference simplified enum tables
-- Hasura requires foreign keys to reference the enum table
-- that is marked as is_enum: true
-- =========================================================

BEGIN;

-- =========================================================
-- 1) Drop existing foreign key constraints
-- =========================================================

-- Drop gender foreign key
ALTER TABLE IF EXISTS public.person
  DROP CONSTRAINT IF EXISTS fk_person_gender;

-- Drop patient status foreign key
ALTER TABLE IF EXISTS public.patient
  DROP CONSTRAINT IF EXISTS fk_patient_status;

-- Drop referral kind foreign key
ALTER TABLE IF EXISTS public.patient_referral
  DROP CONSTRAINT IF EXISTS patient_referral_referral_kind_fkey;

-- Drop capability foreign key
ALTER TABLE IF EXISTS public.role_capability
  DROP CONSTRAINT IF EXISTS role_capability_capability_key_fkey;

-- =========================================================
-- 2) Add new foreign keys to simplified enum tables
-- =========================================================

-- Add gender foreign key to gender_enum_v
ALTER TABLE IF EXISTS public.person
  ADD CONSTRAINT fk_person_gender_v
  FOREIGN KEY (gender) REFERENCES public.gender_enum_v(value);

-- Add patient status foreign key to patient_status_enum_v
ALTER TABLE IF EXISTS public.patient
  ADD CONSTRAINT fk_patient_status_v
  FOREIGN KEY (status) REFERENCES public.patient_status_enum_v(value);

-- Add referral kind foreign key to referral_kind_enum_v
ALTER TABLE IF EXISTS public.patient_referral
  ADD CONSTRAINT patient_referral_referral_kind_v_fkey
  FOREIGN KEY (referral_kind) REFERENCES public.referral_kind_enum_v(value);

-- Add capability foreign key to capability_enum_v
-- Note: capability_enum_v uses 'key' not 'value' as primary key
ALTER TABLE IF EXISTS public.role_capability
  ADD CONSTRAINT role_capability_capability_key_v_fkey
  FOREIGN KEY (capability_key) REFERENCES public.capability_enum_v(key) ON DELETE RESTRICT;

COMMIT;
