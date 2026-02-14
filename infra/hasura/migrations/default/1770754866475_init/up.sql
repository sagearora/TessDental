CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS audit;
SET check_function_bodies = false;

-- Audit infrastructure (must be created before functions that reference it)
CREATE SEQUENCE audit.event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE audit.event (
    id bigint NOT NULL DEFAULT nextval('audit.event_id_seq'::regclass),
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
    payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT event_pkey PRIMARY KEY (id)
);

ALTER SEQUENCE audit.event_id_seq OWNED BY audit.event.id;

CREATE FUNCTION audit.fn_ctx_text(key text) RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select nullif(current_setting(key, true), '');
$$;

CREATE FUNCTION audit.fn_ctx_uuid(key text) RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select (nullif(current_setting(key, true), ''))::uuid;
$$;

CREATE FUNCTION audit.fn_ctx_bigint(key text) RETURNS bigint
    LANGUAGE sql STABLE
    AS $$
  select (nullif(current_setting(key, true), ''))::bigint;
$$;

CREATE FUNCTION audit.fn_hasura_session() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select coalesce(current_setting('hasura.user', true), '{}')::jsonb
$$;

CREATE FUNCTION audit.fn_hasura_user_id() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select nullif(audit.fn_hasura_session()->>'x-hasura-user-id','')::uuid
$$;

CREATE FUNCTION audit.fn_hasura_clinic_id() RETURNS bigint
    LANGUAGE sql STABLE
    AS $$
  select nullif(audit.fn_hasura_session()->>'x-hasura-clinic-id','')::bigint
$$;

CREATE FUNCTION audit.fn_hasura_role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select nullif(audit.fn_hasura_session()->>'x-hasura-role','')
$$;

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

CREATE TYPE public.bootstrap_result AS (
	admin_user_id uuid,
	clinic_id bigint,
	clinic_user_id bigint,
	role_id bigint,
	success boolean
);
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
CREATE TYPE public.override_effect AS ENUM (
    'grant',
    'deny'
);
CREATE TYPE public.set_household_defaults_result AS (
	household_id bigint
);
CREATE TYPE public.set_responsible_party_result AS (
	success boolean,
	patient_person_id bigint,
	responsible_party_person_id bigint,
	apply_to_household boolean
);
CREATE FUNCTION public.fn_effective_capabilities(p_clinic_id bigint, p_user_id uuid) RETURNS SETOF text
    LANGUAGE sql STABLE
    AS $$
  select v.capability_key
  from public.clinic_user_effective_capabilities_v v
  where v.clinic_id = p_clinic_id
    and v.user_id = p_user_id
  order by v.capability_key;
$$;
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
CREATE FUNCTION public.fn_hasura_has_capability(p_capability_key text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  select public.fn_has_capability(
    audit.fn_hasura_clinic_id(),
    audit.fn_hasura_user_id(),
    p_capability_key
  );
$$;
CREATE FUNCTION public.fn_is_bootstrapped() RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  select exists(select 1 from public.app_user);
$$;
CREATE FUNCTION public.fn_norm_phone(p text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
  -- keep digits only
  select regexp_replace(coalesce(p,''), '[^0-9]', '', 'g');
$$;
CREATE FUNCTION public.fn_norm_text(p text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
  select trim(regexp_replace(lower(unaccent(coalesce(p,''))), '\s+', ' ', 'g'));
$$;
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
CREATE FUNCTION public.fn_person_contact_point_set_value_norm() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  v text;
BEGIN
  v := coalesce(NEW.value, '');
  IF NEW.kind = 'email' THEN
    NEW.value_norm := lower(trim(v));
  ELSIF NEW.kind = 'phone' THEN
    -- accepts (519) 240-2222, 5192402222, +1 519 240 2222
    NEW.value_norm := regexp_replace(v, '\D', '', 'g');
  ELSE
    NEW.value_norm := NULL;
  END IF;
  RETURN NEW;
END;
$$;
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
COMMENT ON FUNCTION public.fn_search_household_heads(p_clinic_id bigint, p_query text, p_limit integer) IS 'Searches for household heads using trigram search on person_search.search_text. Returns people where household_head_id IS NULL.';
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
COMMENT ON FUNCTION public.fn_validate_household_head() IS 'Validates that household_head_id points to a person with household_head_id = null (a household head)';
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
COMMENT ON FUNCTION public.fn_validate_person_responsible_party() IS 'Validates person relationships: household_relationship is based on household_head_id, responsible_party_id has separate validation';
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
CREATE SEQUENCE public.address_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.address_id_seq OWNED BY public.address.id;
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
CREATE TABLE public.auth_refresh_token (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    token_hash text NOT NULL,
    revoked_at timestamp with time zone,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.auth_refresh_token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.auth_refresh_token_id_seq OWNED BY public.auth_refresh_token.id;
CREATE TABLE public.capability (
    value text NOT NULL,
    comment text NOT NULL
);
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
CREATE SEQUENCE public.clinic_hours_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.clinic_hours_id_seq OWNED BY public.clinic_hours.id;
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
CREATE SEQUENCE public.clinic_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.clinic_id_seq OWNED BY public.clinic.id;
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
CREATE TABLE public.clinic_user_role (
    clinic_user_id bigint NOT NULL,
    role_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.role (
    id bigint NOT NULL,
    clinic_id bigint NOT NULL,
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.role_capability (
    role_id bigint NOT NULL,
    capability_key text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
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
CREATE SEQUENCE public.clinic_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.clinic_user_id_seq OWNED BY public.clinic_user.id;
CREATE VIEW public.clinic_user_v AS
 SELECT id,
    clinic_id,
    user_id,
    is_active,
    joined_at
   FROM public.clinic_user;
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
CREATE VIEW public.family_group_v AS
 SELECT id AS person_id,
    clinic_id,
    COALESCE(responsible_party_id, id) AS family_root_person_id
   FROM public.person p;
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
COMMENT ON VIEW public.family_members_v IS 'Given a person_id, returns all family members sharing the same root.';
CREATE TABLE public.gender_enum (
    value text NOT NULL,
    comment text NOT NULL
);
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
CREATE SEQUENCE public.imaging_asset_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.imaging_asset_id_seq OWNED BY public.imaging_asset.id;
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
CREATE SEQUENCE public.imaging_study_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.imaging_study_id_seq OWNED BY public.imaging_study.id;
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
CREATE SEQUENCE public.insurance_subscriber_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.insurance_subscriber_id_seq OWNED BY public.insurance_subscriber.id;
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
CREATE SEQUENCE public.operatory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.operatory_id_seq OWNED BY public.operatory.id;
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
CREATE SEQUENCE public.patient_field_config_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.patient_field_config_id_seq OWNED BY public.patient_field_config.id;
CREATE TABLE public.patient_financial (
    patient_person_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    is_active boolean DEFAULT true NOT NULL
);
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
    value_norm text,
    phone_last10 text GENERATED ALWAYS AS (
CASE
    WHEN ((kind = 'phone'::text) AND (value_norm IS NOT NULL) AND (length(value_norm) >= 10)) THEN "right"(value_norm, 10)
    ELSE NULL::text
END) STORED,
    CONSTRAINT chk_contact_point_phone_e164_null_for_email CHECK (((kind <> 'email'::text) OR (phone_e164 IS NULL))),
    CONSTRAINT chk_contact_point_phone_e164_required_for_phone CHECK (((kind <> 'phone'::text) OR (phone_e164 IS NOT NULL))),
    CONSTRAINT person_contact_point_kind_check CHECK ((kind = ANY (ARRAY['phone'::text, 'email'::text])))
);
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
CREATE TABLE public.patient_status_enum (
    value text NOT NULL,
    comment text NOT NULL
);
CREATE SEQUENCE public.person_contact_point_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.person_contact_point_id_seq OWNED BY public.person_contact_point.id;
CREATE SEQUENCE public.person_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.person_id_seq OWNED BY public.person.id;
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
CREATE TABLE public.referral_kind_enum (
    value text NOT NULL,
    comment text NOT NULL
);
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
CREATE SEQUENCE public.referral_source_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.referral_source_id_seq OWNED BY public.referral_source.id;
CREATE SEQUENCE public.role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;
CREATE VIEW public.role_v AS
 SELECT id,
    clinic_id,
    name,
    description,
    is_active
   FROM public.role;
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
CREATE SEQUENCE public.user_provider_identifier_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.user_provider_identifier_id_seq OWNED BY public.user_provider_identifier.id;
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
ALTER TABLE ONLY public.address ALTER COLUMN id SET DEFAULT nextval('public.address_id_seq'::regclass);
ALTER TABLE ONLY public.auth_refresh_token ALTER COLUMN id SET DEFAULT nextval('public.auth_refresh_token_id_seq'::regclass);
ALTER TABLE ONLY public.clinic ALTER COLUMN id SET DEFAULT nextval('public.clinic_id_seq'::regclass);
ALTER TABLE ONLY public.clinic_hours ALTER COLUMN id SET DEFAULT nextval('public.clinic_hours_id_seq'::regclass);
ALTER TABLE ONLY public.clinic_user ALTER COLUMN id SET DEFAULT nextval('public.clinic_user_id_seq'::regclass);
ALTER TABLE ONLY public.imaging_asset ALTER COLUMN id SET DEFAULT nextval('public.imaging_asset_id_seq'::regclass);
ALTER TABLE ONLY public.imaging_study ALTER COLUMN id SET DEFAULT nextval('public.imaging_study_id_seq'::regclass);
ALTER TABLE ONLY public.insurance_subscriber ALTER COLUMN id SET DEFAULT nextval('public.insurance_subscriber_id_seq'::regclass);
ALTER TABLE ONLY public.operatory ALTER COLUMN id SET DEFAULT nextval('public.operatory_id_seq'::regclass);
ALTER TABLE ONLY public.patient_field_config ALTER COLUMN id SET DEFAULT nextval('public.patient_field_config_id_seq'::regclass);
ALTER TABLE ONLY public.person ALTER COLUMN id SET DEFAULT nextval('public.person_id_seq'::regclass);
ALTER TABLE ONLY public.person_contact_point ALTER COLUMN id SET DEFAULT nextval('public.person_contact_point_id_seq'::regclass);
ALTER TABLE ONLY public.referral_source ALTER COLUMN id SET DEFAULT nextval('public.referral_source_id_seq'::regclass);
ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);
ALTER TABLE ONLY public.user_provider_identifier ALTER COLUMN id SET DEFAULT nextval('public.user_provider_identifier_id_seq'::regclass);
ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_email_key UNIQUE (email);
ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.auth_refresh_token
    ADD CONSTRAINT auth_refresh_token_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.capability
    ADD CONSTRAINT capability_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.clinic_hours
    ADD CONSTRAINT clinic_hours_clinic_id_day_of_week_key UNIQUE (clinic_id, day_of_week);
ALTER TABLE ONLY public.clinic_hours
    ADD CONSTRAINT clinic_hours_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.clinic
    ADD CONSTRAINT clinic_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.clinic_user
    ADD CONSTRAINT clinic_user_clinic_id_user_id_key UNIQUE (clinic_id, user_id);
ALTER TABLE ONLY public.clinic_user
    ADD CONSTRAINT clinic_user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.clinic_user_role
    ADD CONSTRAINT clinic_user_role_pkey PRIMARY KEY (clinic_user_id, role_id);
ALTER TABLE ONLY public.gender_enum
    ADD CONSTRAINT gender_enum_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.imaging_asset
    ADD CONSTRAINT imaging_asset_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.imaging_study
    ADD CONSTRAINT imaging_study_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.insurance_subscriber
    ADD CONSTRAINT insurance_subscriber_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.operatory
    ADD CONSTRAINT operatory_clinic_id_name_key UNIQUE (clinic_id, name);
ALTER TABLE ONLY public.operatory
    ADD CONSTRAINT operatory_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.patient_field_config
    ADD CONSTRAINT patient_field_config_clinic_id_field_key_key UNIQUE (clinic_id, field_key);
ALTER TABLE ONLY public.patient_field_config
    ADD CONSTRAINT patient_field_config_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.patient_financial
    ADD CONSTRAINT patient_financial_pkey PRIMARY KEY (patient_person_id);
ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_pkey PRIMARY KEY (person_id);
ALTER TABLE ONLY public.patient_referral
    ADD CONSTRAINT patient_referral_pkey PRIMARY KEY (patient_person_id);
ALTER TABLE ONLY public.patient_status_enum
    ADD CONSTRAINT patient_status_enum_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.person_contact_point
    ADD CONSTRAINT person_contact_point_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.referral_kind_enum
    ADD CONSTRAINT referral_kind_enum_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.referral_source
    ADD CONSTRAINT referral_source_pkey PRIMARY KEY (id);

-- Seed enum tables with default values (after primary key constraints are added)
INSERT INTO public.capability (value, comment) VALUES
    ('system_admin', 'Full administrative access'),
    ('clinic_manage', 'Manage clinic settings'),
    ('users_manage', 'Manage users, roles, permissions'),
    ('audit_export', 'Export audit logs (CSV/JSONL)'),
    ('patient_manage', 'Manage patients and contacts'),
    ('imaging_read', 'View and access imaging assets'),
    ('imaging_write', 'Upload, create, and delete imaging assets')
ON CONFLICT (value) DO NOTHING;

INSERT INTO public.gender_enum (value, comment) VALUES
    ('male', 'Male'),
    ('female', 'Female'),
    ('other', 'Other')
ON CONFLICT (value) DO NOTHING;

INSERT INTO public.patient_status_enum (value, comment) VALUES
    ('active', 'Active'),
    ('inactive', 'Inactive'),
    ('archived', 'Archived'),
    ('deleted', 'Deleted'),
    ('deceased', 'Deceased')
ON CONFLICT (value) DO NOTHING;

INSERT INTO public.referral_kind_enum (value, comment) VALUES
    ('contact', 'Contact'),
    ('source', 'Source'),
    ('other', 'Other')
ON CONFLICT (value) DO NOTHING;

ALTER TABLE ONLY public.role_capability
    ADD CONSTRAINT role_capability_pkey PRIMARY KEY (role_id, capability_key);
ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_clinic_id_name_key UNIQUE (clinic_id, name);
ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_pkey PRIMARY KEY (user_id);
ALTER TABLE ONLY public.user_provider_identifier
    ADD CONSTRAINT user_provider_identifier_pkey PRIMARY KEY (id);
CREATE INDEX idx_app_user_active ON public.app_user USING btree (is_active);
CREATE INDEX idx_app_user_current_clinic ON public.app_user USING btree (current_clinic_id);
CREATE UNIQUE INDEX idx_auth_refresh_token_hash ON public.auth_refresh_token USING btree (token_hash);
CREATE INDEX idx_auth_refresh_token_user ON public.auth_refresh_token USING btree (user_id);
CREATE INDEX idx_clinic_active ON public.clinic USING btree (is_active);
CREATE INDEX idx_clinic_hours_clinic ON public.clinic_hours USING btree (clinic_id);
CREATE INDEX idx_clinic_hours_clinic_day ON public.clinic_hours USING btree (clinic_id, day_of_week);
CREATE INDEX idx_clinic_user_active ON public.clinic_user USING btree (clinic_id, is_active);
CREATE INDEX idx_clinic_user_clinic ON public.clinic_user USING btree (clinic_id);
CREATE INDEX idx_clinic_user_provider_kind ON public.clinic_user USING btree (clinic_id, provider_kind) WHERE (provider_kind IS NOT NULL);
CREATE INDEX idx_clinic_user_role_role ON public.clinic_user_role USING btree (role_id);
CREATE INDEX idx_clinic_user_schedulable ON public.clinic_user USING btree (clinic_id, is_schedulable) WHERE (is_schedulable = true);
CREATE INDEX idx_clinic_user_user ON public.clinic_user USING btree (user_id);
CREATE UNIQUE INDEX idx_imaging_asset_storage_unique ON public.imaging_asset USING btree (storage_backend, storage_key) WHERE (is_active = true);
CREATE INDEX idx_imaging_study_clinic_patient_time ON public.imaging_study USING btree (clinic_id, patient_id, captured_at DESC);
CREATE INDEX idx_operatory_active ON public.operatory USING btree (clinic_id, is_active);
CREATE INDEX idx_operatory_bookable ON public.operatory USING btree (clinic_id, is_bookable) WHERE (is_bookable = true);
CREATE INDEX idx_operatory_clinic ON public.operatory USING btree (clinic_id);
CREATE INDEX idx_patient_field_config_clinic_order ON public.patient_field_config USING btree (clinic_id, display_order) WHERE (is_active = true);
CREATE INDEX idx_patient_referral_contact ON public.patient_referral USING btree (referral_contact_person_id) WHERE (referral_contact_person_id IS NOT NULL);
CREATE INDEX idx_patient_referral_source ON public.patient_referral USING btree (referral_source_id) WHERE (referral_source_id IS NOT NULL);
CREATE INDEX idx_person_clinic_dob ON public.person USING btree (clinic_id, dob);
CREATE UNIQUE INDEX idx_person_contact_point_primary_unique ON public.person_contact_point USING btree (person_id, kind) WHERE ((is_primary = true) AND (is_active = true));
CREATE INDEX idx_person_household_head ON public.person USING btree (household_head_id) WHERE (household_head_id IS NOT NULL);
CREATE INDEX idx_person_household_head_reverse ON public.person USING btree (clinic_id, household_head_id, is_active) WHERE (household_head_id IS NOT NULL);
CREATE INDEX idx_person_responsible_party ON public.person USING btree (responsible_party_id) WHERE (responsible_party_id IS NOT NULL);
CREATE INDEX idx_person_responsible_party_reverse ON public.person USING btree (clinic_id, responsible_party_id, is_active) WHERE (responsible_party_id IS NOT NULL);
CREATE INDEX idx_person_search_clinic_active ON public.person USING btree (clinic_id, is_active);
CREATE INDEX idx_referral_source_clinic_active ON public.referral_source USING btree (clinic_id, is_active);
CREATE UNIQUE INDEX idx_referral_source_clinic_name_unique ON public.referral_source USING btree (clinic_id, name) WHERE (is_active = true);
CREATE INDEX idx_role_capability_cap ON public.role_capability USING btree (capability_key);
CREATE INDEX idx_role_clinic_active ON public.role USING btree (clinic_id, is_active);
CREATE INDEX idx_user_profile_active ON public.user_profile USING btree (is_active);
CREATE INDEX idx_user_profile_kind ON public.user_profile USING btree (user_kind);
CREATE INDEX idx_user_provider_identifier_active ON public.user_provider_identifier USING btree (user_id, is_active) WHERE (is_active = true);
CREATE UNIQUE INDEX idx_user_provider_identifier_unique_active ON public.user_provider_identifier USING btree (user_id, identifier_kind, province_code, license_type) WHERE (is_active = true);
CREATE INDEX idx_user_provider_identifier_user_kind ON public.user_provider_identifier USING btree (user_id, identifier_kind);
CREATE INDEX imaging_asset_active_study_idx ON public.imaging_asset USING btree (study_id) WHERE (is_active = true);
CREATE INDEX imaging_study_active_patient_idx ON public.imaging_study USING btree (patient_id) WHERE (is_active = true);
CREATE INDEX pcp_active_email_norm_idx ON public.person_contact_point USING btree (value_norm) WHERE ((is_active = true) AND (kind = 'email'::text));
CREATE INDEX pcp_active_phone_last10_idx ON public.person_contact_point USING btree (phone_last10) WHERE ((is_active = true) AND (kind = 'phone'::text) AND (phone_last10 IS NOT NULL));
CREATE INDEX person_active_clinic_last_first_idx ON public.person USING btree (clinic_id, last_name, first_name) WHERE (is_active = true);
CREATE INDEX person_active_first_name_prefix_idx ON public.person USING btree (clinic_id, lower(first_name) text_pattern_ops) WHERE (is_active = true);
CREATE INDEX person_active_last_name_prefix_idx ON public.person USING btree (clinic_id, lower(last_name) text_pattern_ops) WHERE (is_active = true);
CREATE INDEX person_active_middle_name_prefix_idx ON public.person USING btree (clinic_id, lower(middle_name) text_pattern_ops) WHERE ((is_active = true) AND (middle_name IS NOT NULL));
CREATE INDEX person_active_preferred_name_prefix_idx ON public.person USING btree (clinic_id, lower(preferred_name) text_pattern_ops) WHERE ((is_active = true) AND (preferred_name IS NOT NULL));
CREATE INDEX person_contact_point_active_email_idx ON public.person_contact_point USING btree (value) WHERE ((is_active = true) AND (kind = 'email'::text));
CREATE INDEX person_contact_point_active_person_kind_idx ON public.person_contact_point USING btree (person_id, kind) WHERE (is_active = true);
CREATE INDEX person_contact_point_active_phone_e164_idx ON public.person_contact_point USING btree (phone_e164) WHERE ((is_active = true) AND (kind = 'phone'::text));
CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.app_user FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.clinic_hours FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.clinic_user FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.insurance_subscriber FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.operatory FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.patient FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.patient_field_config FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.patient_financial FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.patient_referral FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.patient_status_enum FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.person FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.person_contact_point FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.referral_source FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.user_profile FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER tr_audit_row_change AFTER INSERT OR DELETE OR UPDATE ON public.user_provider_identifier FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER tr_ensure_patient_referral_clinic_match BEFORE INSERT OR UPDATE ON public.patient_referral FOR EACH ROW EXECUTE FUNCTION public.fn_ensure_patient_referral_clinic_match();
CREATE TRIGGER tr_person_contact_point_set_value_norm BEFORE INSERT OR UPDATE OF kind, value ON public.person_contact_point FOR EACH ROW EXECUTE FUNCTION public.fn_person_contact_point_set_value_norm();
CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.app_user FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.clinic_hours FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.clinic_user FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.insurance_subscriber FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.operatory FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.patient FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.patient_field_config FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.patient_financial FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.patient_referral FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.patient_status_enum FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.person FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.person_contact_point FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.referral_source FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.user_profile FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER tr_stamp_audit_columns BEFORE INSERT OR UPDATE ON public.user_provider_identifier FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER tr_validate_household_head BEFORE INSERT OR UPDATE ON public.person FOR EACH ROW EXECUTE FUNCTION public.fn_validate_household_head();
CREATE TRIGGER tr_validate_person_responsible_party BEFORE INSERT OR UPDATE ON public.person FOR EACH ROW EXECUTE FUNCTION public.fn_validate_person_responsible_party();
CREATE TRIGGER trg_imaging_asset_audit_event AFTER INSERT OR DELETE OR UPDATE ON public.imaging_asset FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER trg_imaging_asset_audit_stamp BEFORE INSERT OR UPDATE ON public.imaging_asset FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
CREATE TRIGGER trg_imaging_study_audit_event AFTER INSERT OR DELETE OR UPDATE ON public.imaging_study FOR EACH ROW EXECUTE FUNCTION audit.fn_row_change_to_event();
CREATE TRIGGER trg_imaging_study_audit_stamp BEFORE INSERT OR UPDATE ON public.imaging_study FOR EACH ROW EXECUTE FUNCTION audit.fn_stamp_audit_columns();
ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_current_clinic_id_fkey FOREIGN KEY (current_clinic_id) REFERENCES public.clinic(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.auth_refresh_token
    ADD CONSTRAINT auth_refresh_token_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_user(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.clinic_hours
    ADD CONSTRAINT clinic_hours_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.clinic_hours
    ADD CONSTRAINT clinic_hours_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.clinic_hours
    ADD CONSTRAINT clinic_hours_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.clinic_user
    ADD CONSTRAINT clinic_user_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.clinic_user
    ADD CONSTRAINT clinic_user_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.clinic_user
    ADD CONSTRAINT clinic_user_default_operatory_id_fkey FOREIGN KEY (default_operatory_id) REFERENCES public.operatory(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.clinic_user_role
    ADD CONSTRAINT clinic_user_role_clinic_user_id_fkey FOREIGN KEY (clinic_user_id) REFERENCES public.clinic_user(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.clinic_user_role
    ADD CONSTRAINT clinic_user_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.clinic_user
    ADD CONSTRAINT clinic_user_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.clinic_user
    ADD CONSTRAINT clinic_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_user(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.patient
    ADD CONSTRAINT fk_patient_status FOREIGN KEY (status) REFERENCES public.patient_status_enum(value);
ALTER TABLE ONLY public.person
    ADD CONSTRAINT fk_person_gender FOREIGN KEY (gender) REFERENCES public.gender_enum(value);
ALTER TABLE ONLY public.imaging_asset
    ADD CONSTRAINT imaging_asset_created_by_id_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.imaging_asset
    ADD CONSTRAINT imaging_asset_study_id_fkey FOREIGN KEY (study_id) REFERENCES public.imaging_study(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.imaging_asset
    ADD CONSTRAINT imaging_asset_updated_by_id_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.imaging_study
    ADD CONSTRAINT imaging_study_created_by_id_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.imaging_study
    ADD CONSTRAINT imaging_study_updated_by_id_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.insurance_subscriber
    ADD CONSTRAINT insurance_subscriber_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.insurance_subscriber
    ADD CONSTRAINT insurance_subscriber_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.insurance_subscriber
    ADD CONSTRAINT insurance_subscriber_subscriber_person_id_fkey FOREIGN KEY (subscriber_person_id) REFERENCES public.person(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.insurance_subscriber
    ADD CONSTRAINT insurance_subscriber_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.operatory
    ADD CONSTRAINT operatory_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.operatory
    ADD CONSTRAINT operatory_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.operatory
    ADD CONSTRAINT operatory_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.patient_field_config
    ADD CONSTRAINT patient_field_config_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.patient_field_config
    ADD CONSTRAINT patient_field_config_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.patient_field_config
    ADD CONSTRAINT patient_field_config_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.patient_financial
    ADD CONSTRAINT patient_financial_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.patient_financial
    ADD CONSTRAINT patient_financial_patient_person_id_fkey FOREIGN KEY (patient_person_id) REFERENCES public.patient(person_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.patient_financial
    ADD CONSTRAINT patient_financial_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.patient_referral
    ADD CONSTRAINT patient_referral_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.patient_referral
    ADD CONSTRAINT patient_referral_patient_person_id_fkey FOREIGN KEY (patient_person_id) REFERENCES public.patient(person_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.patient_referral
    ADD CONSTRAINT patient_referral_referral_contact_person_id_fkey FOREIGN KEY (referral_contact_person_id) REFERENCES public.person(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.patient_referral
    ADD CONSTRAINT patient_referral_referral_kind_fkey FOREIGN KEY (referral_kind) REFERENCES public.referral_kind_enum(value);
ALTER TABLE ONLY public.patient_referral
    ADD CONSTRAINT patient_referral_referral_source_id_fkey FOREIGN KEY (referral_source_id) REFERENCES public.referral_source(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.patient_referral
    ADD CONSTRAINT patient_referral_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_billing_address_fkey FOREIGN KEY (billing_address_id) REFERENCES public.address(id);
ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.person_contact_point
    ADD CONSTRAINT person_contact_point_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.person_contact_point
    ADD CONSTRAINT person_contact_point_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.person_contact_point
    ADD CONSTRAINT person_contact_point_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_household_head_id_fkey FOREIGN KEY (household_head_id) REFERENCES public.person(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_mailing_address_fkey FOREIGN KEY (mailing_address_id) REFERENCES public.address(id);
ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_responsible_party_id_fkey FOREIGN KEY (responsible_party_id) REFERENCES public.person(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.referral_source
    ADD CONSTRAINT referral_source_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.referral_source
    ADD CONSTRAINT referral_source_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.referral_source
    ADD CONSTRAINT referral_source_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.role_capability
    ADD CONSTRAINT role_capability_capability_key_fkey FOREIGN KEY (capability_key) REFERENCES public.capability(value) ON DELETE RESTRICT;
ALTER TABLE ONLY public.role_capability
    ADD CONSTRAINT role_capability_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinic(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_user(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_provider_identifier
    ADD CONSTRAINT user_provider_identifier_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.user_provider_identifier
    ADD CONSTRAINT user_provider_identifier_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.app_user(id);
ALTER TABLE ONLY public.user_provider_identifier
    ADD CONSTRAINT user_provider_identifier_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_user(id) ON DELETE CASCADE;
