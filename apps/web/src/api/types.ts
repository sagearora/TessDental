// API types matching the database schema

export interface Clinic {
  id: number;
  name: string;
  timezone: string;
  unit_length_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  row_version: number;
}

export interface User {
  id: number;
  clinic_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "provider" | "staff" | "billing" | "read_only";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  row_version: number;
}

export interface Patient {
  id: number;
  clinic_id: number;
  chart_no: string | null;
  first_name: string;
  last_name: string;
  dob: string | null;
  email: string | null;
  preferred_contact_method: "sms" | "email" | "phone" | null;
  default_dentist_id: number | null;
  default_hygienist_id: number | null;
  default_assistant_id: number | null;
  responsible_party_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  row_version: number;
}

export interface Operatory {
  id: number;
  clinic_id: number;
  name: string;
  short_name: string | null;
  is_bookable: boolean;
  provider_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  row_version: number;
}

export interface AppointmentStatus {
  id: number;
  clinic_id: number;
  name: string;
  workflow_order: number;
  color: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  row_version: number;
}

export interface AppointmentConfirmation {
  id: number;
  clinic_id: number;
  name: string;
  workflow_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  row_version: number;
}

export interface AppointmentTag {
  id: number;
  clinic_id: number;
  name: string;
  color: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  row_version: number;
}

export interface Appointment {
  id: number;
  clinic_id: number;
  type: "appointment" | "block";
  start_at: string; // ISO timestamptz
  length_minutes: number;
  end_at: string; // ISO timestamptz
  operatory_id: number;
  provider_id: number | null;
  patient_id: number | null;
  status_id: number;
  confirmation_id: number | null;
  title: string | null;
  notes: string | null;
  show_on_calendar: boolean;
  is_online_booking: boolean;
  is_self_bookable: boolean;
  booked_at: string;
  booked_by_id: number | null;
  source: "front_desk" | "online" | "automation" | "import";
  last_modified_at: string;
  last_modified_by_id: number | null;
  cancelled_at: string | null;
  cancelled_by_id: number | null;
  cancel_reason: string | null;
  arrived_at: string | null;
  seated_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  row_version: number;
}

export interface AppointmentWithRelations extends Appointment {
  patient?: Patient;
  provider?: User;
  operatory?: Operatory;
  status?: AppointmentStatus;
  confirmation?: AppointmentConfirmation;
  tags?: AppointmentTag[];
}

export interface CreatePatientRequest {
  clinic_id: number;
  chart_no?: string | null;
  first_name: string;
  last_name: string;
  dob?: string | null;
  email?: string | null;
  preferred_contact_method?: "sms" | "email" | "phone" | null;
}

export interface CreateAppointmentRequest {
  clinic_id: number;
  type?: "appointment" | "block";
  start_at: string;
  length_minutes: number;
  operatory_id: number;
  provider_id?: number | null;
  patient_id?: number | null;
  status_id: number;
  confirmation_id?: number | null;
  title?: string | null;
  notes?: string | null;
  source?: "front_desk" | "online" | "automation" | "import";
}

export interface UpdateAppointmentRequest {
  start_at?: string;
  length_minutes?: number;
  operatory_id?: number;
  provider_id?: number | null;
  patient_id?: number | null;
  status_id?: number;
  confirmation_id?: number | null;
  title?: string | null;
  notes?: string | null;
  row_version: number;
}
