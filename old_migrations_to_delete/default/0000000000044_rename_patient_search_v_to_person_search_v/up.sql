-- ============================================================================
-- Rename patient_search_v to person_search_v
-- ============================================================================
-- The search view should be named person_search_v to reflect that it searches
-- across all persons (patients and non-patients), not just patients.
-- ============================================================================

-- Drop the old view
drop view if exists public.patient_search_v cascade;

-- Create the new view with the same structure
-- Note: This view will be updated in migration 0045 to use person_search table
-- For now, we create it referencing patient_search (will be updated later)
create or replace view public.person_search_v as
select
  clinic_id,
  patient_person_id as person_id,
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

-- Grant permissions (inherited from patient_search table permissions)
