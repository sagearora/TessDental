-- ============================================================================
-- User Provider Identifier Implementation
-- ============================================================================
-- Supports CDA UIN and other provider identifiers with multi-province support
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Create public.user_provider_identifier table
-- ----------------------------------------------------------------------------

create table if not exists public.user_provider_identifier (
  id bigserial primary key,
  user_id uuid not null references public.app_user(id) on delete cascade,
  identifier_kind text not null default 'cda_uin',
  province_code text not null,
  license_type text not null,
  identifier_value text not null,
  effective_from date null,
  effective_to date null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references public.app_user(id),
  updated_at timestamptz not null default now(),
  updated_by uuid null references public.app_user(id),
  constraint chk_province_code_length check (char_length(province_code) = 2),
  constraint chk_effective_dates check (effective_to is null or effective_from is null or effective_to >= effective_from)
);

-- Unique constraint: only one active identifier per (user, kind, province, license_type)
create unique index if not exists idx_user_provider_identifier_unique_active
on public.user_provider_identifier(user_id, identifier_kind, province_code, license_type)
where is_active = true;

-- Indexes for queries
create index if not exists idx_user_provider_identifier_user_kind
on public.user_provider_identifier(user_id, identifier_kind);

create index if not exists idx_user_provider_identifier_active
on public.user_provider_identifier(user_id, is_active) where is_active = true;

-- ----------------------------------------------------------------------------
-- 2) Attach audit triggers
-- ----------------------------------------------------------------------------

drop trigger if exists tr_stamp_audit_columns on public.user_provider_identifier;
create trigger tr_stamp_audit_columns
before insert or update on public.user_provider_identifier
for each row execute function audit.fn_stamp_audit_columns();

drop trigger if exists tr_audit_row_change on public.user_provider_identifier;
create trigger tr_audit_row_change
after insert or update or delete on public.user_provider_identifier
for each row execute function audit.fn_row_change_to_event();

-- ----------------------------------------------------------------------------
-- 3) Create view for UI
-- ----------------------------------------------------------------------------

drop view if exists public.user_provider_identifier_v;
create view public.user_provider_identifier_v as
select
  id,
  user_id,
  identifier_kind,
  province_code,
  license_type,
  identifier_value,
  effective_from,
  effective_to,
  is_active,
  created_at,
  created_by,
  updated_at,
  updated_by
from public.user_provider_identifier;
