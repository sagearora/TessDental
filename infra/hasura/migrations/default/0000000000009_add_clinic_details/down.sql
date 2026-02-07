-- Remove new fields from clinic table
alter table public.clinic
drop column if exists phone,
drop column if exists fax,
drop column if exists website,
drop column if exists email,
drop column if exists address_street,
drop column if exists address_unit,
drop column if exists address_city,
drop column if exists address_province,
drop column if exists address_postal,
drop column if exists billing_number;

-- Revert clinic_v view to original structure
create or replace view public.clinic_v as
select
  id,
  name,
  timezone,
  is_active
from public.clinic;
