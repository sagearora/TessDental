-- ============================================================================
-- Patient Field Configuration
-- ============================================================================
-- Allows clinics to configure which fields are shown/required in patient forms
-- ============================================================================

create table if not exists public.patient_field_config (
  id bigserial primary key,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  field_key text not null,
  field_label text not null,
  display_order integer not null default 0,
  is_displayed boolean not null default true,
  is_required boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id),
  unique (clinic_id, field_key)
);

-- Index for efficient queries
create index if not exists idx_patient_field_config_clinic_order
on public.patient_field_config(clinic_id, display_order)
where is_active = true;

-- Audit triggers
drop trigger if exists tr_stamp_audit_columns on public.patient_field_config;
create trigger tr_stamp_audit_columns
before insert or update on public.patient_field_config
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.patient_field_config;
create trigger tr_audit_row_change
after insert or update or delete on public.patient_field_config
for each row execute function audit.fn_row_change_to_event();

-- Insert default field configurations for existing clinics
-- This will be run for each clinic, but we'll seed common fields
do $$
declare
  v_clinic_id bigint;
  v_order integer := 0;
begin
  for v_clinic_id in select id from public.clinic loop
    -- Core person fields
    insert into public.patient_field_config (clinic_id, field_key, field_label, display_order, is_displayed, is_required)
    values
      (v_clinic_id, 'first_name', 'First Name', v_order, true, true),
      (v_clinic_id, 'last_name', 'Last Name', v_order + 1, true, true),
      (v_clinic_id, 'preferred_name', 'Nickname', v_order + 2, false, false),
      (v_clinic_id, 'middle_name', 'Middle name', v_order + 3, false, false),
      (v_clinic_id, 'dob', 'Date of Birth', v_order + 4, true, false),
      (v_clinic_id, 'gender', 'Gender', v_order + 5, false, false),
      (v_clinic_id, 'preferred_language', 'Language', v_order + 6, false, false)
    on conflict (clinic_id, field_key) do nothing;
    
    v_order := v_order + 10;
    
    -- Contact fields
    insert into public.patient_field_config (clinic_id, field_key, field_label, display_order, is_displayed, is_required)
    values
      (v_clinic_id, 'email', 'Email', v_order, true, false),
      (v_clinic_id, 'cell_phone', 'Cell phone', v_order + 1, true, true),
      (v_clinic_id, 'home_phone', 'Home phone', v_order + 2, false, false),
      (v_clinic_id, 'work_phone', 'Work phone', v_order + 3, false, false),
      (v_clinic_id, 'contact_method', 'Contact Method', v_order + 4, false, false)
    on conflict (clinic_id, field_key) do nothing;
    
    v_order := v_order + 10;
    
    -- Patient-specific fields
    insert into public.patient_field_config (clinic_id, field_key, field_label, display_order, is_displayed, is_required)
    values
      (v_clinic_id, 'chart_no', 'Client Number', v_order, false, false),
      (v_clinic_id, 'status', 'Status', v_order + 1, false, false),
      (v_clinic_id, 'referred_by', 'Referred by', v_order + 2, true, true),
      (v_clinic_id, 'family_doctor_name', 'Family Doctor', v_order + 3, false, false),
      (v_clinic_id, 'family_doctor_phone', 'Family Doctor Phone', v_order + 4, false, false),
      (v_clinic_id, 'imaging_id', 'Imaging ID', v_order + 5, false, false)
    on conflict (clinic_id, field_key) do nothing;
    
    v_order := v_order + 10;
    
    -- Address fields
    insert into public.patient_field_config (clinic_id, field_key, field_label, display_order, is_displayed, is_required)
    values
      (v_clinic_id, 'address', 'Address', v_order, true, false),
      (v_clinic_id, 'billing_address', 'Billing address', v_order + 1, false, false)
    on conflict (clinic_id, field_key) do nothing;
    
    v_order := v_order + 10;
    
    -- Relationship fields
    insert into public.patient_field_config (clinic_id, field_key, field_label, display_order, is_displayed, is_required)
    values
      (v_clinic_id, 'head_of_household', 'Head of Household', v_order, true, false),
      (v_clinic_id, 'responsible_party', 'Responsible Party', v_order + 1, false, false)
    on conflict (clinic_id, field_key) do nothing;
    
    v_order := v_order + 10;
    
    -- Assignment fields (these might not be in the base schema yet, but we'll include them)
    insert into public.patient_field_config (clinic_id, field_key, field_label, display_order, is_displayed, is_required)
    values
      (v_clinic_id, 'dentist', 'Dentist', v_order, false, false),
      (v_clinic_id, 'hygienist', 'Hygienist', v_order + 1, false, false),
      (v_clinic_id, 'preferred_clinic', 'Preferred clinic', v_order + 2, false, false),
      (v_clinic_id, 'fee_schedule', 'Fee Schedule', v_order + 3, false, false),
      (v_clinic_id, 'profile_tags', 'Profile Tags', v_order + 4, false, false)
    on conflict (clinic_id, field_key) do nothing;
  end loop;
end $$;
