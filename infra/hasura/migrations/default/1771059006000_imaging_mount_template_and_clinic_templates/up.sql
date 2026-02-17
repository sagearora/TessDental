-- Extend imaging_mount_template: slot_capture_order, default_slot_transformations
ALTER TABLE public.imaging_mount_template
  ADD COLUMN IF NOT EXISTS slot_capture_order jsonb,
  ADD COLUMN IF NOT EXISTS default_slot_transformations jsonb;

COMMENT ON COLUMN public.imaging_mount_template.slot_capture_order IS 'Array of slot_id in order for assigning new captures (e.g. ["slot_1","slot_2"])';
COMMENT ON COLUMN public.imaging_mount_template.default_slot_transformations IS 'Per-slot default transform: {"slot_1":{"rotate":90,"flip_h":false,"flip_v":false},...}';

-- New table: clinic-specific overrides for a system template (order, transformations)
CREATE TABLE public.imaging_clinic_mount_settings (
  id bigserial PRIMARY KEY,
  clinic_id bigint NOT NULL REFERENCES public.clinic(id) ON DELETE CASCADE,
  template_id bigint NOT NULL REFERENCES public.imaging_mount_template(id) ON DELETE CASCADE,
  slot_order jsonb,
  slot_transformations jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  UNIQUE (clinic_id, template_id)
);

COMMENT ON TABLE public.imaging_clinic_mount_settings IS 'Clinic overrides for mount template: slot order and per-slot transformations';
CREATE INDEX idx_imaging_clinic_mount_settings_clinic ON public.imaging_clinic_mount_settings(clinic_id);
CREATE INDEX idx_imaging_clinic_mount_settings_template ON public.imaging_clinic_mount_settings(template_id);

CREATE TRIGGER trg_imaging_clinic_mount_settings_audit_stamp
  BEFORE INSERT OR UPDATE ON public.imaging_clinic_mount_settings
  FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();

CREATE TRIGGER trg_imaging_clinic_mount_settings_audit_event
  AFTER INSERT OR UPDATE OR DELETE ON public.imaging_clinic_mount_settings
  FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();

-- New table: clinic-owned mount templates (copied from system or custom)
CREATE TABLE public.imaging_clinic_mount_template (
  id bigserial PRIMARY KEY,
  clinic_id bigint NOT NULL REFERENCES public.clinic(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  slot_definitions jsonb NOT NULL,
  layout_config jsonb,
  slot_capture_order jsonb,
  default_slot_transformations jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  is_active boolean NOT NULL DEFAULT true
);

COMMENT ON TABLE public.imaging_clinic_mount_template IS 'Clinic-specific mount templates (copied from system or custom-built)';
CREATE INDEX idx_imaging_clinic_mount_template_clinic ON public.imaging_clinic_mount_template(clinic_id) WHERE is_active = true;

CREATE TRIGGER trg_imaging_clinic_mount_template_audit_stamp
  BEFORE INSERT OR UPDATE ON public.imaging_clinic_mount_template
  FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();

CREATE TRIGGER trg_imaging_clinic_mount_template_audit_event
  AFTER INSERT OR UPDATE OR DELETE ON public.imaging_clinic_mount_template
  FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();

-- imaging_mount: add clinic_template_id, make template_id nullable, add check constraint
ALTER TABLE public.imaging_mount
  ADD COLUMN clinic_template_id bigint REFERENCES public.imaging_clinic_mount_template(id) ON DELETE SET NULL;

ALTER TABLE public.imaging_mount
  ALTER COLUMN template_id DROP NOT NULL;

ALTER TABLE public.imaging_mount
  ADD CONSTRAINT chk_imaging_mount_template_source CHECK (
    (template_id IS NOT NULL AND clinic_template_id IS NULL) OR
    (template_id IS NULL AND clinic_template_id IS NOT NULL)
  );

COMMENT ON COLUMN public.imaging_mount.clinic_template_id IS 'When set, mount uses this clinic template; otherwise template_id (system template)';
CREATE INDEX idx_imaging_mount_clinic_template ON public.imaging_mount(clinic_template_id) WHERE clinic_template_id IS NOT NULL;

-- Insert new system templates (per plan 1.4) that do not exist yet
INSERT INTO public.imaging_mount_template (template_key, name, description, slot_definitions, layout_config, slot_capture_order) VALUES
('four_stacked_pairs', 'Four Stacked Pairs', 'Two stacked on left, two on right, gap in middle',
 '[{"slot_id": "slot_1", "label": "Left Top", "row": 0, "col": 0}, {"slot_id": "slot_2", "label": "Left Bottom", "row": 1, "col": 0}, {"slot_id": "slot_3", "label": "Right Top", "row": 0, "col": 2}, {"slot_id": "slot_4", "label": "Right Bottom", "row": 1, "col": 2}]'::jsonb,
 '{"type": "grid", "rows": 2, "cols": 3, "aspectRatio": "3:2"}'::jsonb,
 '["slot_1","slot_2","slot_3","slot_4"]'::jsonb),

('four_horizontal_gap', 'Four Horizontal with Gap', 'Four in a row with gap in middle (2, gap, 2)',
 '[{"slot_id": "slot_1", "label": "1", "row": 0, "col": 0}, {"slot_id": "slot_2", "label": "2", "row": 0, "col": 1}, {"slot_id": "slot_3", "label": "3", "row": 0, "col": 3}, {"slot_id": "slot_4", "label": "4", "row": 0, "col": 4}]'::jsonb,
 '{"type": "grid", "rows": 1, "cols": 5, "aspectRatio": "5:1"}'::jsonb,
 '["slot_1","slot_2","slot_3","slot_4"]'::jsonb),

('thick_cross', 'Thick Cross', 'Five in thick cross: top center, full middle row, bottom center',
 '[{"slot_id": "slot_1", "label": "Top", "row": 0, "col": 1}, {"slot_id": "slot_2", "label": "Middle Left", "row": 1, "col": 0}, {"slot_id": "slot_3", "label": "Center", "row": 1, "col": 1}, {"slot_id": "slot_4", "label": "Middle Right", "row": 1, "col": 2}, {"slot_id": "slot_5", "label": "Bottom", "row": 2, "col": 1}]'::jsonb,
 '{"type": "grid", "rows": 3, "cols": 3, "aspectRatio": "1:1"}'::jsonb,
 '["slot_1","slot_2","slot_3","slot_4","slot_5"]'::jsonb),

('fms_20_horizontal_void', 'Full Mouth Series (20)', 'Twenty images, two rows, central horizontal void (5+gap+5 per row)',
 '[{"slot_id": "fms20_1", "label": "1", "row": 0, "col": 0}, {"slot_id": "fms20_2", "label": "2", "row": 0, "col": 1}, {"slot_id": "fms20_3", "label": "3", "row": 0, "col": 2}, {"slot_id": "fms20_4", "label": "4", "row": 0, "col": 3}, {"slot_id": "fms20_5", "label": "5", "row": 0, "col": 4}, {"slot_id": "fms20_6", "label": "6", "row": 0, "col": 6}, {"slot_id": "fms20_7", "label": "7", "row": 0, "col": 7}, {"slot_id": "fms20_8", "label": "8", "row": 0, "col": 8}, {"slot_id": "fms20_9", "label": "9", "row": 0, "col": 9}, {"slot_id": "fms20_10", "label": "10", "row": 0, "col": 10}, {"slot_id": "fms20_11", "label": "11", "row": 1, "col": 0}, {"slot_id": "fms20_12", "label": "12", "row": 1, "col": 1}, {"slot_id": "fms20_13", "label": "13", "row": 1, "col": 2}, {"slot_id": "fms20_14", "label": "14", "row": 1, "col": 3}, {"slot_id": "fms20_15", "label": "15", "row": 1, "col": 4}, {"slot_id": "fms20_16", "label": "16", "row": 1, "col": 6}, {"slot_id": "fms20_17", "label": "17", "row": 1, "col": 7}, {"slot_id": "fms20_18", "label": "18", "row": 1, "col": 8}, {"slot_id": "fms20_19", "label": "19", "row": 1, "col": 9}, {"slot_id": "fms20_20", "label": "20", "row": 1, "col": 10}]'::jsonb,
 '{"type": "grid", "rows": 2, "cols": 11, "aspectRatio": "11:2"}'::jsonb,
 '["fms20_1","fms20_2","fms20_3","fms20_4","fms20_5","fms20_6","fms20_7","fms20_8","fms20_9","fms20_10","fms20_11","fms20_12","fms20_13","fms20_14","fms20_15","fms20_16","fms20_17","fms20_18","fms20_19","fms20_20"]'::jsonb)
ON CONFLICT (template_key) DO NOTHING;

-- Backfill slot_capture_order for existing templates (from slot_definitions order by row, col)
UPDATE public.imaging_mount_template t
SET slot_capture_order = (
  SELECT jsonb_agg(slot_id ORDER BY r, c)
  FROM (
    SELECT (elem->>'slot_id') AS slot_id, (elem->>'row')::int AS r, (elem->>'col')::int AS c
    FROM jsonb_array_elements(t.slot_definitions) AS elem
  ) sub
)
WHERE t.slot_capture_order IS NULL AND t.slot_definitions IS NOT NULL;
