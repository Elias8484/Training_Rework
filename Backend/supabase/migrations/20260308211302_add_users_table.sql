CREATE TABLE IF NOT EXISTS public.users (
  id bigint primary key generated always as identity,
  full_name text not null,
  username text not null unique,
  password_hash text not null,
  created_at timestamptz default now() not null
);
