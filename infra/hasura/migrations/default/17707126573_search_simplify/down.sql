-- Best-effort rollback for search_simplify migration

BEGIN;

-- 1) Drop new trigger and function
DROP TRIGGER IF EXISTS tr_person_contact_point_set_value_norm ON public.person_contact_point;
DROP FUNCTION IF EXISTS public.fn_person_contact_point_set_value_norm() CASCADE;

-- 2) Drop indexes added in this migration
DROP INDEX IF EXISTS pcp_active_email_norm_idx;
DROP INDEX IF EXISTS pcp_active_phone_last10_idx;
DROP INDEX IF EXISTS person_active_first_name_prefix_idx;
DROP INDEX IF EXISTS person_active_last_name_prefix_idx;
DROP INDEX IF EXISTS person_active_middle_name_prefix_idx;
DROP INDEX IF EXISTS person_active_preferred_name_prefix_idx;

-- 3) Drop generated column phone_last10 (if present)
ALTER TABLE public.person_contact_point
  DROP COLUMN IF EXISTS phone_last10;

-- NOTE: We intentionally keep value_norm column, since older migrations and
-- functions referred to it and other rollback paths may expect it.

-- 4) We do NOT attempt to recreate all legacy person_search / trigram objects here.
-- Older migrations (0000000000021_* through 0000000000050_*) define them, and a
-- full rollback would require replaying those migrations in reverse.

COMMIT;

