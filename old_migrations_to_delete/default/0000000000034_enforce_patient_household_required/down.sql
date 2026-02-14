-- ============================================================================
-- Rollback: Enforce Patient Household Required
-- ============================================================================

-- Make household_id nullable again
alter table public.patient
alter column household_id drop not null;

-- Restore partial index
drop index if exists public.idx_patient_household;
create index if not exists idx_patient_household
on public.patient(clinic_id, household_id)
where household_id is not null;

-- Drop triggers
drop trigger if exists tr_check_household_after_patient_change on public.patient;
drop trigger if exists tr_check_household_after_membership_change on public.household_member;
drop trigger if exists tr_patient_auto_household on public.patient;

-- Drop functions
drop function if exists public.fn_check_household_after_patient_change();
drop function if exists public.fn_check_household_after_membership_change();
drop function if exists public.fn_deactivate_empty_households();
drop function if exists public.fn_patient_before_insert_auto_household();
drop function if exists public.fn_create_household_for_patient(bigint);

-- Remove deactivated_at column
alter table public.household
drop column if exists deactivated_at;

drop index if exists public.idx_household_deactivated_at;
