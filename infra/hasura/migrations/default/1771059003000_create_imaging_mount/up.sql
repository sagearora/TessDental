-- Create imaging_mount table
CREATE TABLE public.imaging_mount (
  id bigserial PRIMARY KEY,
  clinic_id bigint NOT NULL,
  patient_id bigint NOT NULL,
  template_id bigint NOT NULL REFERENCES public.imaging_mount_template(id),
  name text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  is_active boolean NOT NULL DEFAULT true
);

COMMENT ON TABLE public.imaging_mount IS 'Mount instances for organizing imaging assets using predefined templates';
COMMENT ON COLUMN public.imaging_mount.template_id IS 'Reference to the mount template defining the layout';
COMMENT ON COLUMN public.imaging_mount.name IS 'User-defined name for the mount (e.g., "Full Mouth Series - 2026-02-09")';

-- Create indexes
CREATE INDEX idx_imaging_mount_clinic_patient_time ON public.imaging_mount(clinic_id, patient_id, created_at DESC);
CREATE INDEX idx_imaging_mount_template ON public.imaging_mount(template_id);

-- Apply audit stamp trigger
CREATE TRIGGER trg_imaging_mount_audit_stamp
  BEFORE INSERT OR UPDATE ON public.imaging_mount
  FOR EACH ROW
  EXECUTE FUNCTION audit.fn_stamp_audit_columns();

-- Apply audit event trigger
CREATE TRIGGER trg_imaging_mount_audit_event
  AFTER INSERT OR UPDATE OR DELETE ON public.imaging_mount
  FOR EACH ROW
  EXECUTE FUNCTION audit.fn_row_change_to_event();
