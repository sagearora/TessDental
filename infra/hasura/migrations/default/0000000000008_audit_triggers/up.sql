-- ============================================================================
-- Audit Rules Implementation
-- ============================================================================
-- This migration implements the Public Entity Auditing Standard v1
-- See specs/audit-rules.md for details
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Hasura session extraction functions (for Hasura mutations)
-- ----------------------------------------------------------------------------

create or replace function audit.fn_hasura_session()
returns jsonb
language sql
stable
as $$
  select coalesce(current_setting('hasura.user', true), '{}')::jsonb
$$;

create or replace function audit.fn_hasura_user_id()
returns uuid
language sql
stable
as $$
  select nullif(audit.fn_hasura_session()->>'x-hasura-user-id','')::uuid
$$;

create or replace function audit.fn_hasura_role()
returns text
language sql
stable
as $$
  select nullif(audit.fn_hasura_session()->>'x-hasura-role','')
$$;

create or replace function audit.fn_hasura_clinic_id()
returns bigint
language sql
stable
as $$
  select nullif(audit.fn_hasura_session()->>'x-hasura-clinic-id','')::bigint
$$;

-- ----------------------------------------------------------------------------
-- 2) Trigger #1: Stamp audit columns (created_by/updated_by)
-- ----------------------------------------------------------------------------

create or replace function audit.fn_stamp_audit_columns()
returns trigger
language plpgsql
as $$
declare
  v_user_id uuid;
begin
  -- Prefer auth-service context
  v_user_id := audit.fn_ctx_uuid('audit.actor_user_id');

  -- Fall back to Hasura session
  if v_user_id is null then
    v_user_id := audit.fn_hasura_user_id();
  end if;

  if TG_OP = 'INSERT' then
    NEW.created_at := coalesce(NEW.created_at, now());
    NEW.updated_at := coalesce(NEW.updated_at, now());

    if NEW.created_by is null then NEW.created_by := v_user_id; end if;
    if NEW.updated_by is null then NEW.updated_by := v_user_id; end if;

  elsif TG_OP = 'UPDATE' then
    NEW.updated_at := now();
    NEW.updated_by := v_user_id;
  end if;

  return NEW;
end;
$$;

-- ----------------------------------------------------------------------------
-- 3) Trigger #2: Row change → audit.event entry
-- ----------------------------------------------------------------------------

create or replace function audit.fn_row_change_to_event()
returns trigger
language plpgsql
as $$
declare
  v_actor_user_id uuid;
  v_clinic_id bigint;
  v_request_id text;
  v_ip text;
  v_user_agent text;
  v_source text;
  v_entity_id text;
  v_payload jsonb;
begin
  -- Prefer auth-service context
  v_actor_user_id := audit.fn_ctx_uuid('audit.actor_user_id');
  v_clinic_id := audit.fn_ctx_bigint('audit.clinic_id');
  v_request_id := audit.fn_ctx_text('audit.request_id');
  v_ip := audit.fn_ctx_text('audit.ip');
  v_user_agent := audit.fn_ctx_text('audit.user_agent');

  if v_actor_user_id is not null then
    v_source := 'auth_service';
  else
    v_source := 'hasura';
    v_actor_user_id := audit.fn_hasura_user_id();
    v_clinic_id := audit.fn_hasura_clinic_id();
    -- request_id/ip/ua may be null for Hasura unless you later proxy it
  end if;

  -- Best effort entity_id: if the table has "id" column use it
  if TG_OP in ('INSERT','UPDATE') then
    v_entity_id := to_jsonb(NEW)->>'id';
  else
    v_entity_id := to_jsonb(OLD)->>'id';
  end if;

  v_payload := jsonb_build_object(
    'source', v_source,
    'schema', TG_TABLE_SCHEMA,
    'table', TG_TABLE_NAME,
    'op', TG_OP,
    'row_before', case when TG_OP in ('UPDATE','DELETE') then to_jsonb(OLD) else null end,
    'row_after',  case when TG_OP in ('INSERT','UPDATE') then to_jsonb(NEW) else null end
  );

  insert into audit.event (
    occurred_at,
    actor_user_id,
    clinic_id,
    request_id,
    ip,
    user_agent,
    action,
    entity_type,
    entity_id,
    success,
    payload
  )
  values (
    now(),
    v_actor_user_id,
    v_clinic_id,
    v_request_id,
    v_ip,
    v_user_agent,
    lower(TG_TABLE_NAME) || '.' || lower(TG_OP), -- e.g. operatory.insert
    TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME,
    v_entity_id,
    true,
    v_payload
  );

  if TG_OP = 'DELETE' then return OLD; else return NEW; end if;
end;
$$;

-- ----------------------------------------------------------------------------
-- 4) Retrofit public.operatory table
-- ----------------------------------------------------------------------------

-- Add missing audit columns
alter table public.operatory
  add column if not exists created_by uuid null references public.app_user(id),
  add column if not exists updated_by uuid null references public.app_user(id);

-- Note: created_at, updated_at, and is_active already exist from the initial migration

-- Attach stamp trigger
drop trigger if exists tr_stamp_audit_columns on public.operatory;
create trigger tr_stamp_audit_columns
before insert or update on public.operatory
for each row execute function audit.fn_stamp_audit_columns();

-- Attach audit event trigger
drop trigger if exists tr_audit_row_change on public.operatory;
create trigger tr_audit_row_change
after insert or update or delete on public.operatory
for each row execute function audit.fn_row_change_to_event();

-- Update the view to include audit columns
-- Drop and recreate to avoid column name conflicts
drop view if exists public.operatory_v;
create view public.operatory_v as
select
  id,
  clinic_id,
  name,
  is_bookable,
  is_active,
  color,
  created_at,
  created_by,
  updated_at,
  updated_by
from public.operatory;

-- ============================================================================
-- Verification Query
-- ============================================================================
-- After applying this migration, test by:
-- 1. Insert a row via Hasura mutation (or direct SQL)
-- 2. Verify audit.event was created:
--
--    select *
--    from audit.event
--    where entity_type = 'public.operatory'
--    order by occurred_at desc
--    limit 5;
--
-- 3. Verify created_by/updated_by were set:
--
--    select id, name, created_by, updated_by, created_at, updated_at
--    from public.operatory
--    order by created_at desc
--    limit 5;
-- ============================================================================
