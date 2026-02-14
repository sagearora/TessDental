-- Rollback for Hasura enum tables

BEGIN;

-- Drop triggers
DROP TRIGGER IF EXISTS tr_sync_capability_enum_v ON public.capability;
DROP TRIGGER IF EXISTS tr_sync_referral_kind_enum_v ON public.referral_kind_enum;
DROP TRIGGER IF EXISTS tr_sync_patient_status_enum_v ON public.patient_status_enum;
DROP TRIGGER IF EXISTS tr_sync_gender_enum_v ON public.gender_enum;

-- Drop trigger functions
DROP FUNCTION IF EXISTS public.sync_capability_enum_v();
DROP FUNCTION IF EXISTS public.sync_referral_kind_enum_v();
DROP FUNCTION IF EXISTS public.sync_patient_status_enum_v();
DROP FUNCTION IF EXISTS public.sync_gender_enum_v();

-- Drop simplified enum tables
DROP TABLE IF EXISTS public.capability_enum_v CASCADE;
DROP TABLE IF EXISTS public.referral_kind_enum_v CASCADE;
DROP TABLE IF EXISTS public.patient_status_enum_v CASCADE;
DROP TABLE IF EXISTS public.gender_enum_v CASCADE;

COMMIT;
