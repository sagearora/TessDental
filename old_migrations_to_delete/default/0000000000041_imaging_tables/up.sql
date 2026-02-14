-- ============================================================================
-- Imaging Service Tables
-- ============================================================================
-- Creates imaging_study and imaging_asset tables for the imaging service
-- ============================================================================

-- Imaging Study: represents a capture session or logical group
create table if not exists public.imaging_study (
  id bigserial primary key,
  clinic_id bigint not null,
  patient_id bigint not null,
  kind text not null, -- e.g., 'XRAY_BWX', 'XRAY_PA', 'PHOTO', 'DOCUMENT'
  title text null,
  captured_at timestamptz not null default now(),
  source text null, -- e.g., 'schick-bridge', 'manual-upload'
  
  -- Audit columns
  created_at timestamptz not null default now(),
  created_by_id uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by_id uuid null references public.app_user(id),
  is_active boolean not null default true
);

create index if not exists idx_imaging_study_clinic_patient_time 
  on public.imaging_study(clinic_id, patient_id, captured_at desc);

-- Imaging Asset: one file
create table if not exists public.imaging_asset (
  id bigserial primary key,
  clinic_id bigint not null,
  patient_id bigint not null,
  study_id bigint not null references public.imaging_study(id) on delete cascade,
  modality text not null, -- 'XRAY', 'PHOTO', 'DOC'
  mime_type text not null,
  size_bytes bigint not null,
  sha256 text not null,
  storage_backend text not null, -- 's3' or 'nfs'
  storage_key text not null,
  thumb_key text null,
  web_key text null,
  captured_at timestamptz not null default now(),
  source_device text null, -- e.g., 'Schick 33'
  
  -- Audit columns
  created_at timestamptz not null default now(),
  created_by_id uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by_id uuid null references public.app_user(id),
  is_active boolean not null default true
);

create index if not exists idx_imaging_asset_clinic_patient_time 
  on public.imaging_asset(clinic_id, patient_id, captured_at desc);
  
create index if not exists idx_imaging_asset_study 
  on public.imaging_asset(study_id);

-- Unique constraint on storage key per backend (optional but recommended)
create unique index if not exists idx_imaging_asset_storage_unique 
  on public.imaging_asset(storage_backend, storage_key) 
  where is_active = true;

-- Apply audit stamp trigger
create trigger trg_imaging_study_audit_stamp
  before insert or update on public.imaging_study
  for each row
  execute function audit.fn_stamp_audit_columns();

create trigger trg_imaging_asset_audit_stamp
  before insert or update on public.imaging_asset
  for each row
  execute function audit.fn_stamp_audit_columns();

-- Apply audit event triggers
create trigger trg_imaging_study_audit_event
  after insert or update or delete on public.imaging_study
  for each row
  execute function audit.fn_row_change_to_event();

create trigger trg_imaging_asset_audit_event
  after insert or update or delete on public.imaging_asset
  for each row
  execute function audit.fn_row_change_to_event();
