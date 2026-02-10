-- Rollback for fn_search_people Hasura tracking fix

BEGIN;

-- Drop function
DROP FUNCTION IF EXISTS public.fn_search_people(bigint, text, integer, boolean);

-- Drop return table
DROP TABLE IF EXISTS public.search_people_result CASCADE;

COMMIT;
