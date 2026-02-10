-- Drop imaging tables and their triggers

drop trigger if exists trg_imaging_asset_audit_event on public.imaging_asset;
drop trigger if exists trg_imaging_asset_audit_stamp on public.imaging_asset;
drop trigger if exists trg_imaging_study_audit_event on public.imaging_study;
drop trigger if exists trg_imaging_study_audit_stamp on public.imaging_study;

drop table if exists public.imaging_asset;
drop table if exists public.imaging_study;
