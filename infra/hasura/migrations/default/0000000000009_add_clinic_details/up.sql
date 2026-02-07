-- Add new fields to clinic table
alter table public.clinic
add column if not exists phone text null,
add column if not exists fax text null,
add column if not exists website text null,
add column if not exists email text null,
add column if not exists address_street text null,
add column if not exists address_unit text null,
add column if not exists address_city text null,
add column if not exists address_province text null,
add column if not exists address_postal text null,
add column if not exists billing_number text null;

-- Update clinic_v view to include new fields
-- Note: Must preserve original column order (id, name, timezone, is_active) then add new columns
create or replace view public.clinic_v as
select
  id,
  name,
  timezone,
  is_active,
  phone,
  fax,
  website,
  email,
  address_street,
  address_unit,
  address_city,
  address_province,
  address_postal,
  billing_number,
  created_at,
  updated_at
from public.clinic;
