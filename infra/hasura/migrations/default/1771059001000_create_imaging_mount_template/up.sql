-- Create imaging_mount_template table
CREATE TABLE public.imaging_mount_template (
  id bigserial PRIMARY KEY,
  template_key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  slot_definitions jsonb NOT NULL,
  layout_config jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

COMMENT ON TABLE public.imaging_mount_template IS 'Predefined mount templates for organizing imaging assets';
COMMENT ON COLUMN public.imaging_mount_template.template_key IS 'Unique identifier for the template (e.g., "single", "two_horizontal")';
COMMENT ON COLUMN public.imaging_mount_template.slot_definitions IS 'JSONB array of slot definitions: [{"slot_id": "slot_1", "label": "Position 1", "row": 0, "col": 0}, ...]';
COMMENT ON COLUMN public.imaging_mount_template.layout_config IS 'Template-specific layout metadata for rendering';

-- Create index on template_key for fast lookups
CREATE INDEX idx_imaging_mount_template_key ON public.imaging_mount_template(template_key) WHERE is_active = true;

-- Insert predefined templates
INSERT INTO public.imaging_mount_template (template_key, name, description, slot_definitions, layout_config) VALUES
('two_horizontal', 'Two Side-by-Side', 'Two images displayed horizontally', 
 '[{"slot_id": "slot_1", "label": "Left", "row": 0, "col": 0}, {"slot_id": "slot_2", "label": "Right", "row": 0, "col": 1}]'::jsonb,
 '{"rows": 1, "cols": 2, "aspectRatio": "2:1"}'::jsonb),

('single', 'Single Image', 'Single image display',
 '[{"slot_id": "slot_1", "label": "Image", "row": 0, "col": 0}]'::jsonb,
 '{"rows": 1, "cols": 1, "aspectRatio": "1:1"}'::jsonb),

('three_horizontal', 'Three Horizontal', 'Three images displayed horizontally',
 '[{"slot_id": "slot_1", "label": "Left", "row": 0, "col": 0}, {"slot_id": "slot_2", "label": "Center", "row": 0, "col": 1}, {"slot_id": "slot_3", "label": "Right", "row": 0, "col": 2}]'::jsonb,
 '{"rows": 1, "cols": 3, "aspectRatio": "3:1"}'::jsonb),

('four_grid', 'Four Grid (2x2)', 'Four images in a 2x2 grid',
 '[{"slot_id": "slot_1", "label": "Top Left", "row": 0, "col": 0}, {"slot_id": "slot_2", "label": "Top Right", "row": 0, "col": 1}, {"slot_id": "slot_3", "label": "Bottom Left", "row": 1, "col": 0}, {"slot_id": "slot_4", "label": "Bottom Right", "row": 1, "col": 1}]'::jsonb,
 '{"rows": 2, "cols": 2, "aspectRatio": "1:1"}'::jsonb),

('two_vertical', 'Two Vertical', 'Two images displayed vertically',
 '[{"slot_id": "slot_1", "label": "Top", "row": 0, "col": 0}, {"slot_id": "slot_2", "label": "Bottom", "row": 1, "col": 0}]'::jsonb,
 '{"rows": 2, "cols": 1, "aspectRatio": "1:2"}'::jsonb),

('six_horizontal', 'Six Horizontal', 'Six images displayed horizontally',
 '[{"slot_id": "slot_1", "label": "Position 1", "row": 0, "col": 0}, {"slot_id": "slot_2", "label": "Position 2", "row": 0, "col": 1}, {"slot_id": "slot_3", "label": "Position 3", "row": 0, "col": 2}, {"slot_id": "slot_4", "label": "Position 4", "row": 0, "col": 3}, {"slot_id": "slot_5", "label": "Position 5", "row": 0, "col": 4}, {"slot_id": "slot_6", "label": "Position 6", "row": 0, "col": 5}]'::jsonb,
 '{"rows": 1, "cols": 6, "aspectRatio": "6:1"}'::jsonb),

('complex_grid_3x3', 'Complex Grid (3x3 with gaps)', 'Three rows with gaps in middle row',
 '[{"slot_id": "slot_1", "label": "Top Left", "row": 0, "col": 0}, {"slot_id": "slot_2", "label": "Top Center", "row": 0, "col": 1}, {"slot_id": "slot_3", "label": "Top Right", "row": 0, "col": 2}, {"slot_id": "slot_4", "label": "Middle Left", "row": 1, "col": 0}, {"slot_id": "slot_5", "label": "Middle Right", "row": 1, "col": 2}, {"slot_id": "slot_6", "label": "Bottom Left", "row": 2, "col": 0}, {"slot_id": "slot_7", "label": "Bottom Center", "row": 2, "col": 1}, {"slot_id": "slot_8", "label": "Bottom Right", "row": 2, "col": 2}]'::jsonb,
 '{"rows": 3, "cols": 3, "aspectRatio": "1:1"}'::jsonb),

('four_horizontal', 'Four Horizontal', 'Four images displayed horizontally',
 '[{"slot_id": "slot_1", "label": "Position 1", "row": 0, "col": 0}, {"slot_id": "slot_2", "label": "Position 2", "row": 0, "col": 1}, {"slot_id": "slot_3", "label": "Position 3", "row": 0, "col": 2}, {"slot_id": "slot_4", "label": "Position 4", "row": 0, "col": 3}]'::jsonb,
 '{"rows": 1, "cols": 4, "aspectRatio": "4:1"}'::jsonb),

('cross_pattern', 'Cross Pattern', 'Cross-shaped layout with center and four arms',
 '[{"slot_id": "slot_1", "label": "Top", "row": 0, "col": 1}, {"slot_id": "slot_2", "label": "Left", "row": 1, "col": 0}, {"slot_id": "slot_3", "label": "Center", "row": 1, "col": 1}, {"slot_id": "slot_4", "label": "Right", "row": 1, "col": 2}, {"slot_id": "slot_5", "label": "Bottom", "row": 2, "col": 1}]'::jsonb,
 '{"rows": 3, "cols": 3, "aspectRatio": "1:1"}'::jsonb),

('five_horizontal', 'Five Horizontal', 'Five images displayed horizontally',
 '[{"slot_id": "slot_1", "label": "Position 1", "row": 0, "col": 0}, {"slot_id": "slot_2", "label": "Position 2", "row": 0, "col": 1}, {"slot_id": "slot_3", "label": "Position 3", "row": 0, "col": 2}, {"slot_id": "slot_4", "label": "Position 4", "row": 0, "col": 3}, {"slot_id": "slot_5", "label": "Position 5", "row": 0, "col": 4}]'::jsonb,
 '{"rows": 1, "cols": 5, "aspectRatio": "5:1"}'::jsonb),

('complex_grid_3x5', 'Complex Grid (3x5 with gaps)', 'Three rows, five columns with gaps in middle row',
 '[{"slot_id": "slot_1", "label": "Top 1", "row": 0, "col": 0}, {"slot_id": "slot_2", "label": "Top 2", "row": 0, "col": 1}, {"slot_id": "slot_3", "label": "Top 3", "row": 0, "col": 2}, {"slot_id": "slot_4", "label": "Top 4", "row": 0, "col": 3}, {"slot_id": "slot_5", "label": "Top 5", "row": 0, "col": 4}, {"slot_id": "slot_6", "label": "Middle Left", "row": 1, "col": 0}, {"slot_id": "slot_7", "label": "Middle Right", "row": 1, "col": 4}, {"slot_id": "slot_8", "label": "Bottom 1", "row": 2, "col": 0}, {"slot_id": "slot_9", "label": "Bottom 2", "row": 2, "col": 1}, {"slot_id": "slot_10", "label": "Bottom 3", "row": 2, "col": 2}, {"slot_id": "slot_11", "label": "Bottom 4", "row": 2, "col": 3}, {"slot_id": "slot_12", "label": "Bottom 5", "row": 2, "col": 4}]'::jsonb,
 '{"rows": 3, "cols": 5, "aspectRatio": "5:3"}'::jsonb),

('large_cross', 'Large Cross Pattern', 'Large cross-shaped layout with center and four extended arms',
 '[{"slot_id": "slot_1", "label": "Top", "row": 0, "col": 2}, {"slot_id": "slot_2", "label": "Left", "row": 1, "col": 0}, {"slot_id": "slot_3", "label": "Center", "row": 1, "col": 1}, {"slot_id": "slot_4", "label": "Center Right", "row": 1, "col": 2}, {"slot_id": "slot_5", "label": "Right", "row": 1, "col": 3}, {"slot_id": "slot_6", "label": "Bottom", "row": 2, "col": 2}]'::jsonb,
 '{"rows": 3, "cols": 4, "aspectRatio": "4:3"}'::jsonb),

('full_mouth_series', 'Full Mouth Series', 'Standard full mouth series layout (18 images)',
 '[{"slot_id": "fms_ur1", "label": "UR1", "row": 0, "col": 0}, {"slot_id": "fms_ur2", "label": "UR2", "row": 0, "col": 1}, {"slot_id": "fms_ur3", "label": "UR3", "row": 0, "col": 2}, {"slot_id": "fms_ur4", "label": "UR4", "row": 0, "col": 3}, {"slot_id": "fms_ur5", "label": "UR5", "row": 0, "col": 4}, {"slot_id": "fms_ur6", "label": "UR6", "row": 0, "col": 5}, {"slot_id": "fms_ur7", "label": "UR7", "row": 0, "col": 6}, {"slot_id": "fms_ur8", "label": "UR8", "row": 0, "col": 7}, {"slot_id": "fms_ul1", "label": "UL1", "row": 0, "col": 8}, {"slot_id": "fms_ul2", "label": "UL2", "row": 0, "col": 9}, {"slot_id": "fms_ul3", "label": "UL3", "row": 0, "col": 10}, {"slot_id": "fms_ul4", "label": "UL4", "row": 0, "col": 11}, {"slot_id": "fms_ul5", "label": "UL5", "row": 0, "col": 12}, {"slot_id": "fms_ul6", "label": "UL6", "row": 0, "col": 13}, {"slot_id": "fms_ul7", "label": "UL7", "row": 0, "col": 14}, {"slot_id": "fms_ul8", "label": "UL8", "row": 0, "col": 15}, {"slot_id": "fms_bwx_r", "label": "BWX Right", "row": 1, "col": 0}, {"slot_id": "fms_bwx_l", "label": "BWX Left", "row": 1, "col": 1}]'::jsonb,
 '{"rows": 2, "cols": 16, "aspectRatio": "16:2"}'::jsonb);
