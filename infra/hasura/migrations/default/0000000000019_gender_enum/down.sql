-- ============================================================================
-- Gender Enum Table Rollback
-- ============================================================================

-- Remove foreign key constraint
alter table public.person
drop constraint if exists fk_person_gender;

-- Drop enum table
drop table if exists public.gender_enum cascade;
