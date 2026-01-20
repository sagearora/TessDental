-- Repeatable: views and functions only

CREATE OR REPLACE VIEW v_patient_search AS
SELECT
  id,
  chart_no,
  first_name,
  last_name,
  date_of_birth,
  cell_phone,
  email,
  created_at
FROM patient
WHERE true;
