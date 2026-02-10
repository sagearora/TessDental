--
-- PostgreSQL database dump
--

\restrict WSXcRZseaLvXcP9LsaaasIjER5dEEbWqDP1fHR88OSK5njjTDtfcF9l2EEpHDYM

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 17.6 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: audit; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA audit;


--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA hdb_catalog;


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: bootstrap_result; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.bootstrap_result AS (
	admin_user_id uuid,
	clinic_id bigint,
	clinic_user_id bigint,
	role_id bigint,
	success boolean
);


--
-- Name: family_member_result; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.family_member_result AS (
	person_id bigint,
	family_root_person_id bigint,
	first_name text,
	last_name text,
	preferred_name text,
	dob date,
	is_patient boolean,
	responsible_party_id bigint,
	household_relationship text
);


--
-- Name: override_effect; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.override_effect AS ENUM (
    'grant',
    'deny'
);


--
-- Name: person_search_result; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.person_search_result AS (
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


--
-- Name: set_household_defaults_result; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.set_household_defaults_result AS (
	household_id bigint
);


--
-- Name: set_responsible_party_result; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.set_responsible_party_result AS (
	success boolean,
	patient_person_id bigint,
	responsible_party_person_id bigint,
	apply_to_household boolean
);


--
-- Name: fn_ctx_bigint(text); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_ctx_bigint(key text) RETURNS bigint
    LANGUAGE sql STABLE
    AS $$
  select (nullif(current_setting(key, true), ''))::bigint;
$$;


--
-- Name: fn_ctx_text(text); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_ctx_text(key text) RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select nullif(current_setting(key, true), '');
$$;


--
-- Name: fn_ctx_uuid(text); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_ctx_uuid(key text) RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select (nullif(current_setting(key, true), ''))::uuid;
$$;


--
-- Name: fn_hasura_clinic_id(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_hasura_clinic_id() RETURNS bigint
    LANGUAGE sql STABLE
    AS $$
  select nullif(audit.fn_hasura_session()->>'x-hasura-clinic-id','')::bigint
$$;


--
-- Name: fn_hasura_role(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_hasura_role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select nullif(audit.fn_hasura_session()->>'x-hasura-role','')
$$;


--
-- Name: fn_hasura_session(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_hasura_session() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select coalesce(current_setting('hasura.user', true), '{}')::jsonb
$$;


--
-- Name: fn_hasura_user_id(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_hasura_user_id() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select nullif(audit.fn_hasura_session()->>'x-hasura-user-id','')::uuid
$$;


--
-- Name: fn_log(text, text, text, jsonb, boolean); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_log(p_action text, p_entity_type text, p_entity_id text, p_payload jsonb, p_success boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
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


--
-- Name: fn_row_change_to_event(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_row_change_to_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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


--
-- Name: fn_stamp_audit_columns(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_stamp_audit_columns() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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


--
-- Name: gen_hasura_uuid(); Type: FUNCTION; Schema: hdb_catalog; Owner: -
--

CREATE FUNCTION hdb_catalog.gen_hasura_uuid() RETURNS uuid
    LANGUAGE sql
    AS $$select gen_random_uuid()$$;


--
-- Name: fn_effective_capabilities(bigint, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_effective_capabilities(p_clinic_id bigint, p_user_id uuid) RETURNS SETOF text
    LANGUAGE sql STABLE
    AS $$
  select v.capability_key
  from public.clinic_user_effective_capabilities_v v
  where v.clinic_id = p_clinic_id
    and v.user_id = p_user_id
  order by v.capability_key;
$$;


--
-- Name: fn_ensure_patient_referral_clinic_match(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_ensure_patient_referral_clinic_match() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  v_patient_clinic_id bigint;
begin
  select clinic_id into v_patient_clinic_id
  from public.patient
  where person_id = NEW.patient_person_id;
  
  if v_patient_clinic_id is null then
    raise exception 'Patient with person_id % does not exist', NEW.patient_person_id;
  end if;
  
  if NEW.clinic_id != v_patient_clinic_id then
    raise exception 'Patient referral clinic_id (%) must match patient clinic_id (%)', NEW.clinic_id, v_patient_clinic_id;
  end if;
  
  return NEW;
end;
$$;


--
-- Name: fn_get_family_members(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_get_family_members(p_person_id bigint) RETURNS SETOF public.family_member_result
    LANGUAGE sql STABLE
    AS $$
  with root as (
    select coalesce(responsible_party_id, id) as family_root_person_id
    from public.person
    where id = p_person_id
  )
  select
    p.id as person_id,
    (select family_root_person_id from root),
    p.first_name,
    p.last_name,
    p.preferred_name,
    p.dob,
    exists(select 1 from public.patient pat where pat.person_id = p.id and pat.is_active = true) as is_patient,
    p.responsible_party_id,
    p.household_relationship
  from public.person p
  where coalesce(p.responsible_party_id, p.id) = (select family_root_person_id from root)
  order by
    case when p.id = (select family_root_person_id from root) then 0 else 1 end,
    p.last_name asc,
    p.first_name asc;
$$;


--
-- Name: fn_get_patient_age_years(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_get_patient_age_years(p_person_id bigint) RETURNS integer
    LANGUAGE plpgsql STABLE
    AS $$
declare
  v_dob date;
  v_age integer;
begin
  select dob into v_dob
  from public.person
  where id = p_person_id;
  
  if v_dob is null then
    return null;
  end if;
  
  v_age := extract(year from age(v_dob))::integer;
  return v_age;
end;
$$;


--
-- Name: fn_has_capability(bigint, uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_has_capability(p_clinic_id bigint, p_user_id uuid, p_capability_key text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  select exists(
    select 1
    from public.clinic_user_effective_capabilities_v v
    where v.clinic_id = p_clinic_id
      and v.user_id = p_user_id
      and v.capability_key = p_capability_key
  );
$$;


--
-- Name: fn_hasura_has_any_capability(text[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_hasura_has_any_capability(p_capability_keys text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  select exists(
    select 1
    from unnest(p_capability_keys) as cap_key
    where public.fn_has_capability(
      audit.fn_hasura_clinic_id(),
      audit.fn_hasura_user_id(),
      cap_key
    ) = true
  );
$$;


--
-- Name: fn_hasura_has_capability(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_hasura_has_capability(p_capability_key text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  select public.fn_has_capability(
    audit.fn_hasura_clinic_id(),
    audit.fn_hasura_user_id(),
    p_capability_key
  );
$$;


--
-- Name: fn_is_bootstrapped(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_is_bootstrapped() RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  select exists(select 1 from public.app_user);
$$;


--
-- Name: fn_norm_phone(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_norm_phone(p text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
  -- keep digits only
  select regexp_replace(coalesce(p,''), '[^0-9]', '', 'g');
$$;


--
-- Name: fn_norm_text(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_norm_text(p text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
  select trim(regexp_replace(lower(unaccent(coalesce(p,''))), '\s+', ' ', 'g'));
$$;


--
-- Name: fn_normalize_contact_point(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_normalize_contact_point() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  -- value_norm column was removed, so this trigger no longer needs to do anything
  -- The trigger is kept for compatibility but does nothing
  -- Phone normalization is now handled via phone_e164 column in the application layer
  return NEW;
end;
$$;


--
-- Name: fn_person_search_build(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_person_search_build(p_person_id bigint) RETURNS TABLE(clinic_id bigint, person_id bigint, display_name text, dob date, chart_no text, status text, search_text text, is_active boolean)
    LANGUAGE sql STABLE
    AS $$
  SELECT
    p.clinic_id,
    p.id AS person_id,
    trim(both ' ' from concat_ws(' ',
      p.first_name,
      NULLIF(p.preferred_name, ''),
      p.last_name
    )) AS display_name,
    p.dob,
    pat.chart_no,
    pat.status,
    trim(both ' ' from concat_ws(' ',
      -- names
      unaccent(lower(concat_ws(' ', p.first_name, p.middle_name, p.last_name, p.preferred_name))),
      -- patient identifiers
      unaccent(lower(coalesce(pat.chart_no, ''))),
      unaccent(lower(coalesce(pat.status::text, ''))),
      -- emails (citext -> text)
      coalesce((
        SELECT string_agg(unaccent(lower(c.value::text)), ' ' ORDER BY c.id)
        FROM public.person_contact_point c
        WHERE c.person_id = p.id
          AND c.is_active = true
          AND c.kind = 'email'
      ), ''),
      -- phones
      coalesce((
        SELECT string_agg(c.phone_e164, ' ' ORDER BY c.id)
        FROM public.person_contact_point c
        WHERE c.person_id = p.id
          AND c.is_active = true
          AND c.kind = 'phone'
          AND c.phone_e164 IS NOT NULL
      ), '')
    )) AS search_text,
    p.is_active
  FROM public.person p
  LEFT JOIN public.patient pat ON pat.person_id = p.id
  WHERE p.id = p_person_id;
$$;


--
-- Name: fn_person_search_refresh(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_person_search_refresh(p_person_id bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO public.person_search (
    clinic_id, person_id, display_name, dob, chart_no, status, search_text, is_active, updated_at
  )
  SELECT
    t.clinic_id, t.person_id, t.display_name, t.dob, t.chart_no, t.status, t.search_text, t.is_active, now()
  FROM public.fn_person_search_build(p_person_id) t
  ON CONFLICT (clinic_id, person_id)
  DO UPDATE SET
    display_name = EXCLUDED.display_name,
    dob          = EXCLUDED.dob,
    chart_no     = EXCLUDED.chart_no,
    status       = EXCLUDED.status,
    search_text  = EXCLUDED.search_text,
    is_active    = EXCLUDED.is_active,
    updated_at   = now();
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: search_household_heads_result; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.search_household_heads_result (
    person_id bigint NOT NULL,
    clinic_id bigint NOT NULL,
    display_name text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    preferred_name text,
    household_head_id bigint,
    rank_score double precision NOT NULL
);


--
-- Name: fn_search_household_heads(bigint, text, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_search_household_heads(p_clinic_id bigint, p_query text, p_limit integer DEFAULT 10) RETURNS SETOF public.search_household_heads_result
    LANGUAGE sql STABLE
    AS $$
  WITH q AS (
    SELECT lower(trim(coalesce(p_query,''))) AS q,
           greatest(1, least(p_limit, 50)) AS lim
  ),
  ranked AS (
    SELECT
      ps.person_id,
      ps.clinic_id,
      ps.display_name,
      similarity(ps.search_text, (SELECT q FROM q)) AS rank_score
    FROM public.person_search ps
    WHERE ps.clinic_id = p_clinic_id
      AND ps.is_active = true
      AND (SELECT q FROM q) <> ''
      AND ps.search_text % (SELECT q FROM q)
    ORDER BY rank_score DESC, ps.display_name ASC
    LIMIT (SELECT lim FROM q)
  )
  SELECT
    r.person_id,
    r.clinic_id,
    r.display_name,
    p.first_name,
    p.last_name,
    p.preferred_name,
    p.household_head_id,
    r.rank_score
  FROM ranked r
  JOIN public.person p ON p.id = r.person_id
  WHERE p.household_head_id IS NULL
  ORDER BY r.rank_score DESC, r.display_name ASC;
$$;


--
-- Name: FUNCTION fn_search_household_heads(p_clinic_id bigint, p_query text, p_limit integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.fn_search_household_heads(p_clinic_id bigint, p_query text, p_limit integer) IS 'Searches for household heads using trigram search on person_search.search_text. Returns people where household_head_id IS NULL.';


--
-- Name: search_people_result; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.search_people_result (
    person_id bigint NOT NULL,
    clinic_id bigint NOT NULL,
    display_name text NOT NULL,
    matched_on text NOT NULL,
    rank_score double precision NOT NULL
);


--
-- Name: fn_search_people(bigint, text, integer, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_search_people(p_clinic_id bigint, p_query text, p_limit integer DEFAULT 15, p_include_inactive boolean DEFAULT false) RETURNS SETOF public.search_people_result
    LANGUAGE sql STABLE
    AS $$
  WITH q AS (
    SELECT
      trim(coalesce(p_query, '')) AS raw_q,
      lower(trim(coalesce(p_query, ''))) AS q,
      regexp_replace(trim(coalesce(p_query, '')), '\D', '', 'g') AS q_phone,
      greatest(1, least(p_limit, 50)) AS lim
  ),
  base AS (
    SELECT
      ps.person_id,
      ps.clinic_id,
      ps.display_name,
      ps.search_text,
      ps.is_active
    FROM public.person_search ps
    WHERE ps.clinic_id = p_clinic_id
      AND (p_include_inactive OR ps.is_active = true)
  ),
  scored AS (
    SELECT
      b.person_id,
      b.clinic_id,
      b.display_name,
      CASE
        WHEN (SELECT q_phone FROM q) <> ''
          AND length((SELECT q_phone FROM q)) >= 7
          AND b.search_text LIKE '%' || (SELECT q_phone FROM q) || '%'
          THEN 'phone'
        WHEN b.search_text ILIKE '%' || (SELECT q FROM q) || '%'
          THEN 'contains'
        WHEN b.search_text % (SELECT q FROM q)
          THEN 'trgm'
        ELSE 'other'
      END AS matched_on,
      CASE
        WHEN (SELECT q_phone FROM q) <> ''
          AND length((SELECT q_phone FROM q)) >= 7
          AND b.search_text LIKE '%' || (SELECT q_phone FROM q) || '%'
          THEN 1.2
        ELSE similarity(b.search_text, (SELECT q FROM q))
      END AS rank_score
    FROM base b
    WHERE (SELECT raw_q FROM q) <> ''
      AND (
        (
          (SELECT q_phone FROM q) <> ''
          AND length((SELECT q_phone FROM q)) >= 7
          AND b.search_text LIKE '%' || (SELECT q_phone FROM q) || '%'
        )
        OR b.search_text ILIKE '%' || (SELECT q FROM q) || '%'
        OR b.search_text % (SELECT q FROM q)
      )
  )
  SELECT
    s.person_id,
    s.clinic_id,
    s.display_name,
    s.matched_on,
    s.rank_score
  FROM scored s
  ORDER BY s.rank_score DESC, s.display_name ASC
  LIMIT (SELECT lim FROM q);
$$;


--
-- Name: fn_search_persons(text, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_search_persons(p_query text, p_limit integer DEFAULT 25) RETURNS SETOF public.person_search_result
    LANGUAGE plpgsql STABLE
    AS $$
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


--
-- Name: fn_validate_household_head(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_validate_household_head() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  v_target_household_head_id bigint;
begin
  -- If household_head_id is being set to a non-null value
  if NEW.household_head_id is not null then
    -- Check if the target person has household_head_id = null
    select household_head_id into v_target_household_head_id
    from public.person
    where id = NEW.household_head_id;
    
    -- If target person doesn't exist, foreign key will catch this
    -- But we also need to check if target has household_head_id = null
    if v_target_household_head_id is not null then
      raise exception 'household_head_id can only point to a person with household_head_id = null (household head). Person % has household_head_id = %', NEW.household_head_id, v_target_household_head_id;
    end if;
    
    -- Prevent self-reference
    if NEW.household_head_id = NEW.id then
      raise exception 'person cannot be their own household head';
    end if;
  end if;
  
  return NEW;
end;
$$;


--
-- Name: FUNCTION fn_validate_household_head(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.fn_validate_household_head() IS 'Validates that household_head_id points to a person with household_head_id = null (a household head)';


--
-- Name: fn_validate_person_responsible_party(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_validate_person_responsible_party() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  v_is_responsible_for_others boolean;
begin
  -- Validate household_relationship based on household_head_id (not responsible_party_id)
  if NEW.household_head_id is null then
    -- If no household head, relationship should be 'self' or null
    if NEW.household_relationship is not null and NEW.household_relationship <> 'self' then
      raise exception 'household_relationship must be "self" or null when household_head_id is null';
    end if;
    -- Normalize to 'self' if null
    if NEW.household_relationship is null then
      NEW.household_relationship := 'self';
    end if;
  else
    -- If household_head_id is set, relationship must be set and not 'self'
    if NEW.household_head_id = NEW.id then
      raise exception 'person cannot be their own household head';
    end if;
    if NEW.household_relationship is null then
      raise exception 'household_relationship is required when household_head_id is set';
    end if;
    if NEW.household_relationship = 'self' then
      raise exception 'household_relationship cannot be "self" when household_head_id is set';
    end if;
    
    -- Household head must be a valid head (household_head_id = null)
    if exists (
      select 1
      from public.person hh
      where hh.id = NEW.household_head_id
        and hh.household_head_id is not null
    ) then
      raise exception 'household_head_id must point to a person with household_head_id = null (a household head)';
    end if;
  end if;

  -- Keep existing responsible_party_id validations (unchanged)
  if NEW.responsible_party_id is null then
    -- Root person for responsible party
    -- (household_relationship validation is now based on household_head_id above)
  else
    if NEW.responsible_party_id = NEW.id then
      raise exception 'responsible_party_id_cannot_reference_self';
    end if;

    -- Responsible party must be a root (must have null responsible_party_id)
    if exists (
      select 1
      from public.person rp
      where rp.id = NEW.responsible_party_id
        and rp.responsible_party_id is not null
    ) then
      raise exception 'responsible_party_must_be_root_with_null_responsible_party_id';
    end if;
  end if;

  -- If NEW is responsible party for others, NEW must be root (responsible_party_id null)
  select exists (
    select 1
    from public.person p
    where p.responsible_party_id = NEW.id
      and p.is_active = true
  ) into v_is_responsible_for_others;

  if v_is_responsible_for_others and NEW.responsible_party_id is not null then
    raise exception 'person_who_is_responsible_party_for_others_must_have_null_responsible_party_id';
  end if;

  return NEW;
end;
$$;


--
-- Name: FUNCTION fn_validate_person_responsible_party(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.fn_validate_person_responsible_party() IS 'Validates person relationships: household_relationship is based on household_head_id, responsible_party_id has separate validation';


--
-- Name: sync_capability_enum_v(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_capability_enum_v() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.is_deprecated = false THEN
      INSERT INTO public.capability_enum_v (key, comment)
      VALUES (NEW.key, NEW.description)
      ON CONFLICT (key) DO UPDATE SET comment = EXCLUDED.comment;
    ELSE
      DELETE FROM public.capability_enum_v WHERE key = NEW.key;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.capability_enum_v WHERE key = OLD.key;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- Name: sync_gender_enum_v(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_gender_enum_v() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.is_active = true THEN
      INSERT INTO public.gender_enum_v (value, comment)
      VALUES (NEW.value, NEW.display_name)
      ON CONFLICT (value) DO UPDATE SET comment = EXCLUDED.comment;
    ELSE
      DELETE FROM public.gender_enum_v WHERE value = NEW.value;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.gender_enum_v WHERE value = OLD.value;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- Name: sync_patient_status_enum_v(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_patient_status_enum_v() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.is_active = true THEN
      INSERT INTO public.patient_status_enum_v (value, comment)
      VALUES (NEW.value, NEW.display_name)
      ON CONFLICT (value) DO UPDATE SET comment = EXCLUDED.comment;
    ELSE
      DELETE FROM public.patient_status_enum_v WHERE value = NEW.value;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.patient_status_enum_v WHERE value = OLD.value;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- Name: sync_referral_kind_enum_v(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_referral_kind_enum_v() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.is_active = true THEN
      INSERT INTO public.referral_kind_enum_v (value, comment)
      VALUES (NEW.value, NEW.display_name)
      ON CONFLICT (value) DO UPDATE SET comment = EXCLUDED.comment;
    ELSE
      DELETE FROM public.referral_kind_enum_v WHERE value = NEW.value;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.referral_kind_enum_v WHERE value = OLD.value;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- Name: trg_person_search_from_contact_point(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trg_person_search_from_contact_point() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_person_id bigint;
BEGIN
  v_person_id := COALESCE(NEW.person_id, OLD.person_id);
  IF v_person_id IS NOT NULL THEN
    PERFORM public.fn_person_search_refresh(v_person_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- Name: trg_person_search_from_patient(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trg_person_search_from_patient() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM public.fn_person_search_refresh(NEW.person_id);
  RETURN NEW;
END;
$$;


--
-- Name: trg_person_search_from_person(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trg_person_search_from_person() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM public.fn_person_search_refresh(NEW.id);
  RETURN NEW;
END;
$$;


--
-- Name: event; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.event (
    id bigint NOT NULL,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL,
    actor_user_id uuid,
    clinic_id bigint,
    request_id text,
    ip text,
    user_agent text,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id text,
    success boolean DEFAULT true NOT NULL,
    payload jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- Name: event_id_seq; Type: SEQUENCE; Schema: audit; Owner: -
--

CREATE SEQUENCE audit.event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_id_seq; Type: SEQUENCE OWNED BY; Schema: audit; Owner: -
--

ALTER SEQUENCE audit.event_id_seq OWNED BY audit.event.id;


--
-- Name: hdb_action_log; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_action_log (
    id uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    action_name text,
    input_payload jsonb NOT NULL,
    request_headers jsonb NOT NULL,
    session_variables jsonb NOT NULL,
    response_payload jsonb,
    errors jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    response_received_at timestamp with time zone,
    status text NOT NULL,
    CONSTRAINT hdb_action_log_status_check CHECK ((status = ANY (ARRAY['created'::text, 'processing'::text, 'completed'::text, 'error'::text])))
);


--
-- Name: hdb_cron_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_cron_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: hdb_cron_events; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_cron_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    trigger_name text NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


--
-- Name: hdb_metadata; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_metadata (
    id integer NOT NULL,
    metadata json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL
);


--
-- Name: hdb_scheduled_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_scheduled_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: hdb_scheduled_events; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_scheduled_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    webhook_conf json NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    retry_conf json,
    payload json,
    header_conf json,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    comment text,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


--
-- Name: hdb_schema_notifications; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_schema_notifications (
    id integer NOT NULL,
    notification json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL,
    instance_id uuid NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT hdb_schema_notifications_id_check CHECK ((id = 1))
);


--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    ee_client_id text,
    ee_client_secret text
);


--
-- Name: address; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.address (
    id bigint NOT NULL,
    line1 text NOT NULL,
    line2 text,
    city text NOT NULL,
    region text NOT NULL,
    postal_code text NOT NULL,
    country text DEFAULT 'Canada'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: address_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.address_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.address_id_seq OWNED BY public.address.id;


--
-- Name: app_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_user (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    first_name text,
    last_name text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    current_clinic_id bigint,
    created_by uuid,
    updated_by uuid
);


--
-- Name: app_user_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.app_user_v AS
 SELECT id,
    email,
    first_name,
    last_name,
    is_active,
    created_at,
    created_by,
    updated_at,
    updated_by,
    current_clinic_id
   FROM public.app_user;


--
-- Name: auth_refresh_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_refresh_token (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    token_hash text NOT NULL,
    revoked_at timestamp with time zone,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: auth_refresh_token_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auth_refresh_token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auth_refresh_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auth_refresh_token_id_seq OWNED BY public.auth_refresh_token.id;


--
-- Name: capability; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.capability (
    value text NOT NULL,
    comment text NOT NULL
);


--
-- Name: capability_enum_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.capability_enum_v (
    key text NOT NULL,
    comment text
);


--
-- Name: clinic; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clinic (
    id bigint NOT NULL,
    name text NOT NULL,
    timezone text DEFAULT 'America/Toronto'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    phone text,
    fax text,
    website text,
    email text,
    address_street text,
    address_unit text,
    address_city text,
    address_province text,
    address_postal text,
    billing_number text
);


--
-- Name: clinic_hours; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clinic_hours (
    id bigint NOT NULL,
    clinic_id bigint NOT NULL,
    day_of_week smallint NOT NULL,
    is_closed boolean DEFAULT false NOT NULL,
    open_time time without time zone,
    close_time time without time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    is_active boolean DEFAULT true NOT NULL,
    appointment_start time without time zone,
    appointment_end time without time zone,
    CONSTRAINT clinic_hours_day_of_week_check CHECK (((day_of_week >= 0) AND (day_of_week <= 6)))
);


--
-- Name: clinic_hours_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clinic_hours_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clinic_hours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clinic_hours_id_seq OWNED BY public.clinic_hours.id;


--
-- Name: clinic_hours_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.clinic_hours_v AS
 SELECT id,
    clinic_id,
    day_of_week,
    is_closed,
    open_time,
    close_time,
    appointment_start,
    appointment_end,
    created_at,
    created_by,
    updated_at,
    updated_by,
    is_active
   FROM public.clinic_hours;


--
-- Name: clinic_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clinic_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clinic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clinic_id_seq OWNED BY public.clinic.id;


--
-- Name: clinic_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clinic_user (
    id bigint NOT NULL,
    clinic_id bigint NOT NULL,
    user_id uuid NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    joined_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    job_title text,
    is_schedulable boolean DEFAULT false NOT NULL,
    provider_kind text,
    default_operatory_id bigint,
    scheduler_color text,
    created_by uuid,
    updated_by uuid,
    CONSTRAINT chk_clinic_user_provider_kind CHECK (((provider_kind IS NULL) OR (provider_kind = ANY (ARRAY['dentist'::text, 'hygienist'::text, 'assistant'::text])))),
    CONSTRAINT chk_clinic_user_schedulable CHECK (((is_schedulable = false) OR ((is_schedulable = true) AND (provider_kind IS NOT NULL))))
);


--
-- Name: clinic_user_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clinic_user_role (
    clinic_user_id bigint NOT NULL,
    role_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role (
    id bigint NOT NULL,
    clinic_id bigint NOT NULL,
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: role_capability; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_capability (
    role_id bigint NOT NULL,
    capability_key text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: clinic_user_effective_capabilities_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.clinic_user_effective_capabilities_v AS
 SELECT cu.clinic_id,
    cu.user_id,
    rc.capability_key
   FROM ((((public.clinic_user cu
     JOIN public.clinic_user_role cur ON ((cur.clinic_user_id = cu.id)))
     JOIN public.role r ON ((r.id = cur.role_id)))
     JOIN public.role_capability rc ON ((rc.role_id = r.id)))
     JOIN public.capability c ON ((c.value = rc.capability_key)))
  WHERE ((cu.is_active = true) AND (r.is_active = true));


--
-- Name: clinic_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clinic_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clinic_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clinic_user_id_seq OWNED BY public.clinic_user.id;


--
-- Name: clinic_user_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.clinic_user_v AS
 SELECT id,
    clinic_id,
    user_id,
    is_active,
    joined_at
   FROM public.clinic_user;


--
-- Name: user_profile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profile (
    user_id uuid NOT NULL,
    user_kind text NOT NULL,
    license_no text,
    scheduler_color text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    CONSTRAINT chk_user_kind CHECK ((user_kind = ANY (ARRAY['staff'::text, 'dentist'::text, 'hygienist'::text, 'assistant'::text, 'manager'::text])))
);


--
-- Name: clinic_user_with_profile_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.clinic_user_with_profile_v AS
 SELECT cu.id AS clinic_user_id,
    cu.clinic_id,
    cu.user_id,
    cu.job_title,
    cu.is_schedulable,
    cu.provider_kind,
    cu.default_operatory_id,
    cu.scheduler_color AS clinic_scheduler_color,
    cu.joined_at,
    cu.is_active AS clinic_membership_active,
    cu.created_at AS clinic_user_created_at,
    cu.created_by AS clinic_user_created_by,
    cu.updated_at AS clinic_user_updated_at,
    cu.updated_by AS clinic_user_updated_by,
    au.email,
    au.first_name,
    au.last_name,
    au.is_active AS user_account_active,
    up.user_kind,
    up.license_no,
    up.scheduler_color AS global_scheduler_color,
    up.is_active AS profile_active
   FROM ((public.clinic_user cu
     JOIN public.app_user_v au ON ((au.id = cu.user_id)))
     LEFT JOIN public.user_profile up ON ((up.user_id = cu.user_id)));


--
-- Name: clinic_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.clinic_v AS
 SELECT id,
    name,
    timezone,
    is_active,
    phone,
    fax,
    website,
    email,
    address_street,
    address_unit,
    address_city,
    address_province,
    address_postal,
    billing_number,
    created_at,
    updated_at
   FROM public.clinic;


--
-- Name: person; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.person (
    id bigint NOT NULL,
    clinic_id bigint NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    preferred_name text,
    dob date,
    gender text,
    preferred_language text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    responsible_party_id bigint,
    household_relationship text,
    household_head_id bigint,
    middle_name text,
    mailing_address_id bigint,
    billing_address_id bigint,
    CONSTRAINT chk_person_household_relationship CHECK (((household_relationship IS NULL) OR (household_relationship = ANY (ARRAY['self'::text, 'child'::text, 'spouse'::text, 'parent'::text, 'guardian'::text, 'other'::text]))))
);


--
-- Name: family_group_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.family_group_v AS
 SELECT id AS person_id,
    clinic_id,
    COALESCE(responsible_party_id, id) AS family_root_person_id
   FROM public.person p;


--
-- Name: patient; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patient (
    person_id bigint NOT NULL,
    chart_no text,
    status text DEFAULT 'active'::text NOT NULL,
    family_doctor_name text,
    family_doctor_phone text,
    imaging_id text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid
);


--
-- Name: family_members_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.family_members_v AS
 SELECT p2.clinic_id,
    p2.id AS person_id,
    fg.family_root_person_id,
    p2.first_name,
    p2.last_name,
    p2.preferred_name,
    p2.dob,
    p2.responsible_party_id,
    p2.household_relationship,
    (EXISTS ( SELECT 1
           FROM public.patient pat
          WHERE ((pat.person_id = p2.id) AND (pat.is_active = true)))) AS is_patient
   FROM (public.person p2
     JOIN public.family_group_v fg ON ((fg.person_id = p2.id)));


--
-- Name: VIEW family_members_v; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.family_members_v IS 'Given a person_id, returns all family members sharing the same root.';


--
-- Name: gender_enum; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gender_enum (
    value text NOT NULL,
    comment text NOT NULL
);


--
-- Name: gender_enum_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gender_enum_v (
    value text NOT NULL,
    comment text
);


--
-- Name: imaging_asset; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.imaging_asset (
    id bigint NOT NULL,
    study_id bigint NOT NULL,
    modality text NOT NULL,
    mime_type text NOT NULL,
    size_bytes bigint NOT NULL,
    sha256 text NOT NULL,
    storage_backend text NOT NULL,
    storage_key text NOT NULL,
    thumb_key text,
    web_key text,
    captured_at timestamp with time zone DEFAULT now() NOT NULL,
    source_device text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: imaging_asset_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.imaging_asset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: imaging_asset_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.imaging_asset_id_seq OWNED BY public.imaging_asset.id;


--
-- Name: imaging_study; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.imaging_study (
    id bigint NOT NULL,
    clinic_id bigint NOT NULL,
    patient_id bigint NOT NULL,
    kind text NOT NULL,
    title text,
    captured_at timestamp with time zone DEFAULT now() NOT NULL,
    source text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: imaging_study_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.imaging_study_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: imaging_study_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.imaging_study_id_seq OWNED BY public.imaging_study.id;


--
-- Name: insurance_subscriber; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.insurance_subscriber (
    id bigint NOT NULL,
    clinic_id bigint NOT NULL,
    subscriber_person_id bigint NOT NULL,
    carrier text,
    policy_no text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid
);


--
-- Name: insurance_subscriber_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.insurance_subscriber_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: insurance_subscriber_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.insurance_subscriber_id_seq OWNED BY public.insurance_subscriber.id;


--
-- Name: operatory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.operatory (
    id bigint NOT NULL,
    clinic_id bigint NOT NULL,
    name text NOT NULL,
    is_bookable boolean DEFAULT true NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    color text DEFAULT '(128,128,128,1)'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid
);


--
-- Name: operatory_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.operatory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: operatory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.operatory_id_seq OWNED BY public.operatory.id;


--
-- Name: operatory_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.operatory_v AS
 SELECT id,
    clinic_id,
    name,
    is_bookable,
    is_active,
    color,
    created_at,
    created_by,
    updated_at,
    updated_by
   FROM public.operatory;


--
-- Name: patient_field_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patient_field_config (
    id bigint NOT NULL,
    clinic_id bigint NOT NULL,
    field_key text NOT NULL,
    field_label text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    is_displayed boolean DEFAULT true NOT NULL,
    is_required boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid
);


--
-- Name: patient_field_config_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.patient_field_config_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: patient_field_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.patient_field_config_id_seq OWNED BY public.patient_field_config.id;


--
-- Name: patient_financial; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patient_financial (
    patient_person_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: person_contact_point; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.person_contact_point (
    id bigint NOT NULL,
    person_id bigint NOT NULL,
    kind text NOT NULL,
    label text,
    value public.citext NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    phone_e164 text,
    CONSTRAINT chk_contact_point_phone_e164_null_for_email CHECK (((kind <> 'email'::text) OR (phone_e164 IS NULL))),
    CONSTRAINT chk_contact_point_phone_e164_required_for_phone CHECK (((kind <> 'phone'::text) OR (phone_e164 IS NOT NULL))),
    CONSTRAINT person_contact_point_kind_check CHECK ((kind = ANY (ARRAY['phone'::text, 'email'::text])))
);


--
-- Name: patient_profile_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.patient_profile_v AS
 SELECT p.id AS person_id,
    p.clinic_id,
    p.first_name,
    p.middle_name,
    p.last_name,
    p.preferred_name,
    p.dob,
    p.gender,
    p.preferred_language,
    p.is_active AS person_is_active,
    pat.person_id AS patient_person_id,
    pat.chart_no,
    pat.status AS patient_status,
    pat.family_doctor_name,
    pat.family_doctor_phone,
    pat.imaging_id,
    pat.is_active AS patient_is_active,
    p.responsible_party_id,
    p.household_relationship,
    p.household_head_id,
    COALESCE(rp.id, p.id) AS effective_responsible_party_person_id,
    COALESCE(rp.first_name, p.first_name) AS responsible_party_first_name,
    COALESCE(rp.last_name, p.last_name) AS responsible_party_last_name,
    p.mailing_address_id,
    p.billing_address_id,
    ma.line1 AS mailing_line1,
    ma.line2 AS mailing_line2,
    ma.city AS mailing_city,
    ma.region AS mailing_region,
    ma.postal_code AS mailing_postal_code,
    ma.country AS mailing_country,
    ba.line1 AS billing_line1,
    ba.line2 AS billing_line2,
    ba.city AS billing_city,
    ba.region AS billing_region,
    ba.postal_code AS billing_postal_code,
    ba.country AS billing_country,
    ( SELECT jsonb_agg(jsonb_build_object('kind', person_contact_point.kind, 'label', person_contact_point.label, 'value', person_contact_point.value, 'phone_e164', person_contact_point.phone_e164, 'is_primary', person_contact_point.is_primary) ORDER BY person_contact_point.is_primary DESC, person_contact_point.kind) AS jsonb_agg
           FROM public.person_contact_point
          WHERE ((person_contact_point.person_id = p.id) AND (person_contact_point.is_active = true))) AS contact_points
   FROM ((((public.patient pat
     JOIN public.person p ON ((p.id = pat.person_id)))
     LEFT JOIN public.person rp ON ((rp.id = p.responsible_party_id)))
     LEFT JOIN public.address ma ON ((ma.id = p.mailing_address_id)))
     LEFT JOIN public.address ba ON ((ba.id = p.billing_address_id)));


--
-- Name: patient_referral; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patient_referral (
    patient_person_id bigint NOT NULL,
    referral_kind text NOT NULL,
    referral_source_id bigint,
    referral_contact_person_id bigint,
    referral_other_text text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    CONSTRAINT chk_referral_contact CHECK (((referral_kind <> 'contact'::text) OR (referral_contact_person_id IS NOT NULL))),
    CONSTRAINT chk_referral_exclusive CHECK ((((referral_kind = 'contact'::text) AND (referral_source_id IS NULL) AND (referral_other_text IS NULL)) OR ((referral_kind = 'source'::text) AND (referral_contact_person_id IS NULL) AND (referral_other_text IS NULL)) OR ((referral_kind = 'other'::text) AND (referral_source_id IS NULL) AND (referral_contact_person_id IS NULL)))),
    CONSTRAINT chk_referral_other CHECK (((referral_kind <> 'other'::text) OR ((referral_other_text IS NOT NULL) AND (referral_other_text <> ''::text)))),
    CONSTRAINT chk_referral_source CHECK (((referral_kind <> 'source'::text) OR (referral_source_id IS NOT NULL)))
);


--
-- Name: patient_status_enum; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patient_status_enum (
    value text NOT NULL,
    comment text NOT NULL
);


--
-- Name: patient_status_enum_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patient_status_enum_v (
    value text NOT NULL,
    comment text
);


--
-- Name: person_contact_point_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.person_contact_point_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: person_contact_point_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.person_contact_point_id_seq OWNED BY public.person_contact_point.id;


--
-- Name: person_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.person_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.person_id_seq OWNED BY public.person.id;


--
-- Name: person_search; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.person_search (
    clinic_id bigint NOT NULL,
    person_id bigint NOT NULL,
    dob date,
    chart_no text,
    status text,
    search_text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    is_active boolean DEFAULT true NOT NULL,
    display_name text
);


--
-- Name: person_search_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.person_search_v AS
 SELECT clinic_id,
    person_id,
    display_name,
    dob,
    chart_no,
    status,
    search_text,
    is_active,
    created_at,
    created_by,
    updated_at,
    updated_by
   FROM public.person_search;


--
-- Name: person_with_responsible_party_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.person_with_responsible_party_v AS
 SELECT p.id,
    p.clinic_id,
    p.first_name,
    p.last_name,
    p.preferred_name,
    p.dob,
    p.gender,
    p.preferred_language,
    p.is_active,
    p.created_at,
    p.created_by,
    p.updated_at,
    p.updated_by,
    p.responsible_party_id,
    p.household_relationship,
    rp.first_name AS responsible_party_first_name,
    rp.last_name AS responsible_party_last_name,
    rp.preferred_name AS responsible_party_preferred_name
   FROM (public.person p
     LEFT JOIN public.person rp ON ((rp.id = p.responsible_party_id)));


--
-- Name: referral_kind_enum; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.referral_kind_enum (
    value text NOT NULL,
    comment text NOT NULL
);


--
-- Name: referral_kind_enum_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.referral_kind_enum_v (
    value text NOT NULL,
    comment text
);


--
-- Name: referral_source; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.referral_source (
    id bigint NOT NULL,
    clinic_id bigint NOT NULL,
    name text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid
);


--
-- Name: referral_source_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.referral_source_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: referral_source_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.referral_source_id_seq OWNED BY public.referral_source.id;


--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- Name: role_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.role_v AS
 SELECT id,
    clinic_id,
    name,
    description,
    is_active
   FROM public.role;


--
-- Name: user_provider_identifier; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_provider_identifier (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    identifier_kind text DEFAULT 'cda_uin'::text NOT NULL,
    province_code text NOT NULL,
    license_type text NOT NULL,
    identifier_value text NOT NULL,
    effective_from date,
    effective_to date,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    CONSTRAINT chk_effective_dates CHECK (((effective_to IS NULL) OR (effective_from IS NULL) OR (effective_to >= effective_from))),
    CONSTRAINT chk_province_code_length CHECK ((char_length(province_code) = 2))
);


--
-- Name: user_provider_identifier_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_provider_identifier_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_provider_identifier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_provider_identifier_id_seq OWNED BY public.user_provider_identifier.id;


--
-- Name: user_provider_identifier_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.user_provider_identifier_v AS
 SELECT id,
    user_id,
    identifier_kind,
    province_code,
    license_type,
    identifier_value,
    effective_from,
    effective_to,
    is_active,
    created_at,
    created_by,
    updated_at,
    updated_by
   FROM public.user_provider_identifier;


--
-- Name: event id; Type: DEFAULT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.event ALTER COLUMN id SET DEFAULT nextval('audit.event_id_seq'::regclass);


--
-- Name: address id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.address ALTER COLUMN id SET DEFAULT nextval('public.address_id_seq'::regclass);


--
-- Name: auth_refresh_token id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_refresh_token ALTER COLUMN id SET DEFAULT nextval('public.auth_refresh_token_id_seq'::regclass);


--
-- Name: clinic id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic ALTER COLUMN id SET DEFAULT nextval('public.clinic_id_seq'::regclass);


--
-- Name: clinic_hours id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_hours ALTER COLUMN id SET DEFAULT nextval('public.clinic_hours_id_seq'::regclass);


--
-- Name: clinic_user id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_user ALTER COLUMN id SET DEFAULT nextval('public.clinic_user_id_seq'::regclass);


--
-- Name: imaging_asset id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imaging_asset ALTER COLUMN id SET DEFAULT nextval('public.imaging_asset_id_seq'::regclass);


--
-- Name: imaging_study id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imaging_study ALTER COLUMN id SET DEFAULT nextval('public.imaging_study_id_seq'::regclass);


--
-- Name: insurance_subscriber id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insurance_subscriber ALTER COLUMN id SET DEFAULT nextval('public.insurance_subscriber_id_seq'::regclass);


--
-- Name: operatory id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operatory ALTER COLUMN id SET DEFAULT nextval('public.operatory_id_seq'::regclass);


--
-- Name: patient_field_config id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_field_config ALTER COLUMN id SET DEFAULT nextval('public.patient_field_config_id_seq'::regclass);


--
-- Name: person id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person ALTER COLUMN id SET DEFAULT nextval('public.person_id_seq'::regclass);


--
-- Name: person_contact_point id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_contact_point ALTER COLUMN id SET DEFAULT nextval('public.person_contact_point_id_seq'::regclass);


--
-- Name: referral_source id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_source ALTER COLUMN id SET DEFAULT nextval('public.referral_source_id_seq'::regclass);


--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Name: user_provider_identifier id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_provider_identifier ALTER COLUMN id SET DEFAULT nextval('public.user_provider_identifier_id_seq'::regclass);


--
-- Name: event event_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);


--
-- Name: hdb_action_log hdb_action_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_action_log
    ADD CONSTRAINT hdb_action_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_events hdb_cron_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_events
    ADD CONSTRAINT hdb_cron_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_resource_version_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_resource_version_key UNIQUE (resource_version);


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_scheduled_events hdb_scheduled_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_events
    ADD CONSTRAINT hdb_scheduled_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_schema_notifications hdb_schema_notifications_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_schema_notifications
    ADD CONSTRAINT hdb_schema_notifications_pkey PRIMARY KEY (id);


--
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


--
-- Name: address address_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (id);


--
-- Name: app_user app_user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_email_key UNIQUE (email);


--
-- Name: app_user app_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (id);


--
-- Name: auth_refresh_token auth_refresh_token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_refresh_token
    ADD CONSTRAINT auth_refresh_token_pkey PRIMARY KEY (id);


--
-- Name: capability_enum_v capability_enum_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.capability_enum_v
    ADD CONSTRAINT capability_enum_v_pkey PRIMARY KEY (key);


--
-- Name: capability capability_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.capability
    ADD CONSTRAINT capability_pkey PRIMARY KEY (value);


--
-- Name: clinic_hours clinic_hours_clinic_id_day_of_week_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_hours
    ADD CONSTRAINT clinic_hours_clinic_id_day_of_week_key UNIQUE (clinic_id, day_of_week);


--
-- Name: clinic_hours clinic_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_hours
    ADD CONSTRAINT clinic_hours_pkey PRIMARY KEY (id);


--
-- Name: clinic clinic_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic
    ADD CONSTRAINT clinic_pkey PRIMARY KEY (id);


--
-- Name: clinic_user clinic_user_clinic_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_user
    ADD CONSTRAINT clinic_user_clinic_id_user_id_key UNIQUE (clinic_id, user_id);


--
-- Name: clinic_user clinic_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_user
    ADD CONSTRAINT clinic_user_pkey PRIMARY KEY (id);


--
-- Name: clinic_user_role clinic_user_role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_user_role
    ADD CONSTRAINT clinic_user_role_pkey PRIMARY KEY (clinic_user_id, role_id);


--
-- Name: gender_enum gender_enum_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gender_enum
    ADD CONSTRAINT gender_enum_pkey PRIMARY KEY (value);


--
-- Name: gender_enum_v gender_enum_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gender_enum_v
    ADD CONSTRAINT gender_enum_v_pkey PRIMARY KEY (value);


--
-- Name: imaging_asset imaging_asset_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imaging_asset
    ADD CONSTRAINT imaging_asset_pkey PRIMARY KEY (id);


--
-- Name: imaging_study imaging_study_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imaging_study
    ADD CONSTRAINT imaging_study_pkey PRIMARY KEY (id);


--
-- Name: insurance_subscriber insurance_subscriber_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insurance_subscriber
    ADD CONSTRAINT insurance_subscriber_pkey PRIMARY KEY (id);


--
-- Name: operatory operatory_clinic_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operatory
    ADD CONSTRAINT operatory_clinic_id_name_key UNIQUE (clinic_id, name);


--
-- Name: operatory operatory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operatory
    ADD CONSTRAINT operatory_pkey PRIMARY KEY (id);


--
-- Name: patient_field_config patient_field_config_clinic_id_field_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_field_config
    ADD CONSTRAINT patient_field_config_clinic_id_field_key_key UNIQUE (clinic_id, field_key);


--
-- Name: patient_field_config patient_field_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_field_config
    ADD CONSTRAINT patient_field_config_pkey PRIMARY KEY (id);


--
-- Name: patient_financial patient_financial_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_financial
    ADD CONSTRAINT patient_financial_pkey PRIMARY KEY (patient_person_id);


--
-- Name: patient patient_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_pkey PRIMARY KEY (person_id);


--
-- Name: patient_referral patient_referral_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_referral
    ADD CONSTRAINT patient_referral_pkey PRIMARY KEY (patient_person_id);


--
-- Name: patient_status_enum patient_status_enum_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_status_enum
    ADD CONSTRAINT patient_status_enum_pkey PRIMARY KEY (value);


--
-- Name: patient_status_enum_v patient_status_enum_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_status_enum_v
    ADD CONSTRAINT patient_status_enum_v_pkey PRIMARY KEY (value);


--
-- Name: person_contact_point person_contact_point_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_contact_point
    ADD CONSTRAINT person_contact_point_pkey PRIMARY KEY (id);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- Name: person_search person_search_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_search
    ADD CONSTRAINT person_search_pkey PRIMARY KEY (clinic_id, person_id);


--
-- Name: referral_kind_enum referral_kind_enum_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_kind_enum
    ADD CONSTRAINT referral_kind_enum_pkey PRIMARY KEY (value);


--
-- Name: referral_kind_enum_v referral_kind_enum_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_kind_enum_v
    ADD CONSTRAINT referral_kind_enum_v_pkey PRIMARY KEY (value);


--
-- Name: referral_source referral_source_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_source
    ADD CONSTRAINT referral_source_pkey PRIMARY KEY (id);


--
-- Name: role_capability role_capability_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_capability
    ADD CONSTRAINT role_capability_pkey PRIMARY KEY (role_id, capability_key);


--
-- Name: role role_clinic_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_clinic_id_name_key UNIQUE (clinic_id, name);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: user_profile user_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_pkey PRIMARY KEY (user_id);


--
-- Name: user_provider_identifier user_provider_identifier_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_provider_identifier
    ADD CONSTRAINT user_provider_identifier_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_event_action; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_event_action ON audit.event USING btree (action, occurred_at DESC);


--
-- Name: idx_audit_event_actor; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_event_actor ON audit.event USING btree (actor_user_id, occurred_at DESC);


--
-- Name: idx_audit_event_clinic; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_event_clinic ON audit.event USING btree (clinic_id, occurred_at DESC);


--
-- Name: idx_audit_event_time; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_event_time ON audit.event USING btree (occurred_at DESC);


--
-- Name: hdb_cron_event_invocation_event_id; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX hdb_cron_event_invocation_event_id ON hdb_catalog.hdb_cron_event_invocation_logs USING btree (event_id);


--
-- Name: hdb_cron_event_status; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX hdb_cron_event_status ON hdb_catalog.hdb_cron_events USING btree (status);


--
-- Name: hdb_cron_events_unique_scheduled; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE UNIQUE INDEX hdb_cron_events_unique_scheduled ON hdb_catalog.hdb_cron_events USING btree (trigger_name, scheduled_time) WHERE (status = 'scheduled'::text);


--
-- Name: hdb_scheduled_event_status; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX hdb_scheduled_event_status ON hdb_catalog.hdb_scheduled_events USING btree (status);


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- Name: idx_app_user_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_app_user_active ON public.app_user USING btree (is_active);


--
-- Name: idx_app_user_current_clinic; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_app_user_current_clinic ON public.app_user USING btree (current_clinic_id);


--
-- Name: idx_auth_refresh_token_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_auth_refresh_token_hash ON public.auth_refresh_token USING btree (token_hash);


--
-- Name: idx_auth_refresh_token_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auth_refresh_token_user ON public.auth_refresh_token USING btree (user_id);


--
-- Name: idx_clinic_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clinic_active ON public.clinic USING btree (is_active);


--
-- Name: idx_clinic_hours_clinic; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clinic_hours_clinic ON public.clinic_hours USING btree (clinic_id);


--
-- Name: idx_clinic_hours_clinic_day; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clinic_hours_clinic_day ON public.clinic_hours USING btree (clinic_id, day_of_week);


--
-- Name: idx_clinic_user_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clinic_user_active ON public.clinic_user USING btree (clinic_id, is_active);


--
-- Name: idx_clinic_user_clinic; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clinic_user_clinic ON public.clinic_user USING btree (clinic_id);


--
-- Name: idx_clinic_user_provider_kind; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clinic_user_provider_kind ON public.clinic_user USING btree (clinic_id, provider_kind) WHERE (provider_kind IS NOT NULL);


--
-- Name: idx_clinic_user_role_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clinic_user_role_role ON public.clinic_user_role USING btree (role_id);


--
-- Name: idx_clinic_user_schedulable; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clinic_user_schedulable ON public.clinic_user USING btree (clinic_id, is_schedulable) WHERE (is_schedulable = true);


--
-- Name: idx_clinic_user_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clinic_user_user ON public.clinic_user USING btree (user_id);


--
-- Name: idx_imaging_asset_storage_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_imaging_asset_storage_unique ON public.imaging_asset USING btree (storage_backend, storage_key) WHERE (is_active = true);


--
-- Name: idx_imaging_study_clinic_patient_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_imaging_study_clinic_patient_time ON public.imaging_study USING btree (clinic_id, patient_id, captured_at DESC);


--
-- Name: idx_operatory_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_operatory_active ON public.operatory USING btree (clinic_id, is_active);


--
-- Name: idx_operatory_bookable; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_operatory_bookable ON public.operatory USING btree (clinic_id, is_bookable) WHERE (is_bookable = true);


--
-- Name: idx_operatory_clinic; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_operatory_clinic ON public.operatory USING btree (clinic_id);


--
-- Name: idx_patient_field_config_clinic_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_patient_field_config_clinic_order ON public.patient_field_config USING btree (clinic_id, display_order) WHERE (is_active = true);


--
-- Name: idx_patient_referral_contact; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_patient_referral_contact ON public.patient_referral USING btree (referral_contact_person_id) WHERE (referral_contact_person_id IS NOT NULL);


--
-- Name: idx_patient_referral_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_patient_referral_source ON public.patient_referral USING btree (referral_source_id) WHERE (referral_source_id IS NOT NULL);


--
-- Name: idx_person_clinic_dob; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_person_clinic_dob ON public.person USING btree (clinic_id, dob);


--
-- Name: idx_person_contact_point_primary_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_person_contact_point_primary_unique ON public.person_contact_point USING btree (person_id, kind) WHERE ((is_primary = true) AND (is_active = true));


--
-- Name: idx_person_household_head; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_person_household_head ON public.person USING btree (household_head_id) WHERE (household_head_id IS NOT NULL);


--
-- Name: idx_person_household_head_reverse; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_person_household_head_reverse ON public.person USING btree (clinic_id, household_head_id, is_active) WHERE (household_head_id IS NOT NULL);


--
-- Name: idx_person_responsible_party; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_person_responsible_party ON public.person USING btree (responsible_party_id) WHERE (responsible_party_id IS NOT NULL);


--
-- Name: idx_person_responsible_party_reverse; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_person_responsible_party_reverse ON public.person USING btree (clinic_id, responsible_party_id, is_active) WHERE (responsible_party_id IS NOT NULL);


--
-- Name: idx_person_search_chart; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_person_search_chart ON public.person_search USING btree (clinic_id, chart_no);


--
-- Name: idx_person_search_clinic_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_person_search_clinic_active ON public.person USING btree (clinic_id, is_active);


--
-- Name: idx_referral_source_clinic_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_referral_source_clinic_active ON public.referral_source USING btree (clinic_id, is_active);


--
-- Name: idx_referral_source_clinic_name_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_referral_source_clinic_name_unique ON public.referral_source USING btree (clinic_id, name) WHERE (is_active = true);


--
-- Name: idx_role_capability_cap; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_capability_cap ON public.role_capability USING btree (capability_key);


--
-- Name: idx_role_clinic_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_clinic_active ON public.role USING btree (clinic_id, is_active);


--
-- Name: idx_user_profile_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_profile_active ON public.user_profile USING btree (is_active);


--
-- Name: idx_user_profile_kind; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_profile_kind ON public.user_profile USING btree (user_kind);


--
-- Name: idx_user_provider_identifier_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_provider_identifier_active ON public.user_provider_identifier USING btree (user_id, is_active) WHERE (is_active = true);


--
-- Name: idx_user_provider_identifier_unique_active; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_user_provider_identifier_unique_active ON public.user_provider_identifier USING btree (user_id, identifier_kind, province_code, license_type) WHERE (is_active = true);


--
-- Name: idx_user_provider_identifier_user_kind; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_provider_identifier_user_kind ON public.user_provider_identifier USING btree (user_id, identifier_kind);


--
-- Name: imaging_asset_active_study_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX imaging_asset_active_study_idx ON public.imaging_asset USING btree (study_id) WHERE (is_active = true);


--
-- Name: imaging_study_active_patient_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX imaging_study_active_patient_idx ON public.imaging_study USING btree (patient_id) WHERE (is_active = true);


--
-- Name: person_active_clinic_last_first_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX person_active_clinic_last_first_idx ON public.person USING btree (clinic_id, last_name, first_name) WHERE (is_active = true);


--
-- Name: person_contact_point_active_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX person_contact_point_active_email_idx ON public.person_contact_point USING btree (value) WHERE ((is_active = true) AND (kind = 'email'::text));


--
-- Name: person_contact_point_active_person_kind_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX person_contact_point_active_person_kind_idx ON public.person_contact_point USING btree (person_id, kind) WHERE (is_active = true);


--
-- Name: person_contact_point_active_phone_e164_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX person_contact_point_active_phone_e164_idx ON public.person_contact_point USING btree (phone_e164) WHERE ((is_active = true) AND (kind = 'phone'::text));


--
-- Name: person_search_search_text_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX person_search_search_text_trgm_idx ON public.person_search USING gin (search_text public.gin_trgm_ops) WHERE (is_active = true);


--
-- Name: person_contact_point person_search_refresh_on_contact_point; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER person_search_refresh_on_contact_point AFTER INSERT OR DELETE OR UPDATE ON public.person_contact_point FOR EACH ROW EXECUTE FUNCTION public.trg_person_search_from_contact_point();


--
-- Name: patient person_search_refresh_on_patient; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER person_search_refresh_on_patient AFTER INSERT OR UPDATE OF chart_no, status ON public.patient FOR EACH ROW EXECUTE FUNCTION public.trg_person_search_from_patient();


--
-- Name: person person_search_refresh_on_person; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER person_search_refresh_on_person AFTER INSERT OR UPDATE OF first_name, middle_name, last_name, preferred_name, dob, is_active ON public.person FOR EACH ROW EXECUTE FUNCTION public.trg_person_search_from_person();


--
-- Name: app_user tr_audit_row_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.app_user FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: clinic_hours tr_audit_row_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.clinic_hours FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: clinic_user tr_audit_row_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.clinic_user FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: insurance_subscriber tr_audit_row_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.insurance_subscriber FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: operatory tr_audit_row_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.operatory FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: patient tr_audit_row_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.patient FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: patient_field_config tr_audit_row_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.patient_field_config FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: patient_financial tr_audit_row_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.patient_financial FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: patient_referral tr_audit_row_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.patient_referral FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: patient_status_enum tr_audit_row_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.patient_status_enum FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: person tr_audit_row_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.person FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: person_contact_point tr_audit_row_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.person_contact_point FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: referral_source tr_audit_row_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.referral_source FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: user_profile tr_audit_row_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.user_profile FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: user_provider_identifier tr_audit_row_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.user_provider_identifier FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: patient_referral tr_ensure_patient_referral_clinic_match; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_ensure_patient_referral_clinic_match BEFORE INSERT OR UPDATE ON public.patient_referral FOR EACH ROW EXECUTE FUNCTION public.fn_ensure_patient_referral_clinic_match();


--
-- Name: person_contact_point tr_normalize_contact_point; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_normalize_contact_point BEFORE INSERT OR UPDATE ON public.person_contact_point FOR EACH ROW EXECUTE FUNCTION public.fn_normalize_contact_point();


--
-- Name: app_user tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.app_user FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: clinic_hours tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.clinic_hours FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: clinic_user tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.clinic_user FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: insurance_subscriber tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.insurance_subscriber FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: operatory tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.operatory FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: patient tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.patient FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: patient_field_config tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.patient_field_config FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: patient_financial tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.patient_financial FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: patient_referral tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.patient_referral FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: patient_status_enum tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.patient_status_enum FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: person tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.person FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: person_contact_point tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.person_contact_point FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: person_search tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.person_search FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: referral_source tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.referral_source FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: user_profile tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.user_profile FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: user_provider_identifier tr_stamp_audit_columns; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.user_provider_identifier FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: gender_enum tr_sync_gender_enum_v; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_sync_gender_enum_v AFTER INSERT OR DELETE OR UPDATE ON public.gender_enum FOR EACH ROW EXECUTE FUNCTION public.sync_gender_enum_v();


--
-- Name: patient_status_enum tr_sync_patient_status_enum_v; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_sync_patient_status_enum_v AFTER INSERT OR DELETE OR UPDATE ON public.patient_status_enum FOR EACH ROW EXECUTE FUNCTION public.sync_patient_status_enum_v();


--
-- Name: referral_kind_enum tr_sync_referral_kind_enum_v; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_sync_referral_kind_enum_v AFTER INSERT OR DELETE OR UPDATE ON public.referral_kind_enum FOR EACH ROW EXECUTE FUNCTION public.sync_referral_kind_enum_v();


--
-- Name: person tr_validate_household_head; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_validate_household_head BEFORE INSERT OR UPDATE ON public.person FOR EACH ROW EXECUTE FUNCTION public.fn_validate_household_head();


--
-- Name: person tr_validate_person_responsible_party; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_validate_person_responsible_party BEFORE INSERT OR UPDATE ON public.person FOR EACH ROW EXECUTE FUNCTION public.fn_validate_person_responsible_party();


--
-- Name: imaging_asset trg_imaging_asset_audit_event; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_imaging_asset_audit_event AFTER INSERT OR DELETE OR UPDATE ON public.imaging_asset FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: imaging_asset trg_imaging_asset_audit_stamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_imaging_asset_audit_stamp BEFORE INSERT OR UPDATE ON public.imaging_asset FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: imaging_study trg_imaging_study_audit_event; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_imaging_study_audit_event AFTER INSERT OR DELETE OR UPDATE ON public.imaging_study FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();


--
-- Name: imaging_study trg_imaging_study_audit_stamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_imaging_study_audit_stamp BEFORE INSERT OR UPDATE ON public.imaging_study FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_cron_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_scheduled_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: app_user app_user_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: app_user app_user_current_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_current_clinic_id_fkey FOREIGN KEY (current_clinic_id) REFERENCES public.clinic(id) ON DELETE SET NULL;


--
-- Name: app_user app_user_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: auth_refresh_token auth_refresh_token_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_refresh_token
    ADD CONSTRAINT auth_refresh_token_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_user(id) ON DELETE CASCADE;


--
-- Name: clinic_hours clinic_hours_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_hours
    ADD CONSTRAINT clinic_hours_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;


--
-- Name: clinic_hours clinic_hours_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_hours
    ADD CONSTRAINT clinic_hours_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: clinic_hours clinic_hours_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_hours
    ADD CONSTRAINT clinic_hours_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: clinic_user clinic_user_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_user
    ADD CONSTRAINT clinic_user_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;


--
-- Name: clinic_user clinic_user_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_user
    ADD CONSTRAINT clinic_user_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: clinic_user clinic_user_default_operatory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_user
    ADD CONSTRAINT clinic_user_default_operatory_id_fkey FOREIGN KEY (default_operatory_id) REFERENCES public.operatory(id) ON DELETE SET NULL;


--
-- Name: clinic_user_role clinic_user_role_clinic_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_user_role
    ADD CONSTRAINT clinic_user_role_clinic_user_id_fkey FOREIGN KEY (clinic_user_id) REFERENCES public.clinic_user(id) ON DELETE CASCADE;


--
-- Name: clinic_user_role clinic_user_role_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_user_role
    ADD CONSTRAINT clinic_user_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id) ON DELETE CASCADE;


--
-- Name: clinic_user clinic_user_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_user
    ADD CONSTRAINT clinic_user_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: clinic_user clinic_user_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinic_user
    ADD CONSTRAINT clinic_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_user(id) ON DELETE CASCADE;


--
-- Name: patient fk_patient_status_v; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient
    ADD CONSTRAINT fk_patient_status_v FOREIGN KEY (status) REFERENCES public.patient_status_enum_v(value);


--
-- Name: person fk_person_gender_v; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT fk_person_gender_v FOREIGN KEY (gender) REFERENCES public.gender_enum_v(value);


--
-- Name: imaging_asset imaging_asset_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imaging_asset
    ADD CONSTRAINT imaging_asset_created_by_id_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: imaging_asset imaging_asset_study_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imaging_asset
    ADD CONSTRAINT imaging_asset_study_id_fkey FOREIGN KEY (study_id) REFERENCES public.imaging_study(id) ON DELETE CASCADE;


--
-- Name: imaging_asset imaging_asset_updated_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imaging_asset
    ADD CONSTRAINT imaging_asset_updated_by_id_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: imaging_study imaging_study_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imaging_study
    ADD CONSTRAINT imaging_study_created_by_id_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: imaging_study imaging_study_updated_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.imaging_study
    ADD CONSTRAINT imaging_study_updated_by_id_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: insurance_subscriber insurance_subscriber_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insurance_subscriber
    ADD CONSTRAINT insurance_subscriber_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;


--
-- Name: insurance_subscriber insurance_subscriber_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insurance_subscriber
    ADD CONSTRAINT insurance_subscriber_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: insurance_subscriber insurance_subscriber_subscriber_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insurance_subscriber
    ADD CONSTRAINT insurance_subscriber_subscriber_person_id_fkey FOREIGN KEY (subscriber_person_id) REFERENCES public.person(id) ON DELETE CASCADE;


--
-- Name: insurance_subscriber insurance_subscriber_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insurance_subscriber
    ADD CONSTRAINT insurance_subscriber_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: operatory operatory_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operatory
    ADD CONSTRAINT operatory_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;


--
-- Name: operatory operatory_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operatory
    ADD CONSTRAINT operatory_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: operatory operatory_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operatory
    ADD CONSTRAINT operatory_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: patient patient_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: patient_field_config patient_field_config_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_field_config
    ADD CONSTRAINT patient_field_config_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;


--
-- Name: patient_field_config patient_field_config_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_field_config
    ADD CONSTRAINT patient_field_config_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: patient_field_config patient_field_config_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_field_config
    ADD CONSTRAINT patient_field_config_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: patient_financial patient_financial_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_financial
    ADD CONSTRAINT patient_financial_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: patient_financial patient_financial_patient_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_financial
    ADD CONSTRAINT patient_financial_patient_person_id_fkey FOREIGN KEY (patient_person_id) REFERENCES public.patient(person_id) ON DELETE CASCADE;


--
-- Name: patient_financial patient_financial_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_financial
    ADD CONSTRAINT patient_financial_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: patient patient_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(id) ON DELETE CASCADE;


--
-- Name: patient_referral patient_referral_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_referral
    ADD CONSTRAINT patient_referral_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: patient_referral patient_referral_patient_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_referral
    ADD CONSTRAINT patient_referral_patient_person_id_fkey FOREIGN KEY (patient_person_id) REFERENCES public.patient(person_id) ON DELETE CASCADE;


--
-- Name: patient_referral patient_referral_referral_contact_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_referral
    ADD CONSTRAINT patient_referral_referral_contact_person_id_fkey FOREIGN KEY (referral_contact_person_id) REFERENCES public.person(id) ON DELETE SET NULL;


--
-- Name: patient_referral patient_referral_referral_kind_v_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_referral
    ADD CONSTRAINT patient_referral_referral_kind_v_fkey FOREIGN KEY (referral_kind) REFERENCES public.referral_kind_enum_v(value);


--
-- Name: patient_referral patient_referral_referral_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_referral
    ADD CONSTRAINT patient_referral_referral_source_id_fkey FOREIGN KEY (referral_source_id) REFERENCES public.referral_source(id) ON DELETE SET NULL;


--
-- Name: patient_referral patient_referral_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient_referral
    ADD CONSTRAINT patient_referral_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: person_search patient_search_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_search
    ADD CONSTRAINT patient_search_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: person_search patient_search_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_search
    ADD CONSTRAINT patient_search_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: patient patient_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: person person_billing_address_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_billing_address_fkey FOREIGN KEY (billing_address_id) REFERENCES public.address(id);


--
-- Name: person person_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;


--
-- Name: person_contact_point person_contact_point_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_contact_point
    ADD CONSTRAINT person_contact_point_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: person_contact_point person_contact_point_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_contact_point
    ADD CONSTRAINT person_contact_point_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(id) ON DELETE CASCADE;


--
-- Name: person_contact_point person_contact_point_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_contact_point
    ADD CONSTRAINT person_contact_point_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: person person_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: person person_household_head_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_household_head_id_fkey FOREIGN KEY (household_head_id) REFERENCES public.person(id) ON DELETE RESTRICT;


--
-- Name: person person_mailing_address_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_mailing_address_fkey FOREIGN KEY (mailing_address_id) REFERENCES public.address(id);


--
-- Name: person person_responsible_party_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_responsible_party_id_fkey FOREIGN KEY (responsible_party_id) REFERENCES public.person(id) ON DELETE RESTRICT;


--
-- Name: person person_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: referral_source referral_source_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_source
    ADD CONSTRAINT referral_source_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;


--
-- Name: referral_source referral_source_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_source
    ADD CONSTRAINT referral_source_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: referral_source referral_source_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_source
    ADD CONSTRAINT referral_source_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: role_capability role_capability_capability_key_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_capability
    ADD CONSTRAINT role_capability_capability_key_fkey FOREIGN KEY (capability_key) REFERENCES public.capability(value) ON DELETE RESTRICT;


--
-- Name: role_capability role_capability_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_capability
    ADD CONSTRAINT role_capability_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id) ON DELETE CASCADE;


--
-- Name: role role_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;


--
-- Name: user_profile user_profile_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: user_profile user_profile_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: user_profile user_profile_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_user(id) ON DELETE CASCADE;


--
-- Name: user_provider_identifier user_provider_identifier_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_provider_identifier
    ADD CONSTRAINT user_provider_identifier_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);


--
-- Name: user_provider_identifier user_provider_identifier_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_provider_identifier
    ADD CONSTRAINT user_provider_identifier_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);


--
-- Name: user_provider_identifier user_provider_identifier_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_provider_identifier
    ADD CONSTRAINT user_provider_identifier_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_user(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict WSXcRZseaLvXcP9LsaaasIjER5dEEbWqDP1fHR88OSK5njjTDtfcF9l2EEpHDYM

