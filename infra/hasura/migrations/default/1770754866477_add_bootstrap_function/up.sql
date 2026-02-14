-- Create or replace bootstrap function that works with new capability enum structure
CREATE OR REPLACE FUNCTION public.fn_bootstrap_system(
  p_admin_email text,
  p_admin_password_hash text,
  p_admin_first_name text,
  p_admin_last_name text,
  p_clinic_name text,
  p_clinic_timezone text
) RETURNS setof public.bootstrap_result
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id uuid;
  v_clinic_id bigint;
  v_clinic_user_id bigint;
  v_role_id bigint;
BEGIN
  -- Lock to prevent concurrent bootstraps
  PERFORM pg_advisory_xact_lock(9223372036854775807);

  -- If any user exists, setup is complete
  IF EXISTS(SELECT 1 FROM public.app_user) THEN
    RAISE EXCEPTION 'setup_complete';
  END IF;

  -- Create admin user
  INSERT INTO public.app_user (email, password_hash, first_name, last_name, is_active)
  VALUES (lower(trim(p_admin_email)), p_admin_password_hash, p_admin_first_name, p_admin_last_name, true)
  RETURNING id INTO v_user_id;

  -- Create clinic
  INSERT INTO public.clinic (name, timezone, is_active)
  VALUES (p_clinic_name, coalesce(nullif(p_clinic_timezone, ''), 'America/Toronto'), true)
  RETURNING id INTO v_clinic_id;

  -- Create clinic_user membership
  INSERT INTO public.clinic_user (clinic_id, user_id, is_active, joined_at)
  VALUES (v_clinic_id, v_user_id, true, now())
  RETURNING id INTO v_clinic_user_id;

  -- Create Administrator role
  INSERT INTO public.role (clinic_id, name, description, is_active)
  VALUES (v_clinic_id, 'Administrator', 'System administrator with all capabilities', true)
  RETURNING id INTO v_role_id;

  -- Assign ALL capabilities from the capability table to the Administrator role
  INSERT INTO public.role_capability (role_id, capability_key)
  SELECT v_role_id, c.value
  FROM public.capability c
  ON CONFLICT DO NOTHING;

  -- Assign role to user
  INSERT INTO public.clinic_user_role (clinic_user_id, role_id)
  VALUES (v_clinic_user_id, v_role_id)
  ON CONFLICT DO NOTHING;

  -- Log bootstrap event to audit.event
  INSERT INTO audit.event (
    occurred_at,
    actor_user_id,
    clinic_id,
    action,
    entity_type,
    entity_id,
    success,
    payload
  )
  VALUES (
    now(),
    v_user_id,
    v_clinic_id,
    'bootstrap.system',
    'public.bootstrap',
    v_user_id::text,
    true,
    jsonb_build_object(
      'admin_user_id', v_user_id,
      'clinic_id', v_clinic_id,
      'clinic_user_id', v_clinic_user_id,
      'role_id', v_role_id
    )
  );

  -- Return the bootstrap result
  RETURN QUERY
  SELECT 
    v_user_id as admin_user_id,
    v_clinic_id as clinic_id,
    v_clinic_user_id as clinic_user_id,
    v_role_id as role_id,
    true as success;
END;
$$;
