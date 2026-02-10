-- ============================================================================
-- Create View for Patient Search (Hasura-trackable workaround)
-- ============================================================================
-- Since Hasura has issues tracking SETOF composite type functions,
-- we'll create a view that can be queried directly with filters
-- ============================================================================

-- Create a view that exposes patient_search table for GraphQL queries
-- This allows us to query the search table directly with Hasura filters
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

-- Grant permissions (inherited from patient_search table permissions)
