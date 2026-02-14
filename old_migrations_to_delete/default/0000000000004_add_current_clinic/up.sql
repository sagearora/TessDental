-- Add current_clinic_id column to app_user table
alter table public.app_user
add column if not exists current_clinic_id bigint null
references public.clinic(id) on delete set null;

-- Add index for current_clinic_id
create index if not exists idx_app_user_current_clinic on public.app_user(current_clinic_id);

-- Update the app_user_v view to include current_clinic_id
create or replace view public.app_user_v as
select
  id, email, first_name, last_name, is_active, created_at, updated_at, current_clinic_id
from public.app_user;

-- Set current_clinic_id for existing users to their first active clinic
update public.app_user au
set current_clinic_id = (
  select cu.clinic_id
  from public.clinic_user cu
  where cu.user_id = au.id
    and cu.is_active = true
  order by cu.clinic_id asc
  limit 1
)
where current_clinic_id is null
  and exists (
    select 1
    from public.clinic_user cu
    where cu.user_id = au.id
      and cu.is_active = true
  );
