-- ============================================================================
-- Rollback: Remove current_person_id column from clinic_user table
-- ============================================================================

-- Drop index
DROP INDEX IF EXISTS public.idx_clinic_user_current_person;

-- Restore clinic_user_v view without current_person_id
CREATE OR REPLACE VIEW public.clinic_user_v AS
 SELECT id,
    clinic_id,
    user_id,
    is_active,
    joined_at
   FROM public.clinic_user;

-- Drop current_person_id column (this will also drop the foreign key constraint)
ALTER TABLE public.clinic_user
  DROP COLUMN IF EXISTS current_person_id;
