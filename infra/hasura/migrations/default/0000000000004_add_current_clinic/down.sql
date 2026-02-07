-- Revert app_user_v view
create or replace view public.app_user_v as
select
  id, email, first_name, last_name, is_active, created_at, updated_at
from public.app_user;

-- Drop index
drop index if exists public.idx_app_user_current_clinic;

-- Drop column
alter table public.app_user
drop column if exists current_clinic_id;
