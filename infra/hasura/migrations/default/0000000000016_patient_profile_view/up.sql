-- ============================================================================
-- Patient Profile View
-- ============================================================================
-- Ready-to-render view for UI consumption
-- ============================================================================

create or replace view public.patient_profile_v as
select
  -- Patient info
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
  hm_head.person_id as household_head_person_id,
  hm_head.relationship_to_head as household_head_relationship,
  
  -- Current user's relationship to head
  hm_current.relationship_to_head,
  hm_current.role as household_role,
  
  -- Responsible party
  pf.responsible_party_person_id,
  rp.first_name as responsible_party_first_name,
  rp.last_name as responsible_party_last_name,
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
left join public.household_member hm_current on hm_current.person_id = p.id and hm_current.is_active = true
left join public.household h on h.id = hm_current.household_id and h.is_active = true
left join public.household_member hm_head on hm_head.household_id = h.id and hm_head.role = 'head' and hm_head.is_active = true
left join public.patient_financial pf on pf.patient_person_id = pt.person_id
left join public.person rp on rp.id = pf.responsible_party_person_id
where pt.person_id is not null; -- Only show patients

-- Add comment
comment on view public.patient_profile_v is 'Ready-to-render patient profile view with all related data aggregated';
