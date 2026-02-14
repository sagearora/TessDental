-- ============================================================================
-- Seed field_config table with standard patient fields
-- ============================================================================
-- Inserts all standard field definitions into the global field_config table
-- ============================================================================

-- Core person fields
INSERT INTO public.field_config (key, label, is_active) VALUES
  ('first_name', 'First Name', true),
  ('last_name', 'Last Name', true),
  ('preferred_name', 'Nickname', true),
  ('middle_name', 'Middle name', true),
  ('dob', 'Date of Birth', true),
  ('gender', 'Gender', true),
  ('preferred_language', 'Language', true)
ON CONFLICT (key) DO NOTHING;

-- Contact fields
INSERT INTO public.field_config (key, label, is_active) VALUES
  ('email', 'Email', true),
  ('cell_phone', 'Cell phone', true),
  ('home_phone', 'Home phone', true),
  ('work_phone', 'Work phone', true),
  ('contact_method', 'Contact Method', true)
ON CONFLICT (key) DO NOTHING;

-- Patient-specific fields
INSERT INTO public.field_config (key, label, is_active) VALUES
  ('chart_no', 'Client Number', true),
  ('status', 'Status', true),
  ('referred_by', 'Referred by', true),
  ('family_doctor_name', 'Family Doctor', true),
  ('family_doctor_phone', 'Family Doctor Phone', true),
  ('imaging_id', 'Imaging ID', true)
ON CONFLICT (key) DO NOTHING;

-- Address fields
INSERT INTO public.field_config (key, label, is_active) VALUES
  ('address', 'Address', true),
  ('billing_address', 'Billing address', true)
ON CONFLICT (key) DO NOTHING;

-- Relationship fields
INSERT INTO public.field_config (key, label, is_active) VALUES
  ('head_of_household', 'Head of Household', true),
  ('responsible_party', 'Responsible Party', true)
ON CONFLICT (key) DO NOTHING;

-- Assignment fields
INSERT INTO public.field_config (key, label, is_active) VALUES
  ('dentist', 'Dentist', true),
  ('hygienist', 'Hygienist', true),
  ('preferred_clinic', 'Preferred clinic', true),
  ('fee_schedule', 'Fee Schedule', true),
  ('profile_tags', 'Profile Tags', true)
ON CONFLICT (key) DO NOTHING;
