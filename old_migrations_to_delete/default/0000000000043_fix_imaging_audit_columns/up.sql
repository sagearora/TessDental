-- ============================================================================
-- Fix imaging tables audit columns to match audit function
-- ============================================================================
-- The audit.fn_stamp_audit_columns() function expects created_by/updated_by
-- but imaging tables were created with created_by_id/updated_by_id
-- ============================================================================

-- Rename columns in imaging_study
ALTER TABLE public.imaging_study 
  RENAME COLUMN created_by_id TO created_by;

ALTER TABLE public.imaging_study 
  RENAME COLUMN updated_by_id TO updated_by;

-- Rename columns in imaging_asset
ALTER TABLE public.imaging_asset 
  RENAME COLUMN created_by_id TO created_by;

ALTER TABLE public.imaging_asset 
  RENAME COLUMN updated_by_id TO updated_by;
