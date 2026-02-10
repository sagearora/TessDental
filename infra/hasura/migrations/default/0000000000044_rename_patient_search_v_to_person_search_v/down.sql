-- ============================================================================
-- Rollback: Rename person_search_v back to patient_search_v
-- ============================================================================

-- Drop the new view
drop view if exists public.person_search_v cascade;

-- Recreate the old view
create or replace view public.patient_search_v as
select
  clinic_id,
  patient_person_id,
  first_name,
  last_name,
  preferred_name,
  dob,
  chart_no,
  status,
  phone_norm,
  email_norm,
  search_text,
  is_active,
  created_at,
  created_by,
  updated_at,
  updated_by
from public.patient_search;
