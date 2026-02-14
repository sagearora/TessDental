-- Add open_time, close_time, appointment_start, and appointment_end columns to clinic_hours if they don't exist
-- This migration adds clinic hours (separate from appointment hours)

-- First, drop the view if it exists (needed because we're changing column names from lunch_start/lunch_end to appointment_start/appointment_end)
drop view if exists public.clinic_hours_v;

-- Add all columns first (using ALTER TABLE with IF NOT EXISTS equivalent via DO block)
do $$
begin
  -- Add appointment_start if it doesn't exist (for appointment hours)
  if not exists (select 1 from information_schema.columns 
                 where table_schema = 'public' 
                 and table_name = 'clinic_hours' 
                 and column_name = 'appointment_start') then
    alter table public.clinic_hours add column appointment_start time null;
  end if;
  
  -- Add appointment_end if it doesn't exist (for appointment hours)
  if not exists (select 1 from information_schema.columns 
                 where table_schema = 'public' 
                 and table_name = 'clinic_hours' 
                 and column_name = 'appointment_end') then
    alter table public.clinic_hours add column appointment_end time null;
  end if;
  
  -- Add open_time if it doesn't exist (for clinic hours)
  if not exists (select 1 from information_schema.columns 
                 where table_schema = 'public' 
                 and table_name = 'clinic_hours' 
                 and column_name = 'open_time') then
    alter table public.clinic_hours add column open_time time null;
  end if;
  
  -- Add close_time if it doesn't exist (for clinic hours)
  if not exists (select 1 from information_schema.columns 
                 where table_schema = 'public' 
                 and table_name = 'clinic_hours' 
                 and column_name = 'close_time') then
    alter table public.clinic_hours add column close_time time null;
  end if;
  
  -- Drop lunch columns if they exist (migrating from old schema)
  if exists (select 1 from information_schema.columns 
             where table_schema = 'public' 
             and table_name = 'clinic_hours' 
             and column_name = 'lunch_start') then
    alter table public.clinic_hours drop column lunch_start;
  end if;
  
  if exists (select 1 from information_schema.columns 
             where table_schema = 'public' 
             and table_name = 'clinic_hours' 
             and column_name = 'lunch_end') then
    alter table public.clinic_hours drop column lunch_end;
  end if;
end $$;

-- Now migrate existing data: if clinic hours are null but appointment hours exist, copy them
-- This runs after all columns are added, so we can safely reference them
-- Use EXECUTE to avoid parse-time column existence checks
do $$
begin
  -- Check if appointment_start column exists before trying to use it
  if exists (select 1 from information_schema.columns 
             where table_schema = 'public' 
             and table_name = 'clinic_hours' 
             and column_name = 'appointment_start') then
    -- Use EXECUTE to dynamically build the UPDATE statement
    execute 'update public.clinic_hours set open_time = appointment_start where open_time is null and appointment_start is not null';
    execute 'update public.clinic_hours set close_time = appointment_end where close_time is null and appointment_end is not null';
  end if;
end $$;

-- Recreate view with all columns
-- All columns should exist now after the DO blocks above
create view public.clinic_hours_v as
select
  id,
  clinic_id,
  day_of_week,
  is_closed,
  open_time,
  close_time,
  appointment_start,
  appointment_end,
  created_at,
  created_by,
  updated_at,
  updated_by,
  is_active
from public.clinic_hours;
