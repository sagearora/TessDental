-- ============================================================================
-- Rollback: Remove household_relationship_enum and restore CHECK constraint
-- ============================================================================

-- Drop foreign key constraint
ALTER TABLE public.person
    DROP CONSTRAINT IF EXISTS fk_person_household_relationship;

-- Recreate the original CHECK constraint (with original values including 'guardian')
ALTER TABLE public.person
    ADD CONSTRAINT chk_person_household_relationship CHECK (((household_relationship IS NULL) OR (household_relationship = ANY (ARRAY['self'::text, 'child'::text, 'spouse'::text, 'parent'::text, 'guardian'::text, 'other'::text]))));

-- Drop enum table
DROP TABLE IF EXISTS public.household_relationship_enum;
