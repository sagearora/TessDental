-- ============================================================================
-- Create household_relationship_enum table and replace CHECK constraint with FK
-- ============================================================================

-- Create enum table
CREATE TABLE public.household_relationship_enum (
    value text NOT NULL,
    comment text NOT NULL
);

-- Add primary key constraint
ALTER TABLE ONLY public.household_relationship_enum
    ADD CONSTRAINT household_relationship_enum_pkey PRIMARY KEY (value);

-- Insert enum values
INSERT INTO public.household_relationship_enum (value, comment) VALUES
    ('self', 'Self'),
    ('spouse', 'Spouse'),
    ('child', 'Child'),
    ('parent', 'Parent'),
    ('sibling', 'Sibling'),
    ('other', 'Other')
ON CONFLICT (value) DO NOTHING;

-- Drop the existing CHECK constraint
ALTER TABLE public.person
    DROP CONSTRAINT IF EXISTS chk_person_household_relationship;

-- Add foreign key constraint
ALTER TABLE ONLY public.person
    ADD CONSTRAINT fk_person_household_relationship FOREIGN KEY (household_relationship) REFERENCES public.household_relationship_enum(value);
