-- ============================================================================
-- Remove patient_referral clinic_id trigger
-- ============================================================================
-- Drops the trigger and function that reference non-existent clinic_id columns
-- in patient_referral and patient tables
-- ============================================================================

-- Drop the trigger first
DROP TRIGGER IF EXISTS tr_ensure_patient_referral_clinic_match ON public.patient_referral;

-- Drop the function
DROP FUNCTION IF EXISTS public.fn_ensure_patient_referral_clinic_match();
