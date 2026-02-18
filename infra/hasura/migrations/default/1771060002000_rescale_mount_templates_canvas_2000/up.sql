-- Rescale canvas mount templates from 1200 width to 2000 width.
-- Only rows with layout_config.type = 'canvas' and width = 1200 are updated.
-- Slot x and width are multiplied by 2000/1200; y and height unchanged.

DO $$
BEGIN
  -- imaging_mount_template
  UPDATE public.imaging_mount_template
  SET
    layout_config = jsonb_build_object('type', 'canvas', 'width', 2000, 'height', 1000),
    slot_definitions = (
      SELECT jsonb_agg(
        jsonb_build_object(
          'slot_id', elem->>'slot_id',
          'label', COALESCE(elem->>'label', elem->>'slot_id'),
          'x', round(((elem->>'x')::numeric * 2000 / 1200)::numeric, 2),
          'y', (elem->>'y')::numeric,
          'width', round(((elem->>'width')::numeric * 2000 / 1200)::numeric, 2),
          'height', (elem->>'height')::numeric
        ) ORDER BY ord
      )
      FROM jsonb_array_elements(slot_definitions) WITH ORDINALITY AS t(elem, ord)
    )
  WHERE (layout_config->>'type') = 'canvas'
    AND (layout_config->>'width')::int = 1200;

  -- imaging_clinic_mount_template
  UPDATE public.imaging_clinic_mount_template
  SET
    layout_config = jsonb_build_object('type', 'canvas', 'width', 2000, 'height', 1000),
    slot_definitions = (
      SELECT jsonb_agg(
        jsonb_build_object(
          'slot_id', elem->>'slot_id',
          'label', COALESCE(elem->>'label', elem->>'slot_id'),
          'x', round(((elem->>'x')::numeric * 2000 / 1200)::numeric, 2),
          'y', (elem->>'y')::numeric,
          'width', round(((elem->>'width')::numeric * 2000 / 1200)::numeric, 2),
          'height', (elem->>'height')::numeric
        ) ORDER BY ord
      )
      FROM jsonb_array_elements(slot_definitions) WITH ORDINALITY AS t(elem, ord)
    )
  WHERE (layout_config->>'type') = 'canvas'
    AND (layout_config->>'width')::int = 1200;
END $$;
