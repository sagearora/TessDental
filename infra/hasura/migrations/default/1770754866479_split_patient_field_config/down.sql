-- ============================================================================
-- Rollback: Revert patient_field_config split
-- ============================================================================

-- Drop new indexes
DROP INDEX IF EXISTS public.idx_patient_field_config_field_config_id;
DROP INDEX IF EXISTS public.idx_patient_field_config_clinic_order;

-- Recreate old index
CREATE INDEX idx_patient_field_config_clinic_order ON public.patient_field_config(clinic_id, display_order) WHERE (is_active = true);

-- Drop new unique constraint
ALTER TABLE public.patient_field_config
    DROP CONSTRAINT IF EXISTS patient_field_config_clinic_id_field_config_id_key;

-- Recreate old unique constraint
ALTER TABLE public.patient_field_config
    ADD CONSTRAINT patient_field_config_clinic_id_field_key_key UNIQUE (clinic_id, field_key);

-- Remove field_config_id column
ALTER TABLE public.patient_field_config
    DROP COLUMN IF EXISTS field_config_id;

-- Restore old columns
ALTER TABLE public.patient_field_config
    ADD COLUMN field_key text,
    ADD COLUMN field_label text,
    ADD COLUMN is_active boolean NOT NULL DEFAULT true;

-- Drop field_config table
DROP TABLE IF EXISTS public.field_config;
