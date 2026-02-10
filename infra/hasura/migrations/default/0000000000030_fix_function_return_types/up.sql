-- ============================================================================
-- Fix Function Return Types for Hasura Tracking
-- ============================================================================
-- Updates functions to return table types so Hasura can track them
-- ============================================================================

-- Create composite type for set_responsible_party result
do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'set_responsible_party_result'
      and n.nspname = 'public'
  ) then
    create type public.set_responsible_party_result as (
      success boolean,
      patient_person_id bigint,
      responsible_party_person_id bigint,
      apply_to_household boolean
    );
  end if;
end $$;

-- Create composite type for set_patient_household_defaults result
do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'set_household_defaults_result'
      and n.nspname = 'public'
  ) then
    create type public.set_household_defaults_result as (
      household_id bigint
    );
  end if;
end $$;

-- Update fn_set_patient_household_defaults_v2 to return table
drop function if exists public.fn_set_patient_household_defaults_v2(bigint);

create or replace function public.fn_set_patient_household_defaults_v2(p_patient_person_id bigint)
returns setof public.set_household_defaults_result
language plpgsql
security definer
as $$
declare
  v_household_id bigint;
begin
  -- Call the original function
  perform public.fn_set_patient_household_defaults(p_patient_person_id);
  
  -- Get the household_id
  select household_id into v_household_id
  from public.patient
  where person_id = p_patient_person_id;
  
  -- Return as table row
  return query select v_household_id;
end;
$$;

comment on function public.fn_set_patient_household_defaults_v2(bigint) is 'Sets patient household defaults and returns the household_id as a table. Can be called via Hasura.';

-- Update fn_set_responsible_party_v2 (already has composite type from previous migration)
drop function if exists public.fn_set_responsible_party_v2(bigint, bigint, boolean);

create or replace function public.fn_set_responsible_party_v2(
  p_patient_person_id bigint,
  p_responsible_person_id bigint,
  p_apply_to_household boolean default false
)
returns setof public.set_responsible_party_result
language plpgsql
security definer
as $$
begin
  -- Call the original function
  perform public.fn_set_responsible_party(
    p_patient_person_id,
    p_responsible_person_id,
    p_apply_to_household
  );
  
  -- Return result as table row
  return query select
    true as success,
    p_patient_person_id,
    p_responsible_person_id,
    p_apply_to_household;
end;
$$;

comment on function public.fn_set_responsible_party_v2(bigint, bigint, boolean) is 'Sets responsible party for a patient, optionally applying to all household members. Returns success status as table.';
