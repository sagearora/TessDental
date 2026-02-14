-- ============================================================================
-- Fix fn_search_people return type for Hasura tracking
-- ============================================================================
-- Changes from SETOF composite type to RETURNS TABLE for Hasura compatibility
-- ============================================================================

drop function if exists public.fn_search_people(bigint, text, int, boolean);

create or replace function public.fn_search_people(
  p_clinic_id bigint,
  p_query text,
  p_limit int default 15,
  p_include_inactive boolean default false
) returns table (
  person_id bigint,
  clinic_id bigint,
  display_name text,
  matched_on text,
  rank_score double precision
)
language plpgsql
stable
as $$
declare
  q_norm text := public.fn_norm_text(p_query);
  q_phone text := public.fn_norm_phone(p_query);
begin
  if q_norm = '' then
    return;
  end if;

  return query
  with base as (
    select
      p.id as person_id,
      p.clinic_id,
      trim(concat_ws(' ', 
        nullif(p.preferred_name, ''),
        p.first_name, 
        p.last_name
      )) as display_name,
      p.search_blob,
      p.search_phone,
      p.search_email,
      p.is_active
    from public.person p
    where p.clinic_id = p_clinic_id
      and (p_include_inactive or p.is_active = true)
  ),
  scored as (
    select
      b.person_id,
      b.clinic_id,
      b.display_name,
      case
        when q_phone <> '' and length(q_phone) >= 7 and b.search_phone like '%' || q_phone || '%' then 'phone'
        when b.search_email like '%' || q_norm || '%' then 'email'
        when b.search_blob % q_norm then 'name'
        when b.search_blob ilike '%' || q_norm || '%' then 'contains'
        else 'other'
      end as matched_on,
      greatest(
        case when q_phone <> '' and length(q_phone) >= 7 then
          (case when b.search_phone like '%' || q_phone || '%' then 1.2 else 0 end)
        else 0 end,
        similarity(b.search_blob, q_norm)
      ) as rank_score
    from base b
    where
      -- phone path
      (q_phone <> '' and length(q_phone) >= 7 and b.search_phone like '%' || q_phone || '%')
      -- email/name path
      or (b.search_email like '%' || q_norm || '%')
      or (b.search_blob % q_norm)
      or (b.search_blob ilike '%' || q_norm || '%')
  )
  select
    s.person_id,
    s.clinic_id,
    s.display_name,
    s.matched_on,
    s.rank_score
  from scored s
  order by
    s.rank_score desc,
    s.display_name asc
  limit greatest(1, least(p_limit, 50));
end;
$$;
