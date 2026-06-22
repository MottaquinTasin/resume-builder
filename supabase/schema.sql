-- Resume Builder — Supabase schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled Resume',
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Each user can only see and modify their own resumes.
alter table public.resumes enable row level security;

drop policy if exists "Users manage their own resumes" on public.resumes;
create policy "Users manage their own resumes"
  on public.resumes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Keep updated_at fresh on every update.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists resumes_set_updated_at on public.resumes;
create trigger resumes_set_updated_at
  before update on public.resumes
  for each row execute function public.set_updated_at();

-- Helpful index for the dashboard's "most recent first" ordering.
create index if not exists resumes_user_updated_idx
  on public.resumes (user_id, updated_at desc);
