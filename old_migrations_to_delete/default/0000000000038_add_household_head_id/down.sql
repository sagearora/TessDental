-- ============================================================================
-- Remove household_head_id from person table
-- ============================================================================

-- 1) Drop trigger
drop trigger if exists tr_validate_household_head on public.person;

-- 2) Drop function
drop function if exists public.fn_validate_household_head();

-- 3) Drop indexes
drop index if exists public.idx_person_household_head_reverse;
drop index if exists public.idx_person_household_head;

-- 4) Drop foreign key constraint
alter table public.person drop constraint if exists person_household_head_id_fkey;

-- 5) Drop column
alter table public.person drop column if exists household_head_id;
