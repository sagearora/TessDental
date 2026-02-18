-- Convert existing mount templates from grid layout to canvas (1200x1000) layout.
-- Only rows that are still grid-shaped (layout_config.type != 'canvas' or slots without x,y,width,height) are updated.

DO $$
DECLARE
  r RECORD;
  new_slots jsonb := '[]'::jsonb;
  lc jsonb;
  rows_val int;
  cols_val int;
  cell_w numeric;
  cell_h numeric;
  canvas_width int := 1200;
  canvas_height int := 1000;
BEGIN
  -- imaging_mount_template
  FOR r IN
    SELECT id, slot_definitions, layout_config
    FROM public.imaging_mount_template
    WHERE (layout_config->>'type') = 'grid'
       OR (layout_config IS NULL AND jsonb_array_length(COALESCE(slot_definitions, '[]'::jsonb)) > 0
           AND (slot_definitions->0 ? 'row' AND slot_definitions->0 ? 'col'))
  LOOP
    lc := COALESCE(r.layout_config, '{}'::jsonb);
    rows_val := GREATEST(1, COALESCE((lc->>'rows')::int, 1));
    cols_val := GREATEST(1, COALESCE((lc->>'cols')::int, 1));
    cell_w := canvas_width / cols_val;
    cell_h := canvas_height / rows_val;

    new_slots := (
      SELECT jsonb_agg(
        jsonb_build_object(
          'slot_id', elem->>'slot_id',
          'label', COALESCE(elem->>'label', elem->>'slot_id'),
          'x', (COALESCE((elem->>'col')::int, 0)) * cell_w,
          'y', (COALESCE((elem->>'row')::int, 0)) * cell_h,
          'width', (COALESCE((elem->>'col_span')::int, 1)) * cell_w,
          'height', (COALESCE((elem->>'row_span')::int, 1)) * cell_h
        )
      )
      FROM jsonb_array_elements(r.slot_definitions) AS elem
    );

    UPDATE public.imaging_mount_template
    SET
      layout_config = jsonb_build_object('type', 'canvas', 'width', canvas_width, 'height', canvas_height),
      slot_definitions = COALESCE(new_slots, r.slot_definitions)
    WHERE id = r.id;
  END LOOP;

  -- imaging_clinic_mount_template
  FOR r IN
    SELECT id, slot_definitions, layout_config
    FROM public.imaging_clinic_mount_template
    WHERE (layout_config->>'type') = 'grid'
       OR (layout_config IS NULL AND jsonb_array_length(COALESCE(slot_definitions, '[]'::jsonb)) > 0
           AND (slot_definitions->0 ? 'row' AND slot_definitions->0 ? 'col'))
  LOOP
    lc := COALESCE(r.layout_config, '{}'::jsonb);
    rows_val := GREATEST(1, COALESCE((lc->>'rows')::int, 1));
    cols_val := GREATEST(1, COALESCE((lc->>'cols')::int, 1));
    cell_w := canvas_width / cols_val;
    cell_h := canvas_height / rows_val;

    new_slots := (
      SELECT jsonb_agg(
        jsonb_build_object(
          'slot_id', elem->>'slot_id',
          'label', COALESCE(elem->>'label', elem->>'slot_id'),
          'x', (COALESCE((elem->>'col')::int, 0)) * cell_w,
          'y', (COALESCE((elem->>'row')::int, 0)) * cell_h,
          'width', (COALESCE((elem->>'col_span')::int, 1)) * cell_w,
          'height', (COALESCE((elem->>'row_span')::int, 1)) * cell_h
        )
      )
      FROM jsonb_array_elements(r.slot_definitions) AS elem
    );

    UPDATE public.imaging_clinic_mount_template
    SET
      layout_config = jsonb_build_object('type', 'canvas', 'width', canvas_width, 'height', canvas_height),
      slot_definitions = COALESCE(new_slots, r.slot_definitions)
    WHERE id = r.id;
  END LOOP;
END $$;
