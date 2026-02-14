-- ============================================================================
-- Add current_person_id column to clinic_user table
-- ============================================================================
-- Adds a column to track the currently selected person for each clinic_user
-- This allows the PersonNavigator to show the selected person's information
-- ============================================================================

-- Add current_person_id column to clinic_user table
ALTER TABLE public.clinic_user
  ADD COLUMN current_person_id bigint NULL
  REFERENCES public.person(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX idx_clinic_user_current_person ON public.clinic_user(current_person_id);

-- Update clinic_user_v view to include current_person_id
CREATE OR REPLACE VIEW public.clinic_user_v AS
 SELECT id,
    clinic_id,
    user_id,
    is_active,
    joined_at,
    current_person_id
   FROM public.clinic_user;
