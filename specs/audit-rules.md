# Public Entity Auditing Standard v1 (public + audit schemas)

## Hard Rule

Any new table in `public` must include:

1. standard audit columns
2. stamp trigger (sets updated_at + created_by/updated_by)
3. audit-event trigger (writes to `audit.event` for INSERT/UPDATE/DELETE)

No entity table is “done” until all three are present.

---

## 1) Standard audit columns for all `public.*` entity tables

Add these columns to every mutable table:

```sql
created_at timestamptz not null default now(),
created_by uuid null references public.app_user(id),
updated_at timestamptz not null default now(),
updated_by uuid null references public.app_user(id),
is_active boolean not null default true
```

Notes:

* `public.app_user(id)` is your identity UUID table (even if not tracked in Hasura).
* For tables that shouldn’t have `is_active`, explicitly document the exception (rare).

---

## 2) Shared helper functions (create once in audit schema)

### 2.1 Hasura session extraction (for Hasura mutations)

Hasura sets a JSON session variable `hasura.user` for mutations.

Create:

```sql
create schema if not exists audit;

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
```

### 2.2 Auth-service context extraction (for auth service writes)

Auth service sets `set_config('audit.actor_user_id', ...)`, etc.

```sql
create or replace function audit.fn_ctx_text(key text)
returns text language sql stable
as $$ select nullif(current_setting(key, true), '') $$;

create or replace function audit.fn_ctx_uuid(key text)
returns uuid language sql stable
as $$ select nullif(current_setting(key, true), '')::uuid $$;

create or replace function audit.fn_ctx_bigint(key text)
returns bigint language sql stable
as $$ select nullif(current_setting(key, true), '')::bigint $$;
```

---

## 3) Trigger #1: stamp audit columns (created_by/updated_by)

Create once:

```sql
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
```

Attach to every entity table:

```sql
create trigger tr_stamp_audit_columns
before insert or update on public.<table>
for each row execute function audit.fn_stamp_audit_columns();
```

---

## 4) Trigger #2: row change → audit.event entry

You already have `audit.event`. We’ll write a trigger that inserts one row per change.

### 4.1 Create the trigger function once

```sql
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
```

Hasura’s session variable approach is explicitly recommended for Postgres auditing patterns.

### 4.2 Attach to every entity table

```sql
create trigger tr_audit_row_change
after insert or update or delete on public.<table>
for each row execute function audit.fn_row_change_to_event();
```

---

## 5) Immediate fix: retrofit `public.operatory`

Create a migration that:

1. Adds missing columns (if any)
2. Adds triggers

Example (Cursor should adapt if columns already exist):

```sql
alter table public.operatory
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists created_by uuid null references public.app_user(id),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists updated_by uuid null references public.app_user(id),
  add column if not exists is_active boolean not null default true;

drop trigger if exists tr_stamp_audit_columns on public.operatory;
create trigger tr_stamp_audit_columns
before insert or update on public.operatory
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.operatory;
create trigger tr_audit_row_change
after insert or update or delete on public.operatory
for each row execute function audit.fn_row_change_to_event();
```

After this, creating/changing operatories via Hasura will generate `audit.event` entries.

---

## 6) Definition of Done for every new table

Cursor must include, in the same migration:

1. audit columns present
2. both triggers attached
3. a quick verification query in the PR description (or comment):

```sql
-- Insert a row via Hasura mutation, then verify:
select *
from audit.event
where entity_type = 'public.<table>'
order by occurred_at desc
limit 5;
```

---

## 7) Notes about clinic_id

If a table is clinic-scoped, include `clinic_id bigint not null` on the table.
The audit trigger will also capture `clinic_id` from:

* Hasura claim `x-hasura-clinic-id`
* auth service context `audit.clinic_id`

If you have non-clinic tables, `clinic_id` in audit can be null.