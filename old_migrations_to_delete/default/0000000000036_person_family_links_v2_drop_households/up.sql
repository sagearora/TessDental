-- ============================================================================
-- Person family links v2: remove household tables + patient.household_id
-- ============================================================================

-- 1) Drop triggers first (they depend on functions)
drop trigger if exists tr_patient_auto_household on public.patient;
drop trigger if exists tr_ensure_patient_household_membership on public.patient;
drop trigger if exists tr_ensure_household_contact_membership on public.household;
drop trigger if exists tr_check_household_after_patient_change on public.patient;
drop trigger if exists tr_check_household_after_membership_change on public.household_member;

-- 2) Drop functions that auto-create households for patients
drop function if exists public.fn_patient_before_insert_auto_household();
drop function if exists public.fn_create_household_for_patient(bigint);
drop function if exists public.fn_set_patient_household_defaults(bigint);
drop function if exists public.fn_set_patient_household_defaults_v2(bigint);
drop function if exists public.fn_set_responsible_party(bigint, bigint, boolean);
drop function if exists public.fn_set_responsible_party_v2(bigint, bigint, boolean);
drop function if exists public.fn_ensure_patient_household_membership();
drop function if exists public.fn_ensure_household_contact_membership();
drop function if exists public.fn_deactivate_empty_households();
drop function if exists public.fn_check_household_after_patient_change();
drop function if exists public.fn_check_household_after_membership_change();

-- 3) Drop views that depend on household tables or patient.household_id
drop view if exists public.household_members_v;
drop view if exists public.patient_profile_v;

-- 4) Remove patient.household_id (must drop FK/index/constraint first)
alter table public.patient drop constraint if exists patient_household_id_fkey;
drop index if exists public.idx_patient_household;
alter table public.patient drop column if exists household_id;

-- 5) Drop household_member + household tables
drop table if exists public.household_member cascade;
drop table if exists public.household cascade;

-- 6) Recreate patient_profile_v without household references

create or replace view public.patient_profile_v as
select
  -- Person info
  p.id as person_id,
  p.clinic_id,
  p.first_name,
  p.last_name,
  p.preferred_name,
  p.dob,
  p.gender,
  p.preferred_language,
  p.is_active as person_is_active,

  -- Patient extension
  pt.person_id as patient_person_id,
  pt.chart_no,
  pt.status as patient_status,
  pt.family_doctor_name,
  pt.family_doctor_phone,
  pt.imaging_id,
  pt.is_active as patient_is_active,

  -- Responsible party info (new model)
  p.responsible_party_id,
  p.household_relationship,
  
  -- Responsible party person details (family root)
  coalesce(rp.id, p.id) as effective_responsible_party_person_id,
  coalesce(rp.first_name, p.first_name) as responsible_party_first_name,
  coalesce(rp.last_name, p.last_name) as responsible_party_last_name,
  
  -- Is custom payer? (always false in new model, but keep for compatibility)
  false as has_custom_payer,
  
  -- Billing address (from patient_financial if exists, otherwise null)
  pf.billing_address_source,
  pf.custom_billing_address_id,

  -- Primary contact points (aggregated)
  (
    select jsonb_agg(
      jsonb_build_object(
        'kind', kind,
        'label', label,
        'value', value,
        'is_primary', is_primary
      ) order by is_primary desc, kind
    )
    from public.person_contact_point
    where person_id = p.id and is_active = true
  ) as contact_points,

  -- Primary addresses (aggregated)
  (
    select jsonb_agg(
      jsonb_build_object(
        'kind', kind,
        'line1', line1,
        'line2', line2,
        'city', city,
        'region', region,
        'postal_code', postal_code,
        'country', country,
        'is_primary', is_primary
      ) order by kind
    )
    from public.person_address
    where person_id = p.id and is_active = true
  ) as addresses,

  -- Audit columns
  p.created_at,
  p.created_by,
  p.updated_at,
  p.updated_by

from public.person p
left join public.patient pt on pt.person_id = p.id
left join public.person rp on rp.id = p.responsible_party_id
left join public.patient_financial pf on pf.patient_person_id = pt.person_id and pf.is_active = true
where pt.person_id is not null; -- Only show patients

comment on view public.patient_profile_v is 'Patient profile with responsible party relationships (new person-to-person model)';
