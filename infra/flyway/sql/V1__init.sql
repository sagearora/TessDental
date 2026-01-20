-- TessDental V1: base schema (PostgreSQL 16+)

-- Extensions (safe)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users
CREATE TABLE IF NOT EXISTS app_user (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email           text NOT NULL UNIQUE,
  password_hash   text NOT NULL,
  full_name       text,
  role            text NOT NULL DEFAULT 'admin', -- later: RBAC table
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Patients
CREATE TABLE IF NOT EXISTS patient (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_no        text, -- optional; some clinics want numeric chart #. keep as text.
  first_name      text NOT NULL,
  last_name       text NOT NULL,
  date_of_birth   date,
  sex             text,
  cell_phone      text,
  email           text,
  address1        text,
  address2        text,
  city            text,
  province        text,
  postal_code     text,
  notes           text, -- non-clinical admin notes (keep clinical notes in encounters later)

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT patient_chart_no_unique UNIQUE (chart_no)
);

CREATE INDEX IF NOT EXISTS idx_patient_last_first ON patient (last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_patient_dob ON patient (date_of_birth);
CREATE INDEX IF NOT EXISTS idx_patient_cell_phone ON patient (cell_phone);
