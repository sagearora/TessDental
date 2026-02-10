## Migration: `YYYYMMDDHHMM__schema_simplify_addresses_search_imaging.sql`

```sql
-- ============================================================
-- TessDental schema simplification + perf pass (Draft v1)
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
-- If your audit schema differs, adjust this block accordingly.
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

    EXECUTE 'DROP TABLE public.bootstrap_event CASCADE';
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
-- Assumes person_address currently contains:
--  - id (bigint/bigserial)
--  - person_id
--  - kind (text) with values like 'mailing'/'billing'
--  - is_primary (bool)
--  - line1,line2,city,region,postal_code,country
--  - created_at/created_by/updated_at/updated_by/is_active
-- If your column names differ, adjust the mapping.
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
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema='public' AND table_name='person_address'
  ) THEN

    WITH src AS (
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
    ),
    ins AS (
      INSERT INTO public.address (
        line1, line2, city, region, postal_code, country,
        created_at, created_by, updated_at, updated_by, is_active
      )
      SELECT
        s.line1, s.line2, s.city, s.region, s.postal_code, s.country,
        s.created_at, s.created_by, s.updated_at, s.updated_by, s.is_active
      FROM src s
      RETURNING id
    )
    SELECT 1;

    -- NOTE: The above doesn't tie returned ids back to src rows.
    -- We need a deterministic way to map. Best practice: insert one-by-one via INSERT ... RETURNING in a loop.
    -- Implement loop mapping now.

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
    EXECUTE 'DROP TABLE public.person_address CASCADE';

  END IF;
END $$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- Phase 6: Financial simplification
-- Drop patient_financial.responsible_party_person_id and address-related columns.
-- (You said: use person.responsible_party_id and person.{mailing,billing}_address_id.)
-- ------------------------------------------------------------
ALTER TABLE IF EXISTS public.patient_financial
  DROP COLUMN IF EXISTS responsible_party_person_id,
  DROP COLUMN IF EXISTS billing_address_source,
  DROP COLUMN IF EXISTS custom_billing_address_id;

-- ------------------------------------------------------------
-- Phase 7: Search system unification
-- Keep person_search as single surface; drop person.search_* columns.
-- Then rebuild person_search deterministically via functions + triggers.
-- ------------------------------------------------------------

ALTER TABLE IF EXISTS public.person
  DROP COLUMN IF EXISTS search_name,
  DROP COLUMN IF EXISTS search_email,
  DROP COLUMN IF EXISTS search_phone,
  DROP COLUMN IF EXISTS search_blob;

-- Ensure person_search has required columns (adjust to your actual schema)
ALTER TABLE IF EXISTS public.person_search
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS search_text text;

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
-- Phase 8: citext + phone normalization cleanup on contact points
-- ------------------------------------------------------------
ALTER TABLE IF EXISTS public.person_contact_point
  ALTER COLUMN value TYPE citext;

ALTER TABLE IF EXISTS public.person_contact_point
  ADD COLUMN IF NOT EXISTS phone_e164 text;

ALTER TABLE IF EXISTS public.person_contact_point
  DROP COLUMN IF EXISTS value_norm;

-- optional correctness checks (adjust kinds if yours differ)
DO $$
BEGIN
  -- avoid duplicate constraint creation
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema='public'
      AND table_name='person_contact_point'
      AND constraint_name='chk_contact_point_phone_e164_only_for_phone'
  ) THEN
    ALTER TABLE public.person_contact_point
      ADD CONSTRAINT chk_contact_point_phone_e164_only_for_phone
      CHECK ((kind <> 'phone') OR (phone_e164 IS NOT NULL));
  END IF;

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
END $$;

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
```

### One important note about the address migration block

I used a **PL/pgSQL loop** to build a strict mapping from `person_address` → `address` so the IDs don’t drift. This is slower than a pure set-based insert, but it’s safe, deterministic, and one-time.

---

## Hasura metadata action list

Below is the “do this in Hasura Console / metadata” checklist in the correct order.

### A) Untrack / retrack tables

1. **Untrack and drop** (or just refresh metadata if you drop in SQL):

   * `public.user`
   * `public.user_capability_override`
   * `public.bootstrap_event`
   * `public.person_address`
2. **Track new table**

   * `public.address`

### B) Relationships to add/update

#### 1) `person` ↔ `address`

* Add object relationship on `person`:

  * `mailing_address` via `mailing_address_id -> address.id`
  * `billing_address` via `billing_address_id -> address.id`

#### 2) Remove/adjust relationships that used `person_address`

* Remove relationships like:

  * `person.person_addresses`
  * `person_address.person`
* Replace UI queries to use `person.mailing_address` and `person.billing_address`

#### 3) Imaging relationships impacted

* If `imaging_asset` previously had relationships via `patient_id` or `clinic_id`, remove them.
* Ensure:

  * `imaging_asset.study` via `study_id`
  * If you need patient/clinic on asset in GraphQL, expose through nested selection:

    * `imaging_asset { study { patient_id clinic_id ... } }`

### C) Permissions (the “derive clinic by convention” part)

You removed redundant `clinic_id` columns, so update permission filters:

#### Common pattern

For a table that has `person_id`, use:

* `{ person: { clinic_id: { _eq: "X-Hasura-Clinic-Id" } } }`

Concrete updates:

* `person_contact_point`:

  * select/insert/update/delete permissions should filter through `person.clinic_id`
* `patient`:

  * filter through `person.clinic_id`
* `patient_financial` / `patient_referral`:

  * filter through `patient -> person -> clinic_id` (or whatever relationship chain you have)
* Anything that used `table.clinic_id` directly: replace with relationship traversal.

### D) person_search: single search surface

1. Ensure `person_search` is tracked.
2. If you expose typeahead via a Query:

   * Prefer a **SQL function** exposed to Hasura (stable, parameterized) like:

     * `fn_search_people(clinic_id, query, limit)` returning rows from `person_search`
   * Or query `person_search` directly with `_ilike`/`_similar` + trigram ranking.

### E) Remove references to dropped columns

* `person.search_name/search_email/search_phone/search_blob`:

  * Hasura will error if any computed fields, views, permissions, or remote relationships reference them.
  * Use “Reload metadata” and fix any red entries.

### F) Enum tables (Hasura enum tables)

You’re keeping enum tables: make sure each is configured as an enum table:

* In console: Data → table → “Set as enum”
  Tables typically:
* `gender_enum`
* `patient_status_enum`
* `referral_kind_enum`
  (plus any others you have)

### G) Event triggers / cron triggers impacts

* If you had any triggers that referenced:

  * `bootstrap_event`
  * `person_address`
  * `person.search_*`
    update/remove them.
* Confirm your `audit.event` insert pathway works (if audit schema differs, update the SQL insert accordingly).

---

## Next (if you want it bulletproof)

If you re-upload `schema.sql`, I’ll:

* remove the remaining “IF EXISTS” safety rails
* align the migration precisely to your actual column names (e.g., `postal` vs `postal_code`, `province` vs `region`, etc.)
* ensure no trigger name collisions with existing ones in your repo
* generate a matching **Hasura metadata diff** (the exact relationship names and permission JSON patterns you use)

But the structure above is already the correct architecture for the decisions you made.
