-- Add name and image_source columns to imaging_asset
ALTER TABLE public.imaging_asset
  ADD COLUMN name text,
  ADD COLUMN image_source image_source_enum;

-- Make study_id nullable (assets can exist without studies)
ALTER TABLE public.imaging_asset
  ALTER COLUMN study_id DROP NOT NULL;

COMMENT ON COLUMN public.imaging_asset.name IS 'User-editable name for the image';
COMMENT ON COLUMN public.imaging_asset.image_source IS 'Source device type for the image capture';
