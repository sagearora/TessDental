-- Remove name and image_source columns from imaging_asset
ALTER TABLE public.imaging_asset
  DROP COLUMN IF EXISTS name,
  DROP COLUMN IF EXISTS image_source;

-- Make study_id required again (restore original constraint)
-- Note: This may fail if there are existing assets without study_id
ALTER TABLE public.imaging_asset
  ALTER COLUMN study_id SET NOT NULL;
