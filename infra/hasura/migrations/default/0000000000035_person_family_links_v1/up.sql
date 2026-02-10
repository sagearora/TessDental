-- ============================================================================
-- Person family links v1 (non-destructive)
-- Adds: person.responsible_party_id, person.household_relationship
-- Backfills from existing household + household_member
-- Adds validations + helper views + fn_get_family_members
-- Does NOT drop household tables yet.
-- ============================================================================

-- 1) Add columns on person (idempotent)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='person' and column_name='responsible_party_id'
  ) then
    alter table public.person add column responsible_party_id bigint null;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='person' and column_name='household_relationship'
  ) then
    alter table public.person add column household_relationship text null;
  end if;
end $$;

-- 2) FK for responsible_party_id (idempotent)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'person_responsible_party_id_fkey'
  ) then
    alter table public.person
      add constraint person_responsible_party_id_fkey
      foreign key (responsible_party_id) references public.person(id) on delete restrict;
  end if;
end $$;

-- 3) Relationship enum constraint (replace-if-exists)
alter table public.person
  drop constraint if exists chk_person_household_relationship;

alter table public.person
  add constraint chk_person_household_relationship
  check (
    household_relationship is null
    or household_relationship in ('self','child','spouse','parent','guardian','other')
  );

-- Helpful indexes
create index if not exists idx_person_responsible_party
  on public.person(responsible_party_id)
  where responsible_party_id is not null;

create index if not exists idx_person_responsible_party_reverse
  on public.person(clinic_id, responsible_party_id, is_active)
  where responsible_party_id is not null;

-- 4) Backfill from existing household system
-- Rule: root = household.primary_contact_person_id
-- fallback root = household.default_responsible_party_person_id
-- fallback root = household_member(role='head')
do $$
declare
  r record;
  v_root bigint;
begin
  -- initialize everyone to self if still nulls later
  -- (we only set rows we can map first)
  for r in
    select h.id as household_id,
           h.clinic_id,
           h.primary_contact_person_id,
           h.default_responsible_party_person_id
    from public.household h
    where h.is_active = true
  loop
    v_root := r.primary_contact_person_id;

    if v_root is null then
      v_root := r.default_responsible_party_person_id;
    end if;

    if v_root is null then
      select hm.person_id into v_root
      from public.household_member hm
      where hm.household_id = r.household_id
        and hm.is_active = true
        and hm.role = 'head'
      limit 1;
    end if;

    -- If we still don't have a root, skip this household
    if v_root is null then
      continue;
    end if;

    -- root: responsible_party_id null + self
    update public.person
    set responsible_party_id = null,
        household_relationship = 'self'
    where id = v_root;

    -- everyone else: points to root + relationship from household_member.relationship_to_primary_contact
    update public.person p
    set responsible_party_id = v_root,
        household_relationship = coalesce(hm.relationship_to_primary_contact, 'other')
    from public.household_member hm
    where hm.household_id = r.household_id
      and hm.is_active = true
      and hm.person_id = p.id
      and p.id <> v_root;
  end loop;

  -- Any remaining people with null relationship: set to self root
  update public.person
  set responsible_party_id = null,
      household_relationship = 'self'
  where household_relationship is null;
end $$;

-- 5) Validation trigger to enforce your rules
-- Your rules:
-- - If a person has responsible_party_id set => relationship must be not null and not 'self'
-- - If a person is responsible_party for someone else => they must have responsible_party_id null
-- - responsible_party target must itself be a root (responsible_party_id null)
create or replace function public.fn_validate_person_responsible_party()
returns trigger
language plpgsql
as $$
declare
  v_is_responsible_for_others boolean;
begin
  -- Normalize relationship when root
  if NEW.responsible_party_id is null then
    if NEW.household_relationship is null then
      NEW.household_relationship := 'self';
    end if;
    if NEW.household_relationship <> 'self' then
      raise exception 'root_person_must_have_relationship_self';
    end if;
  else
    if NEW.responsible_party_id = NEW.id then
      raise exception 'responsible_party_id_cannot_reference_self';
    end if;
    if NEW.household_relationship is null then
      raise exception 'relationship_required_when_responsible_party_id_is_set';
    end if;
    if NEW.household_relationship = 'self' then
      raise exception 'relationship_self_not_allowed_when_responsible_party_id_is_set';
    end if;

    -- Responsible party must be a root (must have null responsible_party_id)
    if exists (
      select 1
      from public.person rp
      where rp.id = NEW.responsible_party_id
        and rp.responsible_party_id is not null
    ) then
      raise exception 'responsible_party_must_be_root_with_null_responsible_party_id';
    end if;
  end if;

  -- If NEW is responsible party for others, NEW must be root (responsible_party_id null)
  select exists (
    select 1
    from public.person p
    where p.responsible_party_id = NEW.id
      and p.is_active = true
  ) into v_is_responsible_for_others;

  if v_is_responsible_for_others and NEW.responsible_party_id is not null then
    raise exception 'person_who_is_responsible_party_for_others_must_have_null_responsible_party_id';
  end if;

  return NEW;
end;
$$;

drop trigger if exists tr_validate_person_responsible_party on public.person;

create trigger tr_validate_person_responsible_party
before insert or update on public.person
for each row execute function public.fn_validate_person_responsible_party();

-- 6) Views for UI + Hasura (stable contracts)

create or replace view public.family_group_v as
select
  p.id as person_id,
  p.clinic_id,
  coalesce(p.responsible_party_id, p.id) as family_root_person_id
from public.person p;

create or replace view public.person_with_responsible_party_v as
select
  p.*,
  rp.first_name as responsible_party_first_name,
  rp.last_name as responsible_party_last_name,
  rp.preferred_name as responsible_party_preferred_name
from public.person p
left join public.person rp on rp.id = p.responsible_party_id;

create or replace view public.family_members_v as
select
  p2.clinic_id,
  p2.id as person_id,
  fg.family_root_person_id,
  p2.first_name,
  p2.last_name,
  p2.preferred_name,
  p2.dob,
  p2.responsible_party_id,
  p2.household_relationship,
  exists(select 1 from public.patient pat where pat.person_id = p2.id and pat.is_active = true) as is_patient
from public.person p2
join public.family_group_v fg
  on fg.person_id = p2.id;

-- 7) Composite type (NO "IF NOT EXISTS" in Postgres)
do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'family_member_result'
      and n.nspname = 'public'
  ) then
    create type public.family_member_result as (
      person_id bigint,
      family_root_person_id bigint,
      first_name text,
      last_name text,
      preferred_name text,
      dob date,
      is_patient boolean,
      responsible_party_id bigint,
      household_relationship text
    );
  end if;
end $$;

-- 8) Hasura-trackable function to fetch family members
create or replace function public.fn_get_family_members(p_person_id bigint)
returns setof public.family_member_result
language sql
stable
as $$
  with root as (
    select coalesce(responsible_party_id, id) as family_root_person_id
    from public.person
    where id = p_person_id
  )
  select
    p.id as person_id,
    (select family_root_person_id from root),
    p.first_name,
    p.last_name,
    p.preferred_name,
    p.dob,
    exists(select 1 from public.patient pat where pat.person_id = p.id and pat.is_active = true) as is_patient,
    p.responsible_party_id,
    p.household_relationship
  from public.person p
  where coalesce(p.responsible_party_id, p.id) = (select family_root_person_id from root)
  order by
    case when p.id = (select family_root_person_id from root) then 0 else 1 end,
    p.last_name asc,
    p.first_name asc;
$$;
