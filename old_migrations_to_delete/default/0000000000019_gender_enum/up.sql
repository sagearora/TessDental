-- ============================================================================
-- Gender Enum Table
-- ============================================================================
-- Creates an enum table for person.gender with values: male, female, other
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Create gender_enum table
-- ----------------------------------------------------------------------------

create table if not exists public.gender_enum (
  value text primary key,
  display_name text not null,
  display_order integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2) Insert enum values
-- ----------------------------------------------------------------------------

insert into public.gender_enum (value, display_name, display_order) values
  ('male', 'Male', 1),
  ('female', 'Female', 2),
  ('other', 'Other', 3)
on conflict (value) do nothing;

-- ----------------------------------------------------------------------------
-- 3) Add foreign key constraint to person.gender
-- ----------------------------------------------------------------------------

-- First, clean up any invalid gender values (set to null)
update public.person
set gender = null
where gender is not null
  and gender not in (select value from public.gender_enum);

-- Add foreign key constraint
alter table public.person
add constraint fk_person_gender
foreign key (gender) references public.gender_enum(value);

-- ----------------------------------------------------------------------------
-- 4) Add index for performance
-- ----------------------------------------------------------------------------

create index if not exists idx_gender_enum_active
on public.gender_enum(is_active, display_order)
where is_active = true;
