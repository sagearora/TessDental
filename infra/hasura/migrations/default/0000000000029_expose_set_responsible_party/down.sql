-- ============================================================================
-- Rollback: Expose Set Responsible Party Function
-- ============================================================================

drop function if exists public.fn_set_responsible_party_v2(bigint, bigint, boolean);
