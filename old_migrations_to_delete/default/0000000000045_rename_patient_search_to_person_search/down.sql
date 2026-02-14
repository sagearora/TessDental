-- ============================================================================
-- Rollback: Rename person_search back to patient_search
-- ============================================================================

-- Drop new triggers and functions
drop trigger if exists tr_person_rebuild_search on public.person;
drop trigger if exists tr_patient_rebuild_search on public.patient;
drop trigger if exists tr_contact_point_rebuild_search on public.person_contact_point;
drop function if exists public.fn_person_after_change_rebuild_search();
drop function if exists public.fn_patient_after_change_rebuild_search();
drop function if exists public.fn_contact_point_after_change_rebuild_search();
drop function if exists public.fn_rebuild_person_search_row(bigint);
drop function if exists public.fn_search_persons(text, int);

-- Drop new view
drop view if exists public.person_search_v cascade;

-- Drop new type
drop type if exists public.person_search_result cascade;

-- Rename indexes back
alter index if exists idx_person_search_phone rename to idx_ps_phone;
alter index if exists idx_person_search_chart rename to idx_ps_chart;
alter index if exists idx_person_search_trgm rename to idx_ps_trgm;
alter index if exists idx_person_search_last_first rename to idx_ps_last_first;

-- Rename table and column back
alter table if exists public.person_search rename column person_id to patient_person_id;
alter table if exists public.person_search rename constraint person_search_pkey to patient_search_pkey;
alter table if exists public.person_search rename to patient_search;

-- Recreate old view
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

-- Recreate old functions and triggers (from migration 0021)
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

create trigger tr_person_rebuild_search
after insert or update on public.person
for each row execute function public.fn_person_after_change_rebuild_search();

create or replace function public.fn_patient_after_change_rebuild_search()
returns trigger language plpgsql
as $$
begin
  perform public.fn_rebuild_patient_search_row(new.person_id);
  return null;
end;
$$;

create trigger tr_patient_rebuild_search
after insert or update on public.patient
for each row execute function public.fn_patient_after_change_rebuild_search();

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

create trigger tr_contact_point_rebuild_search
after insert or update or delete on public.person_contact_point
for each row execute function public.fn_contact_point_after_change_rebuild_search();

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
  v_clinic_id_str := nullif(current_setting('hasura.user', true), '')::jsonb->>'x-hasura-clinic-id';
  
  if v_clinic_id_str is null then
    raise exception 'missing_clinic_context';
  end if;
  
  v_clinic_id := v_clinic_id_str::bigint;

  if q = '' then
    return;
  end if;

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

-- Re-attach audit trigger
drop trigger if exists tr_stamp_audit_columns on public.patient_search;
create trigger tr_stamp_audit_columns
before insert or update on public.patient_search
for each row execute function audit.fn_stamp_audit_columns();
