-- =========================================================
-- Fix fn_search_people for Hasura tracking
-- Hasura requires functions to return SETOF <table-name>
-- where the table is tracked, not RETURNS TABLE(...)
-- =========================================================

BEGIN;

-- =========================================================
-- 1) Create the return table (empty "shape" table)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.search_people_result (
  person_id bigint NOT NULL,
  clinic_id bigint NOT NULL,
  display_name text NOT NULL,
  matched_on text NOT NULL,
  rank_score double precision NOT NULL
);

-- Optional: prevent accidental inserts
REVOKE INSERT, UPDATE, DELETE ON public.search_people_result FROM PUBLIC;

-- =========================================================
-- 2) Drop old function (can't change return type with CREATE OR REPLACE)
-- =========================================================
DROP FUNCTION IF EXISTS public.fn_search_people(bigint, text, integer, boolean);

-- =========================================================
-- 3) Create new function to return SETOF public.search_people_result
-- =========================================================
CREATE FUNCTION public.fn_search_people(
  p_clinic_id bigint,
  p_query text,
  p_limit integer DEFAULT 15,
  p_include_inactive boolean DEFAULT false
)
RETURNS SETOF public.search_people_result
LANGUAGE sql
STABLE
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

COMMIT;
