-- Drop view
drop view if exists public.user_provider_identifier_v;

-- Drop triggers
drop trigger if exists tr_audit_row_change on public.user_provider_identifier;
drop trigger if exists tr_stamp_audit_columns on public.user_provider_identifier;

-- Drop table
drop table if exists public.user_provider_identifier;
