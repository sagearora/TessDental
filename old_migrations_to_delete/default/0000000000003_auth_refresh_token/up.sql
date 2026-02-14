-- Auth refresh token storage
create table if not exists public.auth_refresh_token (
  id bigserial primary key,
  user_id uuid not null references public.app_user(id) on delete cascade,
  token_hash text not null,
  revoked_at timestamptz null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_auth_refresh_token_user on public.auth_refresh_token(user_id);
create unique index if not exists idx_auth_refresh_token_hash on public.auth_refresh_token(token_hash);
