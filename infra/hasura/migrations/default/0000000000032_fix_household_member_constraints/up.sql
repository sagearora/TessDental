-- ============================================================================
-- Fix Household Member Constraints
-- ============================================================================
-- Updates constraints to use relationship_to_primary_contact instead of relationship_to_head
-- ============================================================================

-- Drop old constraints that reference relationship_to_head
alter table public.household_member
drop constraint if exists chk_relationship_required;

alter table public.household_member
drop constraint if exists chk_head_relationship_self;

-- Add new constraint for relationship_to_primary_contact
-- For members (non-head), relationship_to_primary_contact should be set
-- For head, relationship_to_primary_contact should be 'self' or can be null (will default to 'self')
alter table public.household_member
add constraint chk_relationship_to_primary_contact_required
check (
  (role = 'head') OR (relationship_to_primary_contact is not null)
);

-- Ensure head has relationship_to_primary_contact = 'self' if set
alter table public.household_member
add constraint chk_head_relationship_to_primary_contact
check (
  (role != 'head') OR (relationship_to_primary_contact is null OR relationship_to_primary_contact = 'self')
);

comment on constraint chk_relationship_to_primary_contact_required on public.household_member is 'Non-head members must have a relationship_to_primary_contact';
comment on constraint chk_head_relationship_to_primary_contact on public.household_member is 'Head of household should have relationship_to_primary_contact = self or null';
