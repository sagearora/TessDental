-- Add display_adjustments to imaging_asset (non-destructive per-image transform params)
ALTER TABLE public.imaging_asset
  ADD COLUMN IF NOT EXISTS display_adjustments jsonb;

COMMENT ON COLUMN public.imaging_asset.display_adjustments IS 'Optional display-only adjustments (invert, flip_h, flip_v, rotate, gamma, brightness, contrast, sharpen). Applied at render time; original image unchanged. Reversible by clearing.';

-- Add adjustments to imaging_mount_slot (per-slot overrides for mount view)
ALTER TABLE public.imaging_mount_slot
  ADD COLUMN IF NOT EXISTS adjustments jsonb;

COMMENT ON COLUMN public.imaging_mount_slot.adjustments IS 'Optional per-slot display adjustments (same shape as display_adjustments). Overrides template defaults when rendering this slot.';
