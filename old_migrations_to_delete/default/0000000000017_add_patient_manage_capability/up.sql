-- ============================================================================
-- Add patient.manage capability
-- ============================================================================
-- Ensures the patient.manage capability exists in the database
-- ============================================================================

INSERT INTO public.capability (key, description, module, is_deprecated)
VALUES ('patient.manage', 'Manage patients and contacts', 'patient', false)
ON CONFLICT (key) DO UPDATE
  SET description = EXCLUDED.description,
      module = EXCLUDED.module,
      is_deprecated = EXCLUDED.is_deprecated;
