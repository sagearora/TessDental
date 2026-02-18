ALTER TABLE public.imaging_asset
  DROP COLUMN IF EXISTS display_adjustments;

ALTER TABLE public.imaging_mount_slot
  DROP COLUMN IF EXISTS adjustments;
