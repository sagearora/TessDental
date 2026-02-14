-- Add audit.fn_log function for manual audit event logging
-- This function is used by the auth service and imaging service to log semantic business events
-- (as opposed to automatic row-level changes logged by audit.fn_row_change_to_event triggers)

CREATE FUNCTION audit.fn_log(
  p_action text,
  p_entity_type text,
  p_entity_id text,
  p_payload jsonb,
  p_success boolean DEFAULT true
) RETURNS void
LANGUAGE plpgsql
AS $$
begin
  insert into audit.event (
    actor_user_id,
    clinic_id,
    request_id,
    ip,
    user_agent,
    action,
    entity_type,
    entity_id,
    payload,
    success
  )
  values (
    audit.fn_ctx_uuid('audit.actor_user_id'),
    audit.fn_ctx_bigint('audit.clinic_id'),
    audit.fn_ctx_text('audit.request_id'),
    audit.fn_ctx_text('audit.ip'),
    audit.fn_ctx_text('audit.user_agent'),
    p_action,
    p_entity_type,
    p_entity_id,
    coalesce(p_payload, '{}'::jsonb),
    p_success
  );
end;
$$;
