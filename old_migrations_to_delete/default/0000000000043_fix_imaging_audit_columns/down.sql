-- Revert column names back to _id suffix

ALTER TABLE public.imaging_study 
  RENAME COLUMN created_by TO created_by_id;

ALTER TABLE public.imaging_study 
  RENAME COLUMN updated_by TO updated_by_id;

ALTER TABLE public.imaging_asset 
  RENAME COLUMN created_by TO created_by_id;

ALTER TABLE public.imaging_asset 
  RENAME COLUMN updated_by TO updated_by_id;
