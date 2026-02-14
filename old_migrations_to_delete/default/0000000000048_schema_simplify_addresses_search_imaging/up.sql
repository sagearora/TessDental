-- ============================================================
-- TessDental schema simplification + perf pass
-- Implements:
-- 1) drop public.user + public.user_capability_override
-- 2) bootstrap_event -> audit.event, then drop bootstrap_event
-- 3) remove redundant clinic_id columns that can be derived
-- 4) imaging_asset drop redundant clinic_id/patient_id
-- 5) address table + person.{mailing,billing}_address_id, drop person_address
-- 6) single deterministic search system: keep person_search, drop person.search_*
-- 7) hasura enum tables unchanged (no Postgres ENUM types)
-- 8) citext for email, phone_e164, drop norm fields
-- 9) partial indexes for active rows
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- Phase 0: extensions
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ------------------------------------------------------------
-- Phase 1: drop dead/unused tables
-- ------------------------------------------------------------
DROP TABLE IF EXISTS public."user" CASCADE;
DROP TABLE IF EXISTS public.user_capability_override CASCADE;

-- ------------------------------------------------------------
-- Phase 2: bootstrap_event -> audit.event then drop
-- Assumes audit.event exists with columns:
-- (occurred_at, actor_user_id, clinic_id, action, entity_type, entity_id, success, payload)
-- ------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'bootstrap_event'
  ) THEN
    INSERT INTO audit.event (
      occurred_at,
      actor_user_id,
      clinic_id,
      action,
      entity_type,
      entity_id,
      success,
      payload
    )
    SELECT
      be.created_at AS occurred_at,
      be.admin_user_id AS actor_user_id,
      be.clinic_id AS clinic_id,
      'system.bootstrap' AS action,
      'bootstrap' AS entity_type,
      be.id::text AS entity_id,
      true AS success,
      jsonb_build_object(
        'bootstrap_event_id', be.id,
        'clinic_user_id', be.clinic_user_id,
        'role_id', be.role_id
      ) AS payload
    FROM public.bootstrap_event be;

    DROP TABLE public.bootstrap_event CASCADE;
  END IF;
END $$;

-- ------------------------------------------------------------
-- Phase 3: remove redundant clinic_id columns
-- These should be derivable through relationships for RLS/Hasura perms.
-- ------------------------------------------------------------
ALTER TABLE IF EXISTS public.patient              DROP COLUMN IF EXISTS clinic_id;
ALTER TABLE IF EXISTS public.person_address       DROP COLUMN IF EXISTS clinic_id;
ALTER TABLE IF EXISTS public.person_contact_point DROP COLUMN IF EXISTS clinic_id;
ALTER TABLE IF EXISTS public.patient_financial    DROP COLUMN IF EXISTS clinic_id;
ALTER TABLE IF EXISTS public.patient_referral     DROP COLUMN IF EXISTS clinic_id;

-- ------------------------------------------------------------
-- Phase 4: imaging redundancy removal
-- imaging_asset.study_id -> imaging_study contains clinic/patient/person
-- ------------------------------------------------------------
ALTER TABLE IF EXISTS public.imaging_asset
  DROP COLUMN IF EXISTS clinic_id,
  DROP COLUMN IF EXISTS patient_id;

-- ------------------------------------------------------------
-- Phase 5: Address refactor
-- Create address table, add pointers onto person, migrate, drop person_address
-- ------------------------------------------------------------

-- 5.1 Create address table
CREATE TABLE IF NOT EXISTS public.address (
  id bigserial PRIMARY KEY,
  line1 text NOT NULL,
  line2 text,
  city text NOT NULL,
  region text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'Canada',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  is_active boolean NOT NULL DEFAULT true
);

-- 5.2 Add address pointers on person
ALTER TABLE IF EXISTS public.person
  ADD COLUMN IF NOT EXISTS mailing_address_id bigint,
  ADD COLUMN IF NOT EXISTS billing_address_id bigint;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema='public'
      AND table_name='person'
      AND constraint_name='person_mailing_address_fkey'
  ) THEN
    ALTER TABLE public.person
      ADD CONSTRAINT person_mailing_address_fkey
      FOREIGN KEY (mailing_address_id) REFERENCES public.address(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema='public'
      AND table_name='person'
      AND constraint_name='person_billing_address_fkey'
  ) THEN
    ALTER TABLE public.person
      ADD CONSTRAINT person_billing_address_fkey
      FOREIGN KEY (billing_address_id) REFERENCES public.address(id);
  END IF;
END $$;

-- 5.3 Migration mapping: person_address -> address + link to person
-- Create temp map table to preserve deterministic mapping
CREATE TEMP TABLE tmp_person_address_map (
  person_address_id bigint PRIMARY KEY,
  address_id bigint NOT NULL,
  person_id bigint NOT NULL,
  kind text NOT NULL
) ON COMMIT DROP;

-- Insert primary mailing/billing addresses into address and map
DO $$
DECLARE
  r record;
  new_address_id bigint;
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema='public' AND table_name='person_address'
  ) THEN

    DELETE FROM tmp_person_address_map;

    FOR r IN
      SELECT
        pa.id AS person_address_id,
        pa.person_id,
        pa.kind,
        pa.line1, pa.line2, pa.city, pa.region, pa.postal_code, pa.country,
        pa.created_at, pa.created_by, pa.updated_at, pa.updated_by, pa.is_active
      FROM public.person_address pa
      WHERE pa.is_active = true
        AND pa.is_primary = true
        AND pa.kind IN ('mailing','billing')
      ORDER BY pa.id
    LOOP
      INSERT INTO public.address (
        line1, line2, city, region, postal_code, country,
        created_at, created_by, updated_at, updated_by, is_active
      )
      VALUES (
        r.line1, r.line2, r.city, r.region, r.postal_code, r.country,
        r.created_at, r.created_by, r.updated_at, r.updated_by, r.is_active
      )
      RETURNING id INTO new_address_id;

      INSERT INTO tmp_person_address_map (person_address_id, address_id, person_id, kind)
      VALUES (r.person_address_id, new_address_id, r.person_id, r.kind);
    END LOOP;

    -- Apply pointers onto person
    UPDATE public.person p
    SET mailing_address_id = m.address_id
    FROM tmp_person_address_map m
    WHERE m.person_id = p.id AND m.kind = 'mailing';

    UPDATE public.person p
    SET billing_address_id = m.address_id
    FROM tmp_person_address_map m
    WHERE m.person_id = p.id AND m.kind = 'billing';

    -- Drop old table
    DROP TABLE public.person_address CASCADE;

  END IF;
END $$;

-- ------------------------------------------------------------
-- Phase 6: Financial simplification
-- Drop patient_financial.responsible_party_person_id and address-related columns.
-- (Use person.responsible_party_id and person.{mailing,billing}_address_id.)
-- ------------------------------------------------------------
ALTER TABLE IF EXISTS public.patient_financial
  DROP COLUMN IF EXISTS responsible_party_person_id,
  DROP COLUMN IF EXISTS billing_address_source,
  DROP COLUMN IF EXISTS custom_billing_address_id;

-- ------------------------------------------------------------
-- Phase 7: citext + phone normalization cleanup on contact points
-- (Moved before Phase 8 so phone_e164 exists when functions are created)
-- ------------------------------------------------------------
ALTER TABLE IF EXISTS public.person_contact_point
  ALTER COLUMN value TYPE citext USING value::citext;

-- Add phone_e164 column (nullable initially, will be populated later)
ALTER TABLE IF EXISTS public.person_contact_point
  ADD COLUMN IF NOT EXISTS phone_e164 text;

-- Drop value_norm column
ALTER TABLE IF EXISTS public.person_contact_point
  DROP COLUMN IF EXISTS value_norm;

-- Add correctness checks (adjust kinds if yours differ)
-- Note: phone_e164 can be NULL initially, constraint allows NULL for now
-- You may want to populate phone_e164 from value for existing phone records
DO $$
BEGIN
  -- avoid duplicate constraint creation
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema='public'
      AND table_name='person_contact_point'
      AND constraint_name='chk_contact_point_phone_e164_null_for_email'
  ) THEN
    ALTER TABLE public.person_contact_point
      ADD CONSTRAINT chk_contact_point_phone_e164_null_for_email
      CHECK ((kind <> 'email') OR (phone_e164 IS NULL));
  END IF;
  
  -- Note: We're not adding the NOT NULL constraint for phones yet
  -- as existing data may not have phone_e164 populated.
  -- You should populate phone_e164 for existing phone records before enforcing NOT NULL.
END $$;

-- ------------------------------------------------------------
-- Phase 8: Search system unification
-- Keep person_search as single surface; drop person.search_* columns.
-- Then rebuild person_search deterministically via functions + triggers.
-- ------------------------------------------------------------

ALTER TABLE IF EXISTS public.person
  DROP COLUMN IF EXISTS search_name,
  DROP COLUMN IF EXISTS search_email,
  DROP COLUMN IF EXISTS search_phone,
  DROP COLUMN IF EXISTS search_blob;

-- Drop indexes on columns we're removing from person_search
DROP INDEX IF EXISTS public.idx_person_search_last_first;
DROP INDEX IF EXISTS public.idx_person_search_phone;
-- Note: idx_person_search_chart is kept since chart_no column remains
-- Note: idx_person_search_trgm is kept since search_text column remains

-- Drop view that references columns we're removing
DROP VIEW IF EXISTS public.person_search_v CASCADE;

-- Ensure person_search has required columns (adjust to your actual schema)
ALTER TABLE IF EXISTS public.person_search
  ADD COLUMN IF NOT EXISTS display_name text,
  DROP COLUMN IF EXISTS first_name,
  DROP COLUMN IF EXISTS last_name,
  DROP COLUMN IF EXISTS preferred_name,
  DROP COLUMN IF EXISTS phone_norm,
  DROP COLUMN IF EXISTS email_norm;

-- Recreate person_search_v view to match new structure
CREATE OR REPLACE VIEW public.person_search_v AS
SELECT
  clinic_id,
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

-- Deterministic builder:
-- Assumptions:
--  - public.person has: id, clinic_id, first_name, middle_name, last_name, preferred_name, dob, is_active
--  - public.patient has: person_id, chart_no, status (text or enum-table value)
--  - public.person_contact_point has: person_id, kind ('email'/'phone'), value (citext), phone_e164, is_active, id
CREATE OR REPLACE FUNCTION public.fn_person_search_build(p_person_id bigint)
RETURNS TABLE (
  clinic_id bigint,
  person_id bigint,
  display_name text,
  dob date,
  chart_no text,
  status text,
  search_text text,
  is_active boolean
) AS $$
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
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION public.fn_person_search_refresh(p_person_id bigint)
RETURNS void AS $$
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
$$ LANGUAGE plpgsql;

-- Trigger helpers
CREATE OR REPLACE FUNCTION public.trg_person_search_from_person()
RETURNS trigger AS $$
BEGIN
  PERFORM public.fn_person_search_refresh(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.trg_person_search_from_patient()
RETURNS trigger AS $$
BEGIN
  PERFORM public.fn_person_search_refresh(NEW.person_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.trg_person_search_from_contact_point()
RETURNS trigger AS $$
DECLARE
  v_person_id bigint;
BEGIN
  v_person_id := COALESCE(NEW.person_id, OLD.person_id);
  IF v_person_id IS NOT NULL THEN
    PERFORM public.fn_person_search_refresh(v_person_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Attach triggers (drop old ones if they exist; rename as needed)
DROP TRIGGER IF EXISTS person_search_refresh_on_person ON public.person;
CREATE TRIGGER person_search_refresh_on_person
AFTER INSERT OR UPDATE OF
  first_name, middle_name, last_name, preferred_name, dob, is_active
ON public.person
FOR EACH ROW EXECUTE FUNCTION public.trg_person_search_from_person();

DROP TRIGGER IF EXISTS person_search_refresh_on_patient ON public.patient;
CREATE TRIGGER person_search_refresh_on_patient
AFTER INSERT OR UPDATE OF
  chart_no, status
ON public.patient
FOR EACH ROW EXECUTE FUNCTION public.trg_person_search_from_patient();

DROP TRIGGER IF EXISTS person_search_refresh_on_contact_point ON public.person_contact_point;
CREATE TRIGGER person_search_refresh_on_contact_point
AFTER INSERT OR UPDATE OR DELETE
ON public.person_contact_point
FOR EACH ROW EXECUTE FUNCTION public.trg_person_search_from_contact_point();

-- Index for typeahead
DROP INDEX IF EXISTS public.person_search_search_text_trgm_idx;
CREATE INDEX person_search_search_text_trgm_idx
ON public.person_search
USING gin (search_text gin_trgm_ops)
WHERE is_active = true;

-- ------------------------------------------------------------
-- Phase 9: partial indexes (active rows)
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS person_active_clinic_last_first_idx
ON public.person (clinic_id, last_name, first_name)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS person_contact_point_active_person_kind_idx
ON public.person_contact_point (person_id, kind)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS person_contact_point_active_email_idx
ON public.person_contact_point (value)
WHERE is_active = true AND kind = 'email';

CREATE INDEX IF NOT EXISTS person_contact_point_active_phone_e164_idx
ON public.person_contact_point (phone_e164)
WHERE is_active = true AND kind = 'phone';

CREATE INDEX IF NOT EXISTS imaging_study_active_patient_idx
ON public.imaging_study (patient_id)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS imaging_asset_active_study_idx
ON public.imaging_asset (study_id)
WHERE is_active = true;

-- ------------------------------------------------------------
-- Phase 10: one-time deterministic rebuild of person_search
-- ------------------------------------------------------------
DO $$
DECLARE
  r record;
BEGIN
  -- rebuild for all persons (active + inactive, since table stores is_active)
  FOR r IN SELECT id FROM public.person LOOP
    PERFORM public.fn_person_search_refresh(r.id);
  END LOOP;
END $$;

COMMIT;
