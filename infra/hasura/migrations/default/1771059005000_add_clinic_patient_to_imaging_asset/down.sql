-- Remove clinic_id and patient_id from imaging_asset
DROP INDEX IF EXISTS public.idx_imaging_asset_clinic;
DROP INDEX IF EXISTS public.idx_imaging_asset_clinic_patient_time;

ALTER TABLE public.imaging_asset
  DROP CONSTRAINT IF EXISTS fk_imaging_asset_patient,
  DROP CONSTRAINT IF EXISTS fk_imaging_asset_clinic,
  DROP COLUMN IF EXISTS patient_id,
  DROP COLUMN IF EXISTS clinic_id;
