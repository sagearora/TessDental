-- ============================================================================
-- Patient Status Enum Table - Rollback
-- ============================================================================

-- Remove foreign key constraint
alter table public.patient
drop constraint if exists fk_patient_status;

-- Drop index
drop index if exists public.idx_patient_status_enum_active;

-- Drop triggers
drop trigger if exists tr_audit_row_change on public.patient_status_enum;
drop trigger if exists tr_stamp_audit_columns on public.patient_status_enum;

-- Drop table
drop table if exists public.patient_status_enum;
