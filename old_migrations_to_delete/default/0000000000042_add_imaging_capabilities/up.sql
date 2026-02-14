-- ============================================================================
-- Add imaging capabilities
-- ============================================================================
-- Ensures the imaging.read and imaging.write capabilities exist in the database
-- ============================================================================

INSERT INTO public.capability (key, description, module, is_deprecated)
VALUES 
  ('imaging.read', 'View and access imaging assets', 'imaging', false),
  ('imaging.write', 'Upload, create, and delete imaging assets', 'imaging', false)
ON CONFLICT (key) DO UPDATE
  SET description = EXCLUDED.description,
      module = EXCLUDED.module,
      is_deprecated = EXCLUDED.is_deprecated;
