-- Remove middle_name column from person table
ALTER TABLE public.person
DROP COLUMN IF EXISTS middle_name;
