-- ============================================================================
-- Person Search v1 (pg_trgm + normalization + Hasura function)
-- ============================================================================
-- Implements denormalized search columns on person table with triggers
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Extensions
-- ----------------------------------------------------------------------------

create extension if not exists pg_trgm;
create extension if not exists unaccent;

-- ----------------------------------------------------------------------------
-- 2) Normalization helper functions
-- ----------------------------------------------------------------------------

create or replace function public.fn_norm_text(p text)
returns text
language sql
immutable
as $$
  select trim(regexp_replace(lower(unaccent(coalesce(p,''))), '\s+', ' ', 'g'));
$$;

create or replace function public.fn_norm_phone(p text)
returns text
language sql
immutable
as $$
  -- keep digits only
  select regexp_replace(coalesce(p,''), '[^0-9]', '', 'g');
$$;

-- ----------------------------------------------------------------------------
-- 3) Add search columns to person table
-- ----------------------------------------------------------------------------

alter table public.person
  add column if not exists search_name text not null default '',
  add column if not exists search_email text not null default '',
  add column if not exists search_phone text not null default '',
  add column if not exists search_blob text not null default '';

-- ----------------------------------------------------------------------------
-- 4) Trigger function: update person search from person row
-- ----------------------------------------------------------------------------

create or replace function public.fn_person_search_refresh_from_person()
returns trigger
language plpgsql
as $$
declare
  v_first text;
  v_last text;
  v_pref text;
  v_email text;
  v_phone text;
begin
  -- normalize names
  v_first := public.fn_norm_text(NEW.first_name);
  v_last  := public.fn_norm_text(NEW.last_name);
  v_pref  := public.fn_norm_text(coalesce(NEW.preferred_name, ''));

  -- search_name: "preferred first last" + "first last" + "last first"
  NEW.search_name :=
    trim(concat_ws(' ',
      nullif(v_pref,''),
      nullif(v_first,''),
      nullif(v_last,'')
    ));

  -- search_email and search_phone will be populated by contact point trigger
  -- but we initialize them here
  v_email := '';
  v_phone := '';

  -- Get primary email/phone from contact points if they exist
  -- (This will be updated by the contact point trigger, but we set initial values)
  select public.fn_norm_text(cp.value) into v_email
  from public.person_contact_point cp
  where cp.person_id = NEW.id
    and cp.is_active = true
    and cp.kind = 'email'
  order by cp.is_primary desc, cp.id asc
  limit 1;

  select public.fn_norm_phone(cp.value) into v_phone
  from public.person_contact_point cp
  where cp.person_id = NEW.id
    and cp.is_active = true
    and cp.kind = 'phone'
  order by cp.is_primary desc, cp.id asc
  limit 1;

  NEW.search_email := coalesce(v_email, '');
  NEW.search_phone := coalesce(v_phone, '');

  -- search_blob: combined string for trigram search
  -- includes name in both orders, email, phone, and chart_no if patient
  NEW.search_blob :=
    trim(concat_ws(' | ',
      NEW.search_name,
      -- swapped order helps "last, first"
      trim(concat_ws(' ', nullif(v_last,''), nullif(v_first,''))),
      NEW.search_email,
      NEW.search_phone,
      -- include chart_no if person is a patient
      coalesce((
        select pat.chart_no
        from public.patient pat
        where pat.person_id = NEW.id
          and pat.is_active = true
      ), '')
    ));

  return NEW;
end;
$$;

drop trigger if exists tr_person_search_refresh_from_person on public.person;

create trigger tr_person_search_refresh_from_person
before insert or update of first_name, last_name, preferred_name, middle_name, is_active
on public.person
for each row
execute function public.fn_person_search_refresh_from_person();

-- ----------------------------------------------------------------------------
-- 5) Trigger function: refresh search_phone/search_email when contact points change
-- ----------------------------------------------------------------------------

create or replace function public.fn_person_search_refresh_from_contact_point()
returns trigger
language plpgsql
as $$
declare
  v_person_id bigint;
  v_email text;
  v_phone text;
  v_chart_no text;
begin
  v_person_id := coalesce(NEW.person_id, OLD.person_id);

  -- normalized email from contact points
  select public.fn_norm_text(cp.value) into v_email
  from public.person_contact_point cp
  where cp.person_id = v_person_id
    and cp.is_active = true
    and cp.kind = 'email'
  order by cp.is_primary desc, cp.id asc
  limit 1;

  -- normalized phone digits from contact points
  select public.fn_norm_phone(cp.value) into v_phone
  from public.person_contact_point cp
  where cp.person_id = v_person_id
    and cp.is_active = true
    and cp.kind = 'phone'
  order by cp.is_primary desc, cp.id asc
  limit 1;

  -- get chart_no if patient
  select pat.chart_no into v_chart_no
  from public.patient pat
  where pat.person_id = v_person_id
    and pat.is_active = true;

  -- update person search columns
  update public.person p
  set
    search_email = coalesce(v_email, ''),
    search_phone = coalesce(v_phone, ''),
    search_blob  = trim(concat_ws(' | ',
                    p.search_name,
                    -- "last first" already included via name trigger, but harmless to keep
                    trim(concat_ws(' ', 
                      nullif(public.fn_norm_text(p.last_name),''), 
                      nullif(public.fn_norm_text(p.first_name),'')
                    )),
                    coalesce(v_email, ''),
                    coalesce(v_phone, ''),
                    coalesce(v_chart_no, '')
                  ))
  where p.id = v_person_id;

  return null;
end;
$$;

drop trigger if exists tr_person_search_refresh_from_contact_point on public.person_contact_point;

create trigger tr_person_search_refresh_from_contact_point
after insert or update or delete
on public.person_contact_point
for each row
execute function public.fn_person_search_refresh_from_contact_point();

-- ----------------------------------------------------------------------------
-- 6) Trigger function: refresh search_blob when patient chart_no changes
-- ----------------------------------------------------------------------------

create or replace function public.fn_person_search_refresh_from_patient()
returns trigger
language plpgsql
as $$
declare
  v_person_id bigint;
  v_chart_no text;
begin
  v_person_id := coalesce(NEW.person_id, OLD.person_id);

  -- get chart_no if patient still exists and is active
  select pat.chart_no into v_chart_no
  from public.patient pat
  where pat.person_id = v_person_id
    and pat.is_active = true;

  -- update person search_blob to include/exclude chart_no
  update public.person p
  set
    search_blob = trim(concat_ws(' | ',
      p.search_name,
      trim(concat_ws(' ', 
        nullif(public.fn_norm_text(p.last_name),''), 
        nullif(public.fn_norm_text(p.first_name),'')
      )),
      p.search_email,
      p.search_phone,
      coalesce(v_chart_no, '')
    ))
  where p.id = v_person_id;

  return null;
end;
$$;

drop trigger if exists tr_person_search_refresh_from_patient on public.patient;

create trigger tr_person_search_refresh_from_patient
after insert or update or delete
on public.patient
for each row
execute function public.fn_person_search_refresh_from_patient();

-- ----------------------------------------------------------------------------
-- 7) Indexes for fast search
-- ----------------------------------------------------------------------------

create index if not exists idx_person_search_blob_trgm
on public.person
using gin (search_blob gin_trgm_ops);

create index if not exists idx_person_search_phone
on public.person (search_phone)
where search_phone <> '';

create index if not exists idx_person_search_clinic_active
on public.person (clinic_id, is_active);

-- ----------------------------------------------------------------------------
-- 8) Composite type for search results
-- ----------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'person_search_result'
      and n.nspname = 'public'
  ) then
    create type public.person_search_result as (
      person_id bigint,
      clinic_id bigint,
      display_name text,
      matched_on text,
      rank_score double precision
    );
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- 9) Function: fn_search_people
-- ----------------------------------------------------------------------------

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
  select * from (
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
  limit greatest(1, least(p_limit, 50))
  ) as result;
end;
$$;

-- ----------------------------------------------------------------------------
-- 10) Backfill search columns for existing data
-- ----------------------------------------------------------------------------

-- Trigger person updates to populate search columns
update public.person
set first_name = first_name
where true;

-- Backfill from contact points
do $$
declare
  r record;
  v_email text;
  v_phone text;
begin
  for r in (select distinct person_id from public.person_contact_point) loop
    -- normalized email from contact points
    select public.fn_norm_text(cp.value) into v_email
    from public.person_contact_point cp
    where cp.person_id = r.person_id
      and cp.is_active = true
      and cp.kind = 'email'
    order by cp.is_primary desc, cp.id asc
    limit 1;

    -- normalized phone digits from contact points
    select public.fn_norm_phone(cp.value) into v_phone
    from public.person_contact_point cp
    where cp.person_id = r.person_id
      and cp.is_active = true
      and cp.kind = 'phone'
    order by cp.is_primary desc, cp.id asc
    limit 1;

    -- update person search columns
    update public.person p
    set
      search_email = coalesce(v_email, ''),
      search_phone = coalesce(v_phone, '')
    where p.id = r.person_id;
  end loop;
end $$;

-- Refresh search_blob for all persons (includes chart_no from patients)
update public.person p
set search_blob = trim(concat_ws(' | ',
  p.search_name,
  trim(concat_ws(' ', 
    nullif(public.fn_norm_text(p.last_name),''), 
    nullif(public.fn_norm_text(p.first_name),'')
  )),
  p.search_email,
  p.search_phone,
  coalesce((
    select pat.chart_no
    from public.patient pat
    where pat.person_id = p.id
      and pat.is_active = true
  ), '')
))
where true;
