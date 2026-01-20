-- TessDental V4: Scheduling seed data
-- Default clinic, statuses, confirmations, tags, and operatory for demo/testing

-- Insert demo clinic or get existing one
DO $$
DECLARE
  v_clinic_id bigint;
BEGIN
  -- Try to get existing clinic first
  SELECT id INTO v_clinic_id FROM clinics WHERE lower(name) = lower('Demo Clinic') LIMIT 1;
  
  -- If not found, insert it
  IF v_clinic_id IS NULL THEN
    INSERT INTO clinics (name, timezone, unit_length_minutes, is_active)
    VALUES ('Demo Clinic', 'America/Toronto', 15, true)
    RETURNING id INTO v_clinic_id;
  END IF;
  
  IF v_clinic_id IS NULL THEN
    RAISE EXCEPTION 'Failed to create or find demo clinic';
  END IF;

  -- Insert default appointment_statuses
  INSERT INTO appointment_statuses (clinic_id, name, workflow_order, color, is_active)
  VALUES
    (v_clinic_id, 'Scheduled', 1, '#3b82f6', true),
    (v_clinic_id, 'Confirmed', 2, '#10b981', true),
    (v_clinic_id, 'Completed', 3, '#6b7280', true),
    (v_clinic_id, 'Cancelled', 4, '#ef4444', true),
    (v_clinic_id, 'No-Show', 5, '#f59e0b', true)
  ON CONFLICT (clinic_id, name) DO NOTHING;

  -- Insert default appointment_confirmations
  INSERT INTO appointment_confirmations (clinic_id, name, workflow_order, is_active)
  VALUES
    (v_clinic_id, 'Unconfirmed', 1, true),
    (v_clinic_id, 'Left Message', 2, true),
    (v_clinic_id, 'Confirmed', 3, true)
  ON CONFLICT (clinic_id, name) DO NOTHING;

  -- Insert default appointment_tags
  INSERT INTO appointment_tags (clinic_id, name, color, is_active)
  VALUES
    (v_clinic_id, 'New Patient', '#8b5cf6', true),
    (v_clinic_id, 'Cleaning', '#06b6d4', true),
    (v_clinic_id, 'Emergency', '#ef4444', true),
    (v_clinic_id, 'Crown', '#f59e0b', true),
    (v_clinic_id, 'Filling', '#10b981', true)
  ON CONFLICT (clinic_id, name) DO NOTHING;

  -- Insert one operatory
  INSERT INTO operatories (clinic_id, name, short_name, is_bookable, is_active)
  VALUES (v_clinic_id, 'Op 1', 'Op1', true, true)
  ON CONFLICT (clinic_id, name) DO NOTHING;

END $$;
