-- ============================================================================
-- Expose Set Responsible Party Function for Hasura
-- ============================================================================
-- Creates a wrapper function that returns a table for Hasura tracking
-- ============================================================================

-- Create composite type for return value
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

-- Wrapper function that returns a table
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
