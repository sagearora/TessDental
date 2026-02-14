-- Audit schema and functions
create schema if not exists audit;

-- Request context captured per-transaction via set_config(...)
-- We'll use current_setting('audit.*', true) from triggers/functions.
create or replace function audit.fn_ctx_text(key text)
returns text
language sql
stable
as $$
  select nullif(current_setting(key, true), '');
$$;

create or replace function audit.fn_ctx_uuid(key text)
returns uuid
language sql
stable
as $$
  select (nullif(current_setting(key, true), ''))::uuid;
$$;

create or replace function audit.fn_ctx_bigint(key text)
returns bigint
language sql
stable
as $$
  select (nullif(current_setting(key, true), ''))::bigint;
$$;

-- Main audit table (append-only)
create table if not exists audit.event (
  id bigserial primary key,
  occurred_at timestamptz not null default now(),

  -- who/where
  actor_user_id uuid null,
  clinic_id bigint null,
  request_id text null,
  ip text null,
  user_agent text null,

  -- what
  action text not null,              -- e.g. 'user.create', 'role.assign'
  entity_type text not null,         -- e.g. 'app_user', 'clinic_user_role'
  entity_id text null,               -- store as text for mixed id types
  success boolean not null default true,

  -- details
  payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_audit_event_time on audit.event(occurred_at desc);
create index if not exists idx_audit_event_actor on audit.event(actor_user_id, occurred_at desc);
create index if not exists idx_audit_event_clinic on audit.event(clinic_id, occurred_at desc);
create index if not exists idx_audit_event_action on audit.event(action, occurred_at desc);

-- Helper to insert audit row (use inside auth service transactions)
create or replace function audit.fn_log(
  p_action text,
  p_entity_type text,
  p_entity_id text,
  p_payload jsonb,
  p_success boolean default true
) returns void
language plpgsql
as $$
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
