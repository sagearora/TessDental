-- ============================================================================
-- Rollback Patient Search Implementation (v2)
-- ============================================================================

-- Drop search function
drop function if exists public.fn_search_patients(text, int);

-- Drop composite type
drop type if exists public.patient_search_result cascade;

-- Drop rebuild function
drop function if exists public.fn_rebuild_patient_search_row(bigint);

-- Drop triggers
drop trigger if exists tr_contact_point_rebuild_search on public.person_contact_point;
drop function if exists public.fn_contact_point_after_change_rebuild_search();

drop trigger if exists tr_patient_rebuild_search on public.patient;
drop function if exists public.fn_patient_after_change_rebuild_search();

drop trigger if exists tr_person_rebuild_search on public.person;
drop function if exists public.fn_person_after_change_rebuild_search();

-- Drop patient_search table
drop table if exists public.patient_search cascade;

-- Drop normalization trigger and function
drop trigger if exists tr_normalize_contact_point on public.person_contact_point;
drop function if exists public.fn_normalize_contact_point();

-- Drop indexes
drop index if exists public.idx_pcp_email_norm;
drop index if exists public.idx_pcp_phone_norm;

-- Remove normalized column (optional - may want to keep for data)
-- alter table public.person_contact_point drop column if exists value_norm;

-- Note: pg_trgm extension is not dropped as it may be used elsewhere
