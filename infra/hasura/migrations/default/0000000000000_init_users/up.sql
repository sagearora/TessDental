create extension if not exists pgcrypto;

create table public.user (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create index user_email_idx on public.user (email);
