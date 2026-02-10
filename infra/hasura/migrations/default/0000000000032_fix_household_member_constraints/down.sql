-- ============================================================================
-- Rollback: Fix Household Member Constraints
-- ============================================================================

-- Drop new constraints
alter table public.household_member
drop constraint if exists chk_relationship_to_primary_contact_required;

alter table public.household_member
drop constraint if exists chk_head_relationship_to_primary_contact;

-- Restore old constraints
alter table public.household_member
add constraint chk_relationship_required
check (
  (role = 'head') OR (relationship_to_head is not null)
);

alter table public.household_member
add constraint chk_head_relationship_self
check (
  (role != 'head') OR (relationship_to_head in ('self') OR relationship_to_head is null)
);
