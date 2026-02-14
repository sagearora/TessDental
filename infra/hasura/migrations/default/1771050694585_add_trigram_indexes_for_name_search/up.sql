-- ============================================================================
-- Add Trigram GIN Indexes for Name Search
-- ============================================================================
-- Creates GIN trigram indexes on person name fields to enable fast contains
-- matching. This allows searching "lawrence" to find "St Lawrence" efficiently.
-- ============================================================================

-- Ensure pg_trgm extension is enabled (should already exist from init migration)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN trigram indexes for contains matching
-- These work alongside existing prefix indexes (text_pattern_ops)
-- GIN indexes support efficient contains/substring matching with ILIKE '%term%'

CREATE INDEX IF NOT EXISTS person_active_first_name_trgm_idx
ON public.person USING gin (lower(first_name) gin_trgm_ops)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS person_active_last_name_trgm_idx
ON public.person USING gin (lower(last_name) gin_trgm_ops)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS person_active_middle_name_trgm_idx
ON public.person USING gin (lower(middle_name) gin_trgm_ops)
WHERE (is_active = true AND middle_name IS NOT NULL);

CREATE INDEX IF NOT EXISTS person_active_preferred_name_trgm_idx
ON public.person USING gin (lower(preferred_name) gin_trgm_ops)
WHERE (is_active = true AND preferred_name IS NOT NULL);
