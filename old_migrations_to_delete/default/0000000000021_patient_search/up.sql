-- ============================================================================
-- Patient Search Implementation (v2 - Instant, clinic-scoped)
-- ============================================================================
-- Implements specs/person-search.md v2
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Normalize contact values
-- ----------------------------------------------------------------------------

-- Add normalized column
alter table public.person_contact_point
add column if not exists value_norm text;

-- Create normalization function
create or replace function public.fn_normalize_contact_point()
returns trigger
language plpgsql
as $$
begin
  if NEW.kind = 'phone' then
    NEW.value_norm := regexp_replace(coalesce(NEW.value,''), '\D', '', 'g');
    if length(NEW.value_norm) = 11 and left(NEW.value_norm,1) = '1' then
      NEW.value_norm := substr(NEW.value_norm,2);
    end if;
  elsif NEW.kind = 'email' then
    NEW.value_norm := lower(trim(coalesce(NEW.value,'')));
  else
    NEW.value_norm := null;
  end if;
  return NEW;
end;
$$;

-- Attach trigger
drop trigger if exists tr_normalize_contact_point on public.person_contact_point;
create trigger tr_normalize_contact_point
before insert or update on public.person_contact_point
for each row execute function public.fn_normalize_contact_point();

-- Backfill existing data
update public.person_contact_point
set value_norm = case
  when kind = 'phone' then
    regexp_replace(coalesce(value,''), '\D', '', 'g')
  when kind = 'email' then
    lower(trim(coalesce(value,'')))
  else null
end
where value_norm is null;

-- Normalize phone numbers: strip leading 1 for NANP
update public.person_contact_point
set value_norm = substr(value_norm,2)
where kind = 'phone'
  and length(value_norm) = 11
  and left(value_norm,1) = '1';

-- Create indexes for normalized values
create index if not exists idx_pcp_phone_norm
on public.person_contact_point (clinic_id, value_norm)
where kind='phone' and is_active=true;

create index if not exists idx_pcp_email_norm
on public.person_contact_point (clinic_id, value_norm)
where kind='email' and is_active=true;

-- ----------------------------------------------------------------------------
-- 2) Enable trigram extension
-- ----------------------------------------------------------------------------

create extension if not exists pg_trgm;

-- ----------------------------------------------------------------------------
-- 3) Create patient_search table (incremental, instant updates)
-- ----------------------------------------------------------------------------

drop table if exists public.patient_search cascade;

create table if not exists public.patient_search (
  clinic_id bigint not null,
  patient_person_id bigint not null,

  first_name text,
  last_name text,
  preferred_name text,
  dob date,
  chart_no text,
  status text,

  phone_norm text,
  email_norm text,

  search_text text not null,

  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id),
  is_active boolean not null default true,

  primary key (clinic_id, patient_person_id)
);

-- Indexes
create index if not exists idx_ps_phone on public.patient_search (clinic_id, phone_norm);
create index if not exists idx_ps_chart on public.patient_search (clinic_id, chart_no);
create index if not exists idx_ps_trgm on public.patient_search using gin (search_text gin_trgm_ops);
create index if not exists idx_ps_last_first on public.patient_search (clinic_id, last_name, first_name);

-- Audit triggers (stamp only, NO audit.event trigger - this is derived data)
drop trigger if exists tr_stamp_audit_columns on public.patient_search;
create trigger tr_stamp_audit_columns
before insert or update on public.patient_search
for each row execute function audit.fn_stamp_audit_columns();

-- Note: We do NOT attach tr_audit_row_change to patient_search
-- because it's derived data and would spam audit.event

-- ----------------------------------------------------------------------------
-- 4) Create rebuild function for one patient row
-- ----------------------------------------------------------------------------

create or replace function public.fn_rebuild_patient_search_row(p_patient_person_id bigint)
returns void
language plpgsql
as $$
declare
  v_clinic_id bigint;
  v_first text;
  v_last text;
  v_pref text;
  v_dob date;
  v_chart text;
  v_status text;
  v_phone text;
  v_email text;
  v_search text;
begin
  select pat.clinic_id, p.first_name, p.last_name, p.preferred_name, p.dob, pat.chart_no, pat.status
  into v_clinic_id, v_first, v_last, v_pref, v_dob, v_chart, v_status
  from public.patient pat
  join public.person p on p.id = pat.person_id
  where pat.person_id = p_patient_person_id
    and pat.is_active = true
    and p.is_active = true;

  if v_clinic_id is null then
    delete from public.patient_search
    where patient_person_id = p_patient_person_id;
    return;
  end if;

  select cp.value_norm
  into v_phone
  from public.person_contact_point cp
  where cp.person_id = p_patient_person_id and cp.kind='phone' and cp.is_active=true
  order by cp.is_primary desc, cp.id asc
  limit 1;

  select cp.value_norm
  into v_email
  from public.person_contact_point cp
  where cp.person_id = p_patient_person_id and cp.kind='email' and cp.is_active=true
  order by cp.is_primary desc, cp.id asc
  limit 1;

  select lower(concat_ws(' ',
    v_first, v_last, v_pref, coalesce(v_chart,''),
    coalesce((
      select string_agg(cp2.value_norm, ' ')
      from public.person_contact_point cp2
      where cp2.person_id = p_patient_person_id and cp2.is_active=true
    ), '')
  )) into v_search;

  insert into public.patient_search (
    clinic_id, patient_person_id,
    first_name, last_name, preferred_name, dob,
    chart_no, status, phone_norm, email_norm,
    search_text, is_active
  )
  values (
    v_clinic_id, p_patient_person_id,
    v_first, v_last, v_pref, v_dob,
    v_chart, v_status, v_phone, v_email,
    coalesce(v_search,''), true
  )
  on conflict (clinic_id, patient_person_id) do update set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    preferred_name = excluded.preferred_name,
    dob = excluded.dob,
    chart_no = excluded.chart_no,
    status = excluded.status,
    phone_norm = excluded.phone_norm,
    email_norm = excluded.email_norm,
    search_text = excluded.search_text,
    updated_at = now();
end;
$$;

-- ----------------------------------------------------------------------------
-- 5) Create triggers to keep search table in sync (instant updates)
-- ----------------------------------------------------------------------------

-- Person changes trigger
create or replace function public.fn_person_after_change_rebuild_search()
returns trigger language plpgsql
as $$
begin
  if exists (select 1 from public.patient where person_id = new.id) then
    perform public.fn_rebuild_patient_search_row(new.id);
  end if;
  return null;
end;
$$;

drop trigger if exists tr_person_rebuild_search on public.person;
create trigger tr_person_rebuild_search
after insert or update on public.person
for each row execute function public.fn_person_after_change_rebuild_search();

-- Patient changes trigger
create or replace function public.fn_patient_after_change_rebuild_search()
returns trigger language plpgsql
as $$
begin
  perform public.fn_rebuild_patient_search_row(new.person_id);
  return null;
end;
$$;

drop trigger if exists tr_patient_rebuild_search on public.patient;
create trigger tr_patient_rebuild_search
after insert or update on public.patient
for each row execute function public.fn_patient_after_change_rebuild_search();

-- Contact point changes trigger
create or replace function public.fn_contact_point_after_change_rebuild_search()
returns trigger language plpgsql
as $$
declare
  v_person_id bigint := coalesce(new.person_id, old.person_id);
begin
  if exists (select 1 from public.patient where person_id = v_person_id) then
    perform public.fn_rebuild_patient_search_row(v_person_id);
  end if;
  return null;
end;
$$;

drop trigger if exists tr_contact_point_rebuild_search on public.person_contact_point;
create trigger tr_contact_point_rebuild_search
after insert or update or delete on public.person_contact_point
for each row execute function public.fn_contact_point_after_change_rebuild_search();

-- ----------------------------------------------------------------------------
-- 6) Backfill existing patients
-- ----------------------------------------------------------------------------

-- Use the rebuild function for all existing patients
do $$
declare
  patient_rec record;
begin
  for patient_rec in select person_id from public.patient where is_active = true
  loop
    perform public.fn_rebuild_patient_search_row(patient_rec.person_id);
  end loop;
end;
$$;

-- ----------------------------------------------------------------------------
-- 7) Create composite type for search results (Hasura-trackable)
-- ----------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'patient_search_result'
      and n.nspname = 'public'
  ) then
    create type public.patient_search_result as (
      patient_person_id bigint,
      first_name text,
      last_name text,
      preferred_name text,
      dob date,
      chart_no text,
      status text,
      phone_norm text,
      email_norm text
    );
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- 8) Create search function (clinic-scoped via Hasura session)
-- ----------------------------------------------------------------------------

create or replace function public.fn_search_patients(
  p_query text,
  p_limit int default 25
)
returns setof public.patient_search_result
language plpgsql
stable
as $$
declare
  v_clinic_id bigint;
  q text := lower(trim(coalesce(p_query,'')));
  digits text := regexp_replace(coalesce(p_query,''), '\D', '', 'g');
  v_clinic_id_str text;
begin
  -- Get clinic_id from Hasura session variable
  v_clinic_id_str := nullif(current_setting('hasura.user', true), '')::jsonb->>'x-hasura-clinic-id';
  
  if v_clinic_id_str is null then
    raise exception 'missing_clinic_context';
  end if;
  
  v_clinic_id := v_clinic_id_str::bigint;

  if q = '' then
    return;
  end if;

  -- phone-like query: digits >= 7
  if length(digits) >= 7 then
    return query
    select
      ps.patient_person_id,
      ps.first_name,
      ps.last_name,
      ps.preferred_name,
      ps.dob,
      ps.chart_no,
      ps.status,
      ps.phone_norm,
      ps.email_norm
    from public.patient_search ps
    where ps.clinic_id = v_clinic_id
      and ps.phone_norm like digits || '%'
    order by ps.phone_norm
    limit p_limit;
    return;
  end if;

  -- Else, use trigram similarity on search_text
  return query
  select
    ps.patient_person_id,
    ps.first_name,
    ps.last_name,
    ps.preferred_name,
    ps.dob,
    ps.chart_no,
    ps.status,
    ps.phone_norm,
    ps.email_norm
  from public.patient_search ps
  where ps.clinic_id = v_clinic_id
    and (ps.search_text % q or (ps.chart_no is not null and ps.chart_no ilike q || '%'))
  order by
    case when ps.chart_no ilike q || '%' then 0 else 1 end,
    similarity(ps.search_text, q) desc,
    ps.last_name asc,
    ps.first_name asc
  limit p_limit;
end;
$$;
