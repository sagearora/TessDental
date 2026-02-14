-- Add clinic_id and patient_id to imaging_asset
-- These are needed because assets can exist without studies (study_id is nullable)
-- and we need to filter by clinic and patient directly

ALTER TABLE public.imaging_asset
  ADD COLUMN clinic_id bigint,
  ADD COLUMN patient_id bigint;

-- For existing assets, populate clinic_id and patient_id from their study
UPDATE public.imaging_asset ia
SET 
  clinic_id = s.clinic_id,
  patient_id = s.patient_id
FROM public.imaging_study s
WHERE ia.study_id = s.id AND ia.clinic_id IS NULL;

-- Now make them NOT NULL for new rows
ALTER TABLE public.imaging_asset
  ALTER COLUMN clinic_id SET NOT NULL,
  ALTER COLUMN patient_id SET NOT NULL;

-- Add foreign key constraints
ALTER TABLE public.imaging_asset
  ADD CONSTRAINT fk_imaging_asset_clinic 
    FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_imaging_asset_patient 
    FOREIGN KEY (patient_id) REFERENCES public.patient(person_id) ON DELETE CASCADE;

-- Add indexes for common queries
CREATE INDEX idx_imaging_asset_clinic_patient_time 
  ON public.imaging_asset(clinic_id, patient_id, captured_at DESC) 
  WHERE is_active = true;

CREATE INDEX idx_imaging_asset_clinic 
  ON public.imaging_asset(clinic_id) 
  WHERE is_active = true;
