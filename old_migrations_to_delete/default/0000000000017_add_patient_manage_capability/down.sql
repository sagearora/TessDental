-- ============================================================================
-- Remove patient.manage capability (rollback)
-- ============================================================================
-- Note: We don't actually delete it, just mark as deprecated
-- to avoid breaking existing role assignments

UPDATE public.capability
SET is_deprecated = true
WHERE key = 'patient.manage';
