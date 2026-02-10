-- ============================================================================
-- Rollback: Fix Patient Household Membership Trigger
-- ============================================================================

-- Restore previous version (if needed)
-- Note: This would restore the broken version, so we'll just drop and recreate
drop function if exists public.fn_ensure_patient_household_membership();
