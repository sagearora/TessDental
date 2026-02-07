-- ============================================================================
-- Capability Check Function for Hasura Permissions
-- ============================================================================
-- Creates a function that can be used in Hasura permission filters/checks
-- to verify capabilities using JWT claims
-- ============================================================================

-- Function to check if the current Hasura user has a specific capability
-- This can be used in Hasura permission filters
create or replace function public.fn_hasura_has_capability(
  p_capability_key text
) returns boolean
language sql
stable
as $$
  select public.fn_has_capability(
    audit.fn_hasura_clinic_id(),
    audit.fn_hasura_user_id(),
    p_capability_key
  );
$$;

-- Function to check if the current Hasura user has any of the specified capabilities
-- Useful for OR logic (e.g., 'clinic.manage' OR 'system.admin')
create or replace function public.fn_hasura_has_any_capability(
  p_capability_keys text[]
) returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from unnest(p_capability_keys) as cap_key
    where public.fn_has_capability(
      audit.fn_hasura_clinic_id(),
      audit.fn_hasura_user_id(),
      cap_key
    ) = true
  );
$$;
