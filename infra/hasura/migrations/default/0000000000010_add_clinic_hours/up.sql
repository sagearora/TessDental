-- Create clinic_hours table with audit columns
create table if not exists public.clinic_hours (
  id bigserial primary key,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6), -- 0=Sunday, 1=Monday, ..., 6=Saturday
  is_closed boolean not null default false,
  open_time time null, -- Clinic open time
  close_time time null, -- Clinic close time
  appointment_start time null, -- Start time for appointments
  appointment_end time null, -- End time for appointments
  -- Standard audit columns
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id),
  is_active boolean not null default true,
  unique (clinic_id, day_of_week)
);

-- If table already exists, ensure all columns exist
do $$
begin
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
  
  -- Add appointment_start if it doesn't exist
  if not exists (select 1 from information_schema.columns 
                 where table_schema = 'public' 
                 and table_name = 'clinic_hours' 
                 and column_name = 'appointment_start') then
    alter table public.clinic_hours add column appointment_start time null;
  end if;
  
  -- Add appointment_end if it doesn't exist
  if not exists (select 1 from information_schema.columns 
                 where table_schema = 'public' 
                 and table_name = 'clinic_hours' 
                 and column_name = 'appointment_end') then
    alter table public.clinic_hours add column appointment_end time null;
  end if;
  
  -- Drop lunch columns if they exist
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
  
  -- Migrate existing data: if clinic hours are null but appointment hours exist, copy them
  update public.clinic_hours
  set open_time = appointment_start
  where open_time is null and appointment_start is not null;
  
  update public.clinic_hours
  set close_time = appointment_end
  where close_time is null and appointment_end is not null;
end $$;

-- Create indexes
create index if not exists idx_clinic_hours_clinic on public.clinic_hours(clinic_id);
create index if not exists idx_clinic_hours_clinic_day on public.clinic_hours(clinic_id, day_of_week);

-- Attach stamp trigger (sets updated_at + created_by/updated_by)
drop trigger if exists tr_stamp_audit_columns on public.clinic_hours;
create trigger tr_stamp_audit_columns
before insert or update on public.clinic_hours
for each row execute function audit.fn_stamp_audit_columns();

-- Attach audit event trigger (writes to audit.event for INSERT/UPDATE/DELETE)
drop trigger if exists tr_audit_row_change on public.clinic_hours;
create trigger tr_audit_row_change
after insert or update or delete on public.clinic_hours
for each row execute function audit.fn_row_change_to_event();

-- Create view for clinic_hours
create or replace view public.clinic_hours_v as
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
