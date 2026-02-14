-- ============================================================================
-- Rollback: Revert function to returns table format
-- ============================================================================

-- Drop function first to allow return type change
drop function if exists public.fn_search_patients(text, int);

-- Recreate function with original returns table signature
create or replace function public.fn_search_patients(
  p_query text,
  p_limit int default 25
)
returns table (
  patient_person_id bigint,
  first_name text,
  last_name text,
  preferred_name text,
  dob date,
  chart_no text,
  status text,
  phone_norm text,
  email_norm text
)
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

-- Note: We don't drop the composite type in down migration
-- as it might be used elsewhere or cause issues if the function is still referenced
