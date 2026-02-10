-- ============================================================================
-- Add household_head_id to person table
-- ============================================================================
-- Allows setting a household head independently of responsible_party_id
-- Enforces that household_head_id can only point to a person with household_head_id = null
-- ============================================================================

-- 1) Add household_head_id column to person (idempotent)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='person' and column_name='household_head_id'
  ) then
    alter table public.person add column household_head_id bigint null;
  end if;
end $$;

-- 2) Add foreign key constraint (idempotent)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'person_household_head_id_fkey'
  ) then
    alter table public.person
      add constraint person_household_head_id_fkey
      foreign key (household_head_id) references public.person(id) on delete restrict;
  end if;
end $$;

-- 3) Create trigger function to validate household_head_id
-- Ensures that if household_head_id is set, the target person must have household_head_id = null
create or replace function public.fn_validate_household_head()
returns trigger
language plpgsql
as $$
declare
  v_target_household_head_id bigint;
begin
  -- If household_head_id is being set to a non-null value
  if NEW.household_head_id is not null then
    -- Check if the target person has household_head_id = null
    select household_head_id into v_target_household_head_id
    from public.person
    where id = NEW.household_head_id;
    
    -- If target person doesn't exist, foreign key will catch this
    -- But we also need to check if target has household_head_id = null
    if v_target_household_head_id is not null then
      raise exception 'household_head_id can only point to a person with household_head_id = null (household head). Person % has household_head_id = %', NEW.household_head_id, v_target_household_head_id;
    end if;
    
    -- Prevent self-reference
    if NEW.household_head_id = NEW.id then
      raise exception 'person cannot be their own household head';
    end if;
  end if;
  
  return NEW;
end;
$$;

comment on function public.fn_validate_household_head() is 'Validates that household_head_id points to a person with household_head_id = null (a household head)';

-- 4) Create trigger to enforce validation
drop trigger if exists tr_validate_household_head on public.person;
create trigger tr_validate_household_head
before insert or update on public.person
for each row
execute function public.fn_validate_household_head();

-- 5) Add index for performance
create index if not exists idx_person_household_head
  on public.person(household_head_id)
  where household_head_id is not null;

-- 6) Add reverse index to find all people who point to a given household head
create index if not exists idx_person_household_head_reverse
  on public.person(clinic_id, household_head_id, is_active)
  where household_head_id is not null;
