-- ============================================================================
-- Remove Trigram GIN Indexes for Name Search
-- ============================================================================

DROP INDEX IF EXISTS person_active_preferred_name_trgm_idx;
DROP INDEX IF EXISTS person_active_middle_name_trgm_idx;
DROP INDEX IF EXISTS person_active_last_name_trgm_idx;
DROP INDEX IF EXISTS person_active_first_name_trgm_idx;
