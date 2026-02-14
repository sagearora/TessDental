-- Simplify person search: value_norm + phone_last10 + name prefix indexes
-- Also drop legacy person_search / trigram-based search infrastructure

BEGIN;

-- 1) Add value_norm back for person_contact_point (if missing)
ALTER TABLE public.person_contact_point
  ADD COLUMN IF NOT EXISTS value_norm text;

-- 2) New normalization trigger for person_contact_point
CREATE OR REPLACE FUNCTION public.fn_person_contact_point_set_value_norm()
RETURNS trigger
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

-- Remove old no-op normalization trigger if it still exists
DROP TRIGGER IF EXISTS tr_normalize_contact_point ON public.person_contact_point;

-- Attach new trigger
DROP TRIGGER IF EXISTS tr_person_contact_point_set_value_norm ON public.person_contact_point;
CREATE TRIGGER tr_person_contact_point_set_value_norm
BEFORE INSERT OR UPDATE OF kind, value
ON public.person_contact_point
FOR EACH ROW
EXECUTE FUNCTION public.fn_person_contact_point_set_value_norm();

-- 3) Backfill existing rows
UPDATE public.person_contact_point
SET value_norm =
  CASE
    WHEN kind = 'email' THEN lower(trim(coalesce(value, '')))
    WHEN kind = 'phone' THEN regexp_replace(coalesce(value, ''), '\D', '', 'g')
    ELSE NULL
  END
WHERE value_norm IS NULL
   OR value_norm = '';

-- 4) Add phone_last10 for fast phone matching, even with country code
ALTER TABLE public.person_contact_point
  ADD COLUMN IF NOT EXISTS phone_last10 text
  GENERATED ALWAYS AS (
    CASE
      WHEN kind = 'phone'
           AND value_norm IS NOT NULL
           AND length(value_norm) >= 10
      THEN right(value_norm, 10)
      ELSE NULL
    END
  ) STORED;

-- 5) Indexes for fast lookup

CREATE INDEX IF NOT EXISTS pcp_active_email_norm_idx
ON public.person_contact_point (value_norm)
WHERE is_active = true AND kind = 'email';

-- phone exact match on last10 digits
CREATE INDEX IF NOT EXISTS pcp_active_phone_last10_idx
ON public.person_contact_point (phone_last10)
WHERE is_active = true AND kind = 'phone' AND phone_last10 IS NOT NULL;

-- name typeahead indexes (prefix, case-insensitive)
CREATE INDEX IF NOT EXISTS person_active_first_name_prefix_idx
ON public.person (clinic_id, lower(first_name) text_pattern_ops)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS person_active_last_name_prefix_idx
ON public.person (clinic_id, lower(last_name) text_pattern_ops)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS person_active_middle_name_prefix_idx
ON public.person (clinic_id, lower(middle_name) text_pattern_ops)
WHERE is_active = true AND middle_name IS NOT NULL;

CREATE INDEX IF NOT EXISTS person_active_preferred_name_prefix_idx
ON public.person (clinic_id, lower(preferred_name) text_pattern_ops)
WHERE is_active = true AND preferred_name IS NOT NULL;

-- 6) Drop legacy trigram / person_search infrastructure that is no longer used

-- Drop triggers that refresh person_search
DROP TRIGGER IF EXISTS person_search_refresh_on_contact_point ON public.person_contact_point;
DROP TRIGGER IF EXISTS person_search_refresh_on_patient ON public.patient;
DROP TRIGGER IF EXISTS person_search_refresh_on_person ON public.person;

-- Drop trigger functions that call fn_person_search_refresh
DROP FUNCTION IF EXISTS public.trg_person_search_from_contact_point() CASCADE;
DROP FUNCTION IF EXISTS public.trg_person_search_from_patient() CASCADE;
DROP FUNCTION IF EXISTS public.trg_person_search_from_person() CASCADE;

-- Drop helper functions and types related to person_search / trigram search
DROP FUNCTION IF EXISTS public.fn_person_search_refresh(bigint) CASCADE;
DROP FUNCTION IF EXISTS public.fn_person_search_build(bigint) CASCADE;
DROP FUNCTION IF EXISTS public.fn_search_persons(text, integer) CASCADE;
DROP FUNCTION IF EXISTS public.fn_search_people(bigint, text, integer, boolean) CASCADE;

DROP TYPE IF EXISTS public.person_search_result CASCADE;

-- Drop search_people_result table if present
DROP TABLE IF EXISTS public.search_people_result CASCADE;

-- Drop person_search* objects (table, view, indexes)
DROP VIEW IF EXISTS public.person_search_v CASCADE;

-- Drop trigram index before dropping table / extension
DROP INDEX IF EXISTS public.person_search_search_text_trgm_idx;

DROP TABLE IF EXISTS public.person_search CASCADE;

-- Finally, drop pg_trgm extension if nothing else depends on it
DROP EXTENSION IF EXISTS pg_trgm;

COMMIT;

