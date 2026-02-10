-- Rollback for post-migration cleanup
-- Note: This rollback recreates old functions/triggers that may not work
-- with the new schema structure. Use with caution.

BEGIN;

-- Drop views
DROP VIEW IF EXISTS public.patient_profile_v CASCADE;
DROP VIEW IF EXISTS public.clinic_user_effective_capabilities_v CASCADE;

-- Drop new fn_search_people
DROP FUNCTION IF EXISTS public.fn_search_people(bigint, text, integer, boolean);

-- Note: We don't recreate the old functions/triggers that referenced
-- dropped columns (person.search_*, patient.clinic_id) as they would
-- be invalid. If you need to rollback, you would need to restore those
-- columns first.

COMMIT;
