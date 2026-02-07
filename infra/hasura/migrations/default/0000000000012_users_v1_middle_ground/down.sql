-- Drop views
drop view if exists public.clinic_user_with_profile_v;
drop view if exists public.app_user_v;

-- Recreate original app_user_v (without audit columns)
create view public.app_user_v as
select
  id,
  email,
  first_name,
  last_name,
  is_active,
  created_at,
  updated_at,
  current_clinic_id
from public.app_user;

-- Remove triggers from clinic_user
drop trigger if exists tr_audit_row_change on public.clinic_user;
drop trigger if exists tr_stamp_audit_columns on public.clinic_user;

-- Remove triggers from app_user
drop trigger if exists tr_audit_row_change on public.app_user;
drop trigger if exists tr_stamp_audit_columns on public.app_user;

-- Remove columns from clinic_user (optional - may want to keep data)
-- alter table public.clinic_user
--   drop column if exists job_title,
--   drop column if exists is_schedulable,
--   drop column if exists provider_kind,
--   drop column if exists default_operatory_id,
--   drop column if exists scheduler_color,
--   drop column if exists created_by,
--   drop column if exists updated_by;

-- Remove columns from app_user (optional - may want to keep data)
-- alter table public.app_user
--   drop column if exists created_by,
--   drop column if exists updated_by;

-- Drop user_profile table
drop table if exists public.user_profile;
