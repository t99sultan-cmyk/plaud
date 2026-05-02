-- Per-user minute balance with separate free / paid pools and expiration.
--
-- Free minutes: 10 granted on signup, never expire (one-time only).
-- Paid minutes: from promocode redemption (= manual Kaspi payment), expire
--   30 days after redemption (extended on each new redemption).
--
-- Deduction order on transcription: free first, then paid.

create table if not exists public.user_credits (
  user_id                 uuid primary key references auth.users(id) on delete cascade,
  free_minutes_remaining  int  not null default 40 check (free_minutes_remaining >= 0),
  paid_minutes_remaining  int  not null default 0  check (paid_minutes_remaining >= 0),
  paid_minutes_expires_at timestamptz,
  total_minutes_used      int  not null default 0,
  updated_at              timestamptz not null default now()
);

create index if not exists user_credits_expires_idx
  on public.user_credits(paid_minutes_expires_at)
  where paid_minutes_remaining > 0;

-- updated_at trigger (reuses function from 0001_init)
drop trigger if exists user_credits_updated_at on public.user_credits;
create trigger user_credits_updated_at
  before update on public.user_credits
  for each row execute function public.set_updated_at();

-- RLS: users see only their own balance, no direct writes (server-side only)
alter table public.user_credits enable row level security;

drop policy if exists "credits_select_own" on public.user_credits;
create policy "credits_select_own" on public.user_credits
  for select using (auth.uid() = user_id);
-- No update/insert/delete policies — service role only

-- Auto-create credits row on user signup
create or replace function public.handle_new_user_credits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_credits (user_id, free_minutes_remaining)
  values (new.id, 40)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_credits();

-- Backfill existing users — give 10 free minutes to anyone without a row yet
insert into public.user_credits (user_id, free_minutes_remaining)
select id, 10 from auth.users
on conflict (user_id) do nothing;
