-- ============================================================================
-- Person Relationships Views - Rollback
-- ============================================================================

drop view if exists public.household_members_v;
drop view if exists public.patient_profile_v;

-- Restore original patient_profile_v if needed (from migration 0016)
-- This would need to be done manually if you want to restore the old view
