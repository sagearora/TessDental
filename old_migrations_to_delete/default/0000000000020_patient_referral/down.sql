-- ============================================================================
-- Patient Referral System Rollback
-- ============================================================================

-- Drop patient_referral table
drop table if exists public.patient_referral cascade;

-- Drop referral_source table
drop table if exists public.referral_source cascade;

-- Drop referral_kind_enum table
drop table if exists public.referral_kind_enum cascade;
