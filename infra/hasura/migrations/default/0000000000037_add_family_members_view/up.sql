-- ============================================================================
-- Add family_members_v view (was missing from migration 0035)
-- ============================================================================

create or replace view public.family_members_v as
select
  p2.clinic_id,
  p2.id as person_id,
  fg.family_root_person_id,
  p2.first_name,
  p2.last_name,
  p2.preferred_name,
  p2.dob,
  p2.responsible_party_id,
  p2.household_relationship,
  exists(select 1 from public.patient pat where pat.person_id = p2.id and pat.is_active = true) as is_patient
from public.person p2
join public.family_group_v fg
  on fg.person_id = p2.id;

comment on view public.family_members_v is 'Given a person_id, returns all family members sharing the same root.';
