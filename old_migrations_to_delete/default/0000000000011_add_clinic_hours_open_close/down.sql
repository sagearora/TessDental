-- Remove open_time and close_time columns from clinic_hours
do $$
begin
  if exists (select 1 from information_schema.columns 
             where table_schema = 'public' 
             and table_name = 'clinic_hours' 
             and column_name = 'open_time') then
    alter table public.clinic_hours drop column open_time;
  end if;
  
  if exists (select 1 from information_schema.columns 
             where table_schema = 'public' 
             and table_name = 'clinic_hours' 
             and column_name = 'close_time') then
    alter table public.clinic_hours drop column close_time;
  end if;
end $$;

-- Update view to remove open_time and close_time
create or replace view public.clinic_hours_v as
select
  id,
  clinic_id,
  day_of_week,
  is_closed,
  appointment_start,
  appointment_end,
  created_at,
  created_by,
  updated_at,
  updated_by,
  is_active
from public.clinic_hours;
