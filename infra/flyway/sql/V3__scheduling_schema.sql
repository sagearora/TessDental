-- TessDental V3: Scheduling schema (PostgreSQL 16+)
-- Production-grade scheduling tables with clinic-scoped design

-- ========================
-- 1) clinics
-- ========================
CREATE TABLE IF NOT EXISTS clinics (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  timezone text NOT NULL DEFAULT 'America/Toronto',
  unit_length_minutes int NOT NULL DEFAULT 5,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  row_version int NOT NULL DEFAULT 1,
  created_by_id bigint NULL,
  updated_by_id bigint NULL,
  CONSTRAINT clinics_unit_length_check CHECK (unit_length_minutes > 0 AND unit_length_minutes <= 60)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_clinics_name_unique ON clinics (lower(name));
CREATE INDEX IF NOT EXISTS idx_clinics_is_active ON clinics (is_active);

-- ========================
-- 2) users
-- ========================
CREATE TABLE IF NOT EXISTS users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clinic_id bigint NOT NULL REFERENCES clinics(id),
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  row_version int NOT NULL DEFAULT 1,
  created_by_id bigint NULL,
  updated_by_id bigint NULL,
  CONSTRAINT users_email_lower_check CHECK (email = lower(email)),
  CONSTRAINT users_role_check CHECK (role IN ('admin','provider','staff','billing','read_only'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_clinic_email_unique ON users (clinic_id, lower(email));
CREATE INDEX IF NOT EXISTS idx_users_clinic_name ON users (clinic_id, last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_users_clinic_role ON users (clinic_id, role);
CREATE INDEX IF NOT EXISTS idx_users_clinic_is_active ON users (clinic_id, is_active);
CREATE INDEX IF NOT EXISTS idx_users_clinic_id ON users (clinic_id);

-- ========================
-- 3) patients
-- ========================
CREATE TABLE IF NOT EXISTS patients (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clinic_id bigint NOT NULL REFERENCES clinics(id),
  chart_no text NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  dob date NULL,
  email text NULL,
  preferred_contact_method text NULL,
  default_dentist_id bigint NULL REFERENCES users(id),
  default_hygienist_id bigint NULL REFERENCES users(id),
  default_assistant_id bigint NULL REFERENCES users(id),
  responsible_party_id bigint NULL REFERENCES patients(id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  row_version int NOT NULL DEFAULT 1,
  created_by_id bigint NULL,
  updated_by_id bigint NULL,
  CONSTRAINT patients_preferred_contact_check CHECK (preferred_contact_method IN ('sms','email','phone') OR preferred_contact_method IS NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_patients_clinic_chart_no_unique ON patients (clinic_id, chart_no) WHERE chart_no IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_patients_clinic_name ON patients (clinic_id, last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_patients_clinic_dob ON patients (clinic_id, dob);
CREATE INDEX IF NOT EXISTS idx_patients_clinic_is_active ON patients (clinic_id, is_active);
CREATE INDEX IF NOT EXISTS idx_patients_clinic_email ON patients (clinic_id, email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_patients_clinic_id ON patients (clinic_id);
CREATE INDEX IF NOT EXISTS idx_patients_default_dentist_id ON patients (default_dentist_id);
CREATE INDEX IF NOT EXISTS idx_patients_default_hygienist_id ON patients (default_hygienist_id);
CREATE INDEX IF NOT EXISTS idx_patients_default_assistant_id ON patients (default_assistant_id);
CREATE INDEX IF NOT EXISTS idx_patients_responsible_party_id ON patients (responsible_party_id);

-- ========================
-- 4) patient_contacts
-- ========================
CREATE TABLE IF NOT EXISTS patient_contacts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  patient_id bigint NOT NULL REFERENCES patients(id),
  type text NOT NULL,
  value text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  row_version int NOT NULL DEFAULT 1,
  created_by_id bigint NULL,
  updated_by_id bigint NULL,
  CONSTRAINT patient_contacts_type_check CHECK (type IN ('cell','home','work','email')),
  CONSTRAINT patient_contacts_unique UNIQUE (patient_id, type, value)
);

CREATE INDEX IF NOT EXISTS idx_patient_contacts_patient_id ON patient_contacts (patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_contacts_type_value ON patient_contacts (type, value);
CREATE INDEX IF NOT EXISTS idx_patient_contacts_primary ON patient_contacts (patient_id) WHERE is_primary = true;

-- ========================
-- 5) operatories
-- ========================
CREATE TABLE IF NOT EXISTS operatories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clinic_id bigint NOT NULL REFERENCES clinics(id),
  name text NOT NULL,
  short_name text NULL,
  is_bookable boolean NOT NULL DEFAULT true,
  provider_id bigint NULL REFERENCES users(id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  row_version int NOT NULL DEFAULT 1,
  created_by_id bigint NULL,
  updated_by_id bigint NULL,
  CONSTRAINT operatories_clinic_name_unique UNIQUE (clinic_id, name)
);

CREATE INDEX IF NOT EXISTS idx_operatories_clinic_id ON operatories (clinic_id);
CREATE INDEX IF NOT EXISTS idx_operatories_clinic_is_active ON operatories (clinic_id, is_active);
CREATE INDEX IF NOT EXISTS idx_operatories_provider_id ON operatories (provider_id);
CREATE INDEX IF NOT EXISTS idx_operatories_clinic_is_bookable ON operatories (clinic_id, is_bookable);

-- ========================
-- 6) appointment_statuses
-- ========================
CREATE TABLE IF NOT EXISTS appointment_statuses (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clinic_id bigint NOT NULL REFERENCES clinics(id),
  name text NOT NULL,
  workflow_order int NOT NULL DEFAULT 0,
  color text NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  row_version int NOT NULL DEFAULT 1,
  created_by_id bigint NULL,
  updated_by_id bigint NULL,
  CONSTRAINT appointment_statuses_clinic_name_unique UNIQUE (clinic_id, name),
  CONSTRAINT appointment_statuses_workflow_order_check CHECK (workflow_order >= 0)
);

CREATE INDEX IF NOT EXISTS idx_appointment_statuses_clinic_workflow ON appointment_statuses (clinic_id, workflow_order);
CREATE INDEX IF NOT EXISTS idx_appointment_statuses_clinic_is_active ON appointment_statuses (clinic_id, is_active);
CREATE INDEX IF NOT EXISTS idx_appointment_statuses_clinic_id ON appointment_statuses (clinic_id);

-- ========================
-- 7) appointment_confirmations
-- ========================
CREATE TABLE IF NOT EXISTS appointment_confirmations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clinic_id bigint NOT NULL REFERENCES clinics(id),
  name text NOT NULL,
  workflow_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  row_version int NOT NULL DEFAULT 1,
  created_by_id bigint NULL,
  updated_by_id bigint NULL,
  CONSTRAINT appointment_confirmations_clinic_name_unique UNIQUE (clinic_id, name),
  CONSTRAINT appointment_confirmations_workflow_order_check CHECK (workflow_order >= 0)
);

CREATE INDEX IF NOT EXISTS idx_appointment_confirmations_clinic_workflow ON appointment_confirmations (clinic_id, workflow_order);
CREATE INDEX IF NOT EXISTS idx_appointment_confirmations_clinic_is_active ON appointment_confirmations (clinic_id, is_active);
CREATE INDEX IF NOT EXISTS idx_appointment_confirmations_clinic_id ON appointment_confirmations (clinic_id);

-- ========================
-- 8) appointment_tags
-- ========================
CREATE TABLE IF NOT EXISTS appointment_tags (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clinic_id bigint NOT NULL REFERENCES clinics(id),
  name text NOT NULL,
  color text NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  row_version int NOT NULL DEFAULT 1,
  created_by_id bigint NULL,
  updated_by_id bigint NULL,
  CONSTRAINT appointment_tags_clinic_name_unique UNIQUE (clinic_id, name)
);

CREATE INDEX IF NOT EXISTS idx_appointment_tags_clinic_is_active ON appointment_tags (clinic_id, is_active);
CREATE INDEX IF NOT EXISTS idx_appointment_tags_clinic_id ON appointment_tags (clinic_id);

-- ========================
-- 9) appointments
-- ========================
-- end_at is a normal column
CREATE TABLE IF NOT EXISTS appointments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clinic_id bigint NOT NULL REFERENCES clinics(id),
  type text NOT NULL DEFAULT 'appointment',
  start_at timestamptz NOT NULL,
  length_minutes int NOT NULL,
  end_at timestamptz NOT NULL, -- <-- changed (no GENERATED)
  operatory_id bigint NOT NULL REFERENCES operatories(id),
  provider_id bigint NULL REFERENCES users(id),
  patient_id bigint NULL REFERENCES patients(id),
  status_id bigint NOT NULL REFERENCES appointment_statuses(id),
  confirmation_id bigint NULL REFERENCES appointment_confirmations(id),
  title text NULL,
  notes text NULL,
  show_on_calendar boolean NOT NULL DEFAULT true,
  is_online_booking boolean NOT NULL DEFAULT false,
  is_self_bookable boolean NOT NULL DEFAULT false,
  booked_at timestamptz NOT NULL DEFAULT now(),
  booked_by_id bigint NULL REFERENCES users(id),
  source text NOT NULL DEFAULT 'front_desk',
  last_modified_at timestamptz NOT NULL DEFAULT now(),
  last_modified_by_id bigint NULL REFERENCES users(id),
  cancelled_at timestamptz NULL,
  cancelled_by_id bigint NULL REFERENCES users(id),
  cancel_reason text NULL,
  arrived_at timestamptz NULL,
  seated_at timestamptz NULL,
  completed_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  row_version int NOT NULL DEFAULT 1,
  created_by_id bigint NULL,
  updated_by_id bigint NULL,
  CONSTRAINT appointments_length_minutes_check CHECK (length_minutes > 0 AND length_minutes <= 1440),
  CONSTRAINT appointments_type_check CHECK (type IN ('appointment','block')),
  CONSTRAINT appointments_source_check CHECK (source IN ('front_desk','online','automation','import')),
  CONSTRAINT appointments_patient_required_check CHECK (type <> 'appointment' OR patient_id IS NOT NULL)
);

-- Trigger function to compute end_at
CREATE OR REPLACE FUNCTION appointments_set_end_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.end_at := NEW.start_at + (NEW.length_minutes * INTERVAL '1 minute');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_appointments_set_end_at ON appointments;

CREATE TRIGGER trg_appointments_set_end_at
BEFORE INSERT OR UPDATE OF start_at, length_minutes
ON appointments
FOR EACH ROW
EXECUTE FUNCTION appointments_set_end_at();


-- Schedule query performance indexes
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_start_at ON appointments (clinic_id, start_at);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_end_at ON appointments (clinic_id, end_at);
CREATE INDEX IF NOT EXISTS idx_appointments_operatory_start_at ON appointments (operatory_id, start_at);
CREATE INDEX IF NOT EXISTS idx_appointments_provider_start_at ON appointments (provider_id, start_at);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_start_at ON appointments (patient_id, start_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status_id ON appointments (status_id);
CREATE INDEX IF NOT EXISTS idx_appointments_confirmation_id ON appointments (confirmation_id);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_start_at_active ON appointments (clinic_id, start_at) WHERE cancelled_at IS NULL;
-- Foreign key indexes
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_id ON appointments (clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_operatory_id ON appointments (operatory_id);
CREATE INDEX IF NOT EXISTS idx_appointments_provider_id ON appointments (provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments (patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_booked_by_id ON appointments (booked_by_id);
CREATE INDEX IF NOT EXISTS idx_appointments_last_modified_by_id ON appointments (last_modified_by_id);
CREATE INDEX IF NOT EXISTS idx_appointments_cancelled_by_id ON appointments (cancelled_by_id);

-- ========================
-- 10) appointment_tag_links (many-to-many)
-- ========================
CREATE TABLE IF NOT EXISTS appointment_tag_links (
  appointment_id bigint NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  appointment_tag_id bigint NOT NULL REFERENCES appointment_tags(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by_id bigint NULL REFERENCES users(id),
  CONSTRAINT appointment_tag_links_pkey PRIMARY KEY (appointment_id, appointment_tag_id)
);

CREATE INDEX IF NOT EXISTS idx_appointment_tag_links_tag_appointment ON appointment_tag_links (appointment_tag_id, appointment_id);

-- ========================
-- 11) appointment_history (immutable audit)
-- ========================
CREATE TABLE IF NOT EXISTS appointment_history (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clinic_id bigint NOT NULL REFERENCES clinics(id),
  appointment_id bigint NOT NULL REFERENCES appointments(id),
  action text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_user_id bigint NULL REFERENCES users(id),
  source text NOT NULL DEFAULT 'front_desk',
  payload jsonb NOT NULL,
  request_id text NULL,
  ip inet NULL,
  user_agent text NULL,
  CONSTRAINT appointment_history_action_check CHECK (action <> ''),
  CONSTRAINT appointment_history_source_check CHECK (source IN ('front_desk','online','automation','import'))
);

CREATE INDEX IF NOT EXISTS idx_appointment_history_appointment_occurred ON appointment_history (appointment_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointment_history_clinic_occurred ON appointment_history (clinic_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointment_history_actor_occurred ON appointment_history (actor_user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointment_history_clinic_id ON appointment_history (clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointment_history_appointment_id ON appointment_history (appointment_id);

-- ========================
-- 12) clinic_hours
-- ========================
CREATE TABLE IF NOT EXISTS clinic_hours (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clinic_id bigint NOT NULL REFERENCES clinics(id),
  weekday smallint NOT NULL,
  is_closed boolean NOT NULL DEFAULT false,
  open_time time NULL,
  close_time time NULL,
  effective_from date NULL,
  effective_to date NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  row_version int NOT NULL DEFAULT 1,
  created_by_id bigint NULL,
  updated_by_id bigint NULL,
  CONSTRAINT clinic_hours_weekday_check CHECK (weekday BETWEEN 0 AND 6),
  CONSTRAINT clinic_hours_time_check CHECK (
    (is_closed = true AND open_time IS NULL AND close_time IS NULL)
    OR
    (is_closed = false AND open_time IS NOT NULL AND close_time IS NOT NULL AND close_time > open_time)
  ),
  CONSTRAINT clinic_hours_effective_range_check CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_clinic_hours_clinic_weekday_effective ON clinic_hours (clinic_id, weekday, COALESCE(effective_from, DATE '1900-01-01'));
CREATE INDEX IF NOT EXISTS idx_clinic_hours_clinic_weekday ON clinic_hours (clinic_id, weekday);
CREATE INDEX IF NOT EXISTS idx_clinic_hours_clinic_id ON clinic_hours (clinic_id);

-- ========================
-- 13) provider_availability
-- ========================
CREATE TABLE IF NOT EXISTS provider_availability (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clinic_id bigint NOT NULL REFERENCES clinics(id),
  user_id bigint NOT NULL REFERENCES users(id),
  weekday smallint NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  rule_type text NOT NULL DEFAULT 'available',
  operatory_id bigint NULL REFERENCES operatories(id),
  notes text NULL,
  effective_from date NULL,
  effective_to date NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  row_version int NOT NULL DEFAULT 1,
  created_by_id bigint NULL,
  updated_by_id bigint NULL,
  CONSTRAINT provider_availability_weekday_check CHECK (weekday BETWEEN 0 AND 6),
  CONSTRAINT provider_availability_time_check CHECK (end_time > start_time),
  CONSTRAINT provider_availability_rule_type_check CHECK (rule_type IN ('available','unavailable')),
  CONSTRAINT provider_availability_effective_range_check CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from)
);

CREATE INDEX IF NOT EXISTS idx_provider_availability_clinic_user_weekday ON provider_availability (clinic_id, user_id, weekday);
CREATE INDEX IF NOT EXISTS idx_provider_availability_user_weekday ON provider_availability (user_id, weekday);
CREATE INDEX IF NOT EXISTS idx_provider_availability_operatory_id ON provider_availability (operatory_id);
CREATE INDEX IF NOT EXISTS idx_provider_availability_clinic_weekday ON provider_availability (clinic_id, weekday);
CREATE INDEX IF NOT EXISTS idx_provider_availability_clinic_id ON provider_availability (clinic_id);
CREATE INDEX IF NOT EXISTS idx_provider_availability_user_id ON provider_availability (user_id);
