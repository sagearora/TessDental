-- ============================================================================
-- Split patient_field_config into field_config and patient_field_config
-- ============================================================================
-- Creates a global field_config table for field definitions
-- Updates patient_field_config to reference field_config_id instead of field_key/field_label
-- ============================================================================

-- Create field_config table (global, no audit triggers)
CREATE TABLE public.field_config (
    id bigserial PRIMARY KEY,
    key text NOT NULL UNIQUE,
    label text NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create index on key for lookups
CREATE INDEX idx_field_config_key ON public.field_config(key);

-- Alter patient_field_config table
-- Drop old columns
ALTER TABLE public.patient_field_config
    DROP COLUMN IF EXISTS field_key,
    DROP COLUMN IF EXISTS field_label,
    DROP COLUMN IF EXISTS is_active;

-- Add new field_config_id column
ALTER TABLE public.patient_field_config
    ADD COLUMN field_config_id bigint NOT NULL REFERENCES public.field_config(id) ON DELETE CASCADE;

-- Drop old unique constraint
ALTER TABLE public.patient_field_config
    DROP CONSTRAINT IF EXISTS patient_field_config_clinic_id_field_key_key;

-- Add new unique constraint
ALTER TABLE public.patient_field_config
    ADD CONSTRAINT patient_field_config_clinic_id_field_config_id_key UNIQUE (clinic_id, field_config_id);

-- Drop old index
DROP INDEX IF EXISTS public.idx_patient_field_config_clinic_order;

-- Create new index (note: we can't filter by field_config.is_active in the WHERE clause directly,
-- but we can still index on clinic_id and display_order for active patient_field_config entries)
-- Since is_active was removed from patient_field_config, we'll create a simpler index
CREATE INDEX idx_patient_field_config_clinic_order ON public.patient_field_config(clinic_id, display_order);

-- Add index for field_config_id lookups
CREATE INDEX idx_patient_field_config_field_config_id ON public.patient_field_config(field_config_id);
