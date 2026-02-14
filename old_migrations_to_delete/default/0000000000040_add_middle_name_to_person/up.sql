-- Add middle_name column to person table
ALTER TABLE public.person
ADD COLUMN IF NOT EXISTS middle_name text;
