-- ============================================================================
-- Rollback: Person Search v1
-- ============================================================================

-- Drop function
drop function if exists public.fn_search_people(bigint, text, int, boolean);

-- Drop composite type
drop type if exists public.person_search_result cascade;

-- Drop indexes
drop index if exists idx_person_search_clinic_active;
drop index if exists idx_person_search_phone;
drop index if exists idx_person_search_blob_trgm;

-- Drop triggers
drop trigger if exists tr_person_search_refresh_from_patient on public.patient;
drop trigger if exists tr_person_search_refresh_from_contact_point on public.person_contact_point;
drop trigger if exists tr_person_search_refresh_from_person on public.person;

-- Drop trigger functions
drop function if exists public.fn_person_search_refresh_from_patient();
drop function if exists public.fn_person_search_refresh_from_contact_point();
drop function if exists public.fn_person_search_refresh_from_person();

-- Drop search columns
alter table public.person
  drop column if exists search_blob,
  drop column if exists search_phone,
  drop column if exists search_email,
  drop column if exists search_name;

-- Drop normalization functions
drop function if exists public.fn_norm_phone(text);
drop function if exists public.fn_norm_text(text);

-- Note: unaccent extension is not dropped as it may be used elsewhere
-- Note: pg_trgm extension is not dropped as it may be used elsewhere
