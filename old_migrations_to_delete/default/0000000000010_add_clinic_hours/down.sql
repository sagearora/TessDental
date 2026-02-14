-- Drop view
drop view if exists public.clinic_hours_v;

-- Drop triggers
drop trigger if exists tr_stamp_audit_columns on public.clinic_hours;
drop trigger if exists tr_audit_row_change on public.clinic_hours;

-- Drop table
drop table if exists public.clinic_hours;
