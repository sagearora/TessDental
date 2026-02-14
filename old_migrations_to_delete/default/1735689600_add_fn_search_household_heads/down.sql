-- =========================================================
-- Rollback fn_search_household_heads function
-- =========================================================

BEGIN;

DROP FUNCTION IF EXISTS public.fn_search_household_heads(bigint, text, integer);

DROP TABLE IF EXISTS public.search_household_heads_result;

COMMIT;
