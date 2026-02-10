-- =========================================================
-- Add fn_search_household_heads function for Hasura tracking
-- Uses person_search table for trigram search, filters for household heads
-- =========================================================

BEGIN;

-- =========================================================
-- 1) Create the return table (empty "shape" table)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.search_household_heads_result (
  person_id bigint NOT NULL,
  clinic_id bigint NOT NULL,
  display_name text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  preferred_name text,
  household_head_id bigint,
  rank_score double precision NOT NULL
);

-- Optional: prevent accidental inserts
REVOKE INSERT, UPDATE, DELETE ON public.search_household_heads_result FROM PUBLIC;

-- =========================================================
-- 2) Create function to return SETOF public.search_household_heads_result
-- =========================================================
CREATE OR REPLACE FUNCTION public.fn_search_household_heads(
  p_clinic_id bigint,
  p_query text,
  p_limit integer DEFAULT 10
)
RETURNS SETOF public.search_household_heads_result
LANGUAGE sql
STABLE
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

COMMENT ON FUNCTION public.fn_search_household_heads(bigint, text, integer) IS 'Searches for household heads using trigram search on person_search.search_text. Returns people where household_head_id IS NULL.';

COMMIT;
