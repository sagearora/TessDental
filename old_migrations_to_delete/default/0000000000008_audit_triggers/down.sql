-- Drop triggers from operatory
drop trigger if exists tr_audit_row_change on public.operatory;
drop trigger if exists tr_stamp_audit_columns on public.operatory;

-- Restore original view (without audit columns)
create or replace view public.operatory_v as
select
  id,
  clinic_id,
  name,
  is_bookable,
  is_active,
  color,
  created_at,
  updated_at
from public.operatory;

-- Remove audit columns from operatory (optional - may want to keep data)
-- alter table public.operatory
--   drop column if exists created_by,
--   drop column if exists updated_by;

-- Drop trigger functions
drop function if exists audit.fn_row_change_to_event();
drop function if exists audit.fn_stamp_audit_columns();

-- Drop Hasura session functions
drop function if exists audit.fn_hasura_clinic_id();
drop function if exists audit.fn_hasura_role();
drop function if exists audit.fn_hasura_user_id();
drop function if exists audit.fn_hasura_session();
