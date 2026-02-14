-- ============================================================================
-- Rollback: Person family links v1
-- ============================================================================

drop function if exists public.fn_get_family_members(bigint);
drop type if exists public.family_member_result;
drop view if exists public.person_with_responsible_party_v;
drop view if exists public.family_group_v;
drop trigger if exists tr_validate_person_responsible_party on public.person;
drop function if exists public.fn_validate_person_responsible_party();
alter table public.person drop constraint if exists chk_person_household_relationship;
drop index if exists public.idx_person_responsible_party_reverse;
drop index if exists public.idx_person_responsible_party;
alter table public.person drop constraint if exists person_responsible_party_id_fkey;
alter table public.person drop column if exists household_relationship;
alter table public.person drop column if exists responsible_party_id;
