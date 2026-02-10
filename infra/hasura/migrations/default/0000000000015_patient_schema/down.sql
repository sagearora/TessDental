-- ============================================================================
-- Patient Schema Rollback
-- ============================================================================

drop table if exists public.insurance_subscriber cascade;
drop table if exists public.patient_financial cascade;
drop table if exists public.household_member cascade;
drop table if exists public.household cascade;
drop table if exists public.person_address cascade;
drop table if exists public.person_contact_point cascade;
drop table if exists public.patient cascade;
drop table if exists public.person cascade;
