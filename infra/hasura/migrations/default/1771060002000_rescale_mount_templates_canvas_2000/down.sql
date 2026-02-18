-- Revert canvas width from 2000 back to 1200 for rows that were rescaled.
-- Slot x and width are multiplied by 1200/2000; y and height unchanged.

DO $$
BEGIN
  -- imaging_mount_template
  UPDATE public.imaging_mount_template
  SET
    layout_config = jsonb_build_object('type', 'canvas', 'width', 1200, 'height', 1000),
    slot_definitions = (
      SELECT jsonb_agg(
        jsonb_build_object(
          'slot_id', elem->>'slot_id',
          'label', COALESCE(elem->>'label', elem->>'slot_id'),
          'x', round(((elem->>'x')::numeric * 1200 / 2000)::numeric, 2),
          'y', (elem->>'y')::numeric,
          'width', round(((elem->>'width')::numeric * 1200 / 2000)::numeric, 2),
          'height', (elem->>'height')::numeric
        ) ORDER BY ord
      )
      FROM jsonb_array_elements(slot_definitions) WITH ORDINALITY AS t(elem, ord)
    )
  WHERE (layout_config->>'type') = 'canvas'
    AND (layout_config->>'width')::int = 2000;

  -- imaging_clinic_mount_template
  UPDATE public.imaging_clinic_mount_template
  SET
    layout_config = jsonb_build_object('type', 'canvas', 'width', 1200, 'height', 1000),
    slot_definitions = (
      SELECT jsonb_agg(
        jsonb_build_object(
          'slot_id', elem->>'slot_id',
          'label', COALESCE(elem->>'label', elem->>'slot_id'),
          'x', round(((elem->>'x')::numeric * 1200 / 2000)::numeric, 2),
          'y', (elem->>'y')::numeric,
          'width', round(((elem->>'width')::numeric * 1200 / 2000)::numeric, 2),
          'height', (elem->>'height')::numeric
        ) ORDER BY ord
      )
      FROM jsonb_array_elements(slot_definitions) WITH ORDINALITY AS t(elem, ord)
    )
  WHERE (layout_config->>'type') = 'canvas'
    AND (layout_config->>'width')::int = 2000;
END $$;
