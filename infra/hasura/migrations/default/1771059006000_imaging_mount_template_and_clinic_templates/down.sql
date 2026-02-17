-- Revert backfill: not required for down
-- Revert imaging_mount: restore template_id NOT NULL, drop clinic_template_id
UPDATE public.imaging_mount SET template_id = (SELECT id FROM public.imaging_mount_template WHERE is_active = true ORDER BY id LIMIT 1) WHERE template_id IS NULL;
ALTER TABLE public.imaging_mount DROP CONSTRAINT IF EXISTS chk_imaging_mount_template_source;
ALTER TABLE public.imaging_mount ALTER COLUMN template_id SET NOT NULL;
ALTER TABLE public.imaging_mount DROP COLUMN IF EXISTS clinic_template_id;
DROP INDEX IF EXISTS public.idx_imaging_mount_clinic_template;

-- Drop clinic template table and triggers
DROP TRIGGER IF EXISTS trg_imaging_clinic_mount_template_audit_event ON public.imaging_clinic_mount_template;
DROP TRIGGER IF EXISTS trg_imaging_clinic_mount_template_audit_stamp ON public.imaging_clinic_mount_template;
DROP TABLE IF EXISTS public.imaging_clinic_mount_template CASCADE;

-- Drop clinic settings table and triggers
DROP TRIGGER IF EXISTS trg_imaging_clinic_mount_settings_audit_event ON public.imaging_clinic_mount_settings;
DROP TRIGGER IF EXISTS trg_imaging_clinic_mount_settings_audit_stamp ON public.imaging_clinic_mount_settings;
DROP TABLE IF EXISTS public.imaging_clinic_mount_settings CASCADE;

-- Remove new system templates inserted by this migration
DELETE FROM public.imaging_mount_template WHERE template_key IN ('four_stacked_pairs', 'four_horizontal_gap', 'thick_cross', 'fms_20_horizontal_void');

-- Revert slot_capture_order backfill (set to null for templates that had it backfilled)
-- Then drop new columns from imaging_mount_template
ALTER TABLE public.imaging_mount_template DROP COLUMN IF EXISTS slot_capture_order;
ALTER TABLE public.imaging_mount_template DROP COLUMN IF EXISTS default_slot_transformations;
