-- ============================================================================
-- Rollback: Remove seeded field_config entries
-- ============================================================================

DELETE FROM public.field_config WHERE key IN (
  'first_name', 'last_name', 'preferred_name', 'middle_name', 'dob', 'gender', 'preferred_language',
  'email', 'cell_phone', 'home_phone', 'work_phone', 'contact_method',
  'chart_no', 'status', 'referred_by', 'family_doctor_name', 'family_doctor_phone', 'imaging_id',
  'address', 'billing_address',
  'head_of_household', 'responsible_party',
  'dentist', 'hygienist', 'preferred_clinic', 'fee_schedule', 'profile_tags'
);
