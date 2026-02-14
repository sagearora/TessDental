-- ============================================================================
-- Rename patient_search to person_search
-- ============================================================================
-- The search table should be named person_search to reflect that it searches
-- across all persons (patients and non-patients), not just patients.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Drop existing triggers and functions that reference patient_search
-- ----------------------------------------------------------------------------

drop trigger if exists tr_person_rebuild_search on public.person;
drop trigger if exists tr_patient_rebuild_search on public.patient;
drop trigger if exists tr_contact_point_rebuild_search on public.person_contact_point;
drop function if exists public.fn_person_after_change_rebuild_search();
drop function if exists public.fn_patient_after_change_rebuild_search();
drop function if exists public.fn_contact_point_after_change_rebuild_search();
drop function if exists public.fn_rebuild_patient_search_row(bigint);
drop function if exists public.fn_search_patients(text, int);

-- ----------------------------------------------------------------------------
-- 2) Rename table and column
-- ----------------------------------------------------------------------------

-- Rename the table
alter table if exists public.patient_search rename to person_search;

-- Rename the column
alter table if exists public.person_search rename column patient_person_id to person_id;

-- Rename the primary key constraint
alter table if exists public.person_search rename constraint patient_search_pkey to person_search_pkey;

-- Rename indexes
alter index if exists idx_ps_phone rename to idx_person_search_phone;
alter index if exists idx_ps_chart rename to idx_person_search_chart;
alter index if exists idx_ps_trgm rename to idx_person_search_trgm;
alter index if exists idx_ps_last_first rename to idx_person_search_last_first;

-- ----------------------------------------------------------------------------
-- 3) Update the view to reference person_search
-- ----------------------------------------------------------------------------

-- The view was already renamed in migration 0044, but we need to update it to use person_search table
drop view if exists public.person_search_v cascade;

create or replace view public.person_search_v as
select
  clinic_id,
  person_id,
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
from public.person_search;

-- ----------------------------------------------------------------------------
-- 4) Create new rebuild function for all persons (not just patients)
-- ----------------------------------------------------------------------------

create or replace function public.fn_rebuild_person_search_row(p_person_id bigint)
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
  v_is_active boolean;
begin
  -- Get person data (all persons, not just patients)
  select p.clinic_id, p.first_name, p.last_name, p.preferred_name, p.dob, p.is_active
  into v_clinic_id, v_first, v_last, v_pref, v_dob, v_is_active
  from public.person p
  where p.id = p_person_id;

  -- If person doesn't exist or is inactive, delete from search
  if v_clinic_id is null or v_is_active = false then
    delete from public.person_search
    where person_id = p_person_id;
    return;
  end if;

  -- Get patient-specific data if person is a patient (optional)
  select pat.chart_no, pat.status
  into v_chart, v_status
  from public.patient pat
  where pat.person_id = p_person_id
    and pat.is_active = true;

  -- Get primary phone
  select cp.value_norm
  into v_phone
  from public.person_contact_point cp
  where cp.person_id = p_person_id and cp.kind='phone' and cp.is_active=true
  order by cp.is_primary desc, cp.id asc
  limit 1;

  -- Get primary email
  select cp.value_norm
  into v_email
  from public.person_contact_point cp
  where cp.person_id = p_person_id and cp.kind='email' and cp.is_active=true
  order by cp.is_primary desc, cp.id asc
  limit 1;

  -- Build search text from all searchable fields
  select lower(concat_ws(' ',
    v_first, v_last, v_pref, coalesce(v_chart,''),
    coalesce((
      select string_agg(cp2.value_norm, ' ')
      from public.person_contact_point cp2
      where cp2.person_id = p_person_id and cp2.is_active=true
    ), '')
  )) into v_search;

  -- Upsert into person_search
  insert into public.person_search (
    clinic_id, person_id,
    first_name, last_name, preferred_name, dob,
    chart_no, status, phone_norm, email_norm,
    search_text, is_active
  )
  values (
    v_clinic_id, p_person_id,
    v_first, v_last, v_pref, v_dob,
    v_chart, v_status, v_phone, v_email,
    coalesce(v_search,''), true
  )
  on conflict (clinic_id, person_id) do update set
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
-- 5) Create triggers to keep search table in sync (for ALL persons)
-- ----------------------------------------------------------------------------

-- Person changes trigger (fires for ALL persons, not just patients)
create or replace function public.fn_person_after_change_rebuild_search()
returns trigger language plpgsql
as $$
declare
  v_person_id bigint;
begin
  -- Get person_id from new (insert/update) or old (delete)
  v_person_id := coalesce(new.id, old.id);
  
  -- For delete, just remove from search
  if tg_op = 'DELETE' then
    delete from public.person_search where person_id = v_person_id;
    return old;
  end if;
  
  -- For insert/update, rebuild search row for all persons (not just patients)
  perform public.fn_rebuild_person_search_row(v_person_id);
  return null;
end;
$$;

drop trigger if exists tr_person_rebuild_search on public.person;
create trigger tr_person_rebuild_search
after insert or update or delete on public.person
for each row execute function public.fn_person_after_change_rebuild_search();

-- Patient changes trigger (updates search when patient status changes)
create or replace function public.fn_patient_after_change_rebuild_search()
returns trigger language plpgsql
as $$
begin
  -- Rebuild search row when patient data changes
  perform public.fn_rebuild_person_search_row(coalesce(new.person_id, old.person_id));
  return null;
end;
$$;

drop trigger if exists tr_patient_rebuild_search on public.patient;
create trigger tr_patient_rebuild_search
after insert or update or delete on public.patient
for each row execute function public.fn_patient_after_change_rebuild_search();

-- Contact point changes trigger (fires for ALL persons)
create or replace function public.fn_contact_point_after_change_rebuild_search()
returns trigger language plpgsql
as $$
declare
  v_person_id bigint := coalesce(new.person_id, old.person_id);
begin
  -- Rebuild search row for all persons (not just patients)
  perform public.fn_rebuild_person_search_row(v_person_id);
  return null;
end;
$$;

drop trigger if exists tr_contact_point_rebuild_search on public.person_contact_point;
create trigger tr_contact_point_rebuild_search
after insert or update or delete on public.person_contact_point
for each row execute function public.fn_contact_point_after_change_rebuild_search();

-- ----------------------------------------------------------------------------
-- 6) Update composite type for search results
-- ----------------------------------------------------------------------------

-- Drop old type if it exists
drop type if exists public.patient_search_result cascade;

-- Create new type with person_id instead of patient_person_id
create type public.person_search_result as (
  person_id bigint,
  first_name text,
  last_name text,
  preferred_name text,
  dob date,
  chart_no text,
  status text,
  phone_norm text,
  email_norm text
);

-- ----------------------------------------------------------------------------
-- 7) Update search function to use person_search
-- ----------------------------------------------------------------------------

create or replace function public.fn_search_persons(
  p_query text,
  p_limit int default 25
)
returns setof public.person_search_result
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
      ps.person_id,
      ps.first_name,
      ps.last_name,
      ps.preferred_name,
      ps.dob,
      ps.chart_no,
      ps.status,
      ps.phone_norm,
      ps.email_norm
    from public.person_search ps
    where ps.clinic_id = v_clinic_id
      and ps.phone_norm like digits || '%'
    order by ps.phone_norm
    limit p_limit;
    return;
  end if;

  -- Else, use trigram similarity on search_text
  return query
  select
    ps.person_id,
    ps.first_name,
    ps.last_name,
    ps.preferred_name,
    ps.dob,
    ps.chart_no,
    ps.status,
    ps.phone_norm,
    ps.email_norm
  from public.person_search ps
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

-- Keep old function name as an alias for backward compatibility (if needed)
-- But we'll drop it since we're doing a breaking change
-- drop function if exists public.fn_search_patients(text, int);

-- ----------------------------------------------------------------------------
-- 8) Backfill person_search for ALL persons (not just patients)
-- ----------------------------------------------------------------------------

do $$
declare
  person_rec record;
begin
  for person_rec in 
    select id from public.person where is_active = true
  loop
    perform public.fn_rebuild_person_search_row(person_rec.id);
  end loop;
end;
$$;

-- ----------------------------------------------------------------------------
-- 9) Re-attach audit triggers to person_search
-- ----------------------------------------------------------------------------

drop trigger if exists tr_stamp_audit_columns on public.person_search;
create trigger tr_stamp_audit_columns
before insert or update on public.person_search
for each row execute function audit.fn_stamp_audit_columns();
