-- ============================================================================
-- Person Relationships Views
-- ============================================================================
-- Creates views for UI consumption per specs/person-relationships.md
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Update patient_profile_v to include household relationships
-- ----------------------------------------------------------------------------

-- Drop existing view first to avoid column name conflicts
drop view if exists public.patient_profile_v;

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

  -- Household info
  h.id as household_id,
  h.name as household_name,
  h.primary_contact_person_id,
  h.default_responsible_party_person_id,
  
  -- Primary contact person
  pc.first_name as primary_contact_first_name,
  pc.last_name as primary_contact_last_name,
  
  -- Current user's relationship to primary contact
  hm_current.relationship_to_primary_contact,
  hm_current.role as household_role,

  -- Responsible party resolution (per spec: patient_financial > household.default > household.primary_contact)
  coalesce(
    pf.responsible_party_person_id,
    h.default_responsible_party_person_id,
    h.primary_contact_person_id
  ) as effective_responsible_party_person_id,
  
  -- Responsible party person details
  rp.first_name as responsible_party_first_name,
  rp.last_name as responsible_party_last_name,
  
  -- Is custom payer?
  case
    when pf.responsible_party_person_id is not null 
      and pf.responsible_party_person_id != coalesce(h.default_responsible_party_person_id, h.primary_contact_person_id)
    then true
    else false
  end as has_custom_payer,
  
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
left join public.household h on h.id = pt.household_id and h.is_active = true
left join public.household_member hm_current on hm_current.person_id = p.id and hm_current.is_active = true and hm_current.household_id = h.id
left join public.person pc on pc.id = h.primary_contact_person_id
left join public.patient_financial pf on pf.patient_person_id = pt.person_id and pf.is_active = true
left join public.person rp on rp.id = coalesce(
  pf.responsible_party_person_id,
  h.default_responsible_party_person_id,
  h.primary_contact_person_id
)
where pt.person_id is not null; -- Only show patients

comment on view public.patient_profile_v is 'Patient profile with household relationships, primary contact, and responsible party resolution';

-- ----------------------------------------------------------------------------
-- 2) Create household_members_v view
-- ----------------------------------------------------------------------------

create or replace view public.household_members_v as
select
  hm.household_id,
  hm.person_id,
  p.first_name,
  p.last_name,
  p.preferred_name,
  p.dob,
  hm.relationship_to_primary_contact,
  hm.role,
  case when pt.person_id is not null then true else false end as is_patient,
  pt.chart_no,
  hm.is_active,
  hm.created_at,
  hm.updated_at
from public.household_member hm
join public.person p on p.id = hm.person_id
left join public.patient pt on pt.person_id = hm.person_id
where hm.is_active = true;

comment on view public.household_members_v is 'Household members with patient status and relationships';
