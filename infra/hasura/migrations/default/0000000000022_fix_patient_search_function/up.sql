-- ============================================================================
-- Fix Patient Search Function for Hasura Tracking
-- ============================================================================
-- Changes function from returns table to returns setof composite type
-- so Hasura can track it reliably
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Create composite type for search results (Hasura-trackable)
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
-- 2) Drop existing function (if it exists) to allow return type change
-- ----------------------------------------------------------------------------

drop function if exists public.fn_search_patients(text, int);

-- ----------------------------------------------------------------------------
-- 3) Recreate function with SETOF composite type return
-- ----------------------------------------------------------------------------

create or replace function public.fn_search_patients(
  p_query text,
  p_limit int default 25
)
returns setof public.patient_search_result
language plpgsql
volatile
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
