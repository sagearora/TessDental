-- ============================================================================
-- Person Relationships Implementation - Rollback
-- ============================================================================

-- Remove indexes
drop index if exists public.idx_patient_financial_responsible;
drop index if exists public.uq_household_member_household_head;
drop index if exists public.uq_household_member_person_active;
drop index if exists public.idx_patient_household;
drop index if exists public.idx_household_responsible_party;
drop index if exists public.idx_household_primary_contact;

-- Remove triggers
drop trigger if exists tr_ensure_patient_household_membership on public.patient;
drop trigger if exists tr_ensure_household_contact_membership on public.household;

-- Drop functions
drop function if exists public.fn_set_responsible_party(bigint, bigint, boolean);
drop function if exists public.fn_set_patient_household_defaults(bigint);
drop function if exists public.fn_ensure_patient_household_membership();
drop function if exists public.fn_ensure_household_contact_membership();
drop function if exists public.fn_get_patient_age_years(bigint);

-- Remove is_active from patient_financial
alter table public.patient_financial
drop column if exists is_active;

-- Remove household_id from patient
alter table public.patient
drop column if exists household_id;

-- Remove relationship_to_primary_contact from household_member
alter table public.household_member
drop constraint if exists chk_household_member_rel;
alter table public.household_member
drop column if exists relationship_to_primary_contact;

-- Remove columns from household
alter table public.household
drop column if exists default_responsible_party_person_id,
drop column if exists primary_contact_person_id;
