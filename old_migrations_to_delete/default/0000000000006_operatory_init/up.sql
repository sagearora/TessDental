-- Create operatory table
create table if not exists public.operatory (
  id bigserial primary key,
  clinic_id bigint not null references public.clinic(id) on delete cascade,
  name text not null,
  is_bookable boolean not null default true,
  is_active boolean not null default true,
  color text not null default '(128,128,128,1)', -- Default gray color in RGBA format
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (clinic_id, name)
);

-- Create indexes
create index if not exists idx_operatory_clinic on public.operatory(clinic_id);
create index if not exists idx_operatory_active on public.operatory(clinic_id, is_active);
create index if not exists idx_operatory_bookable on public.operatory(clinic_id, is_bookable) where is_bookable = true;

-- Create view for operatory
create or replace view public.operatory_v as
select
  id,
  clinic_id,
  name,
  is_bookable,
  is_active,
  color,
  created_at,
  updated_at
from public.operatory;
