-- Promocodes: admin issues codes, users redeem them.
-- Phase 1: free_minutes type only (other types deferred to billing release).

create table if not exists public.promocodes (
  id              uuid primary key default gen_random_uuid(),
  code            text unique not null,
  description     text,
  type            text not null check (type in ('free_minutes', 'discount_percent', 'free_package')),
  free_minutes    int,
  discount_percent int,
  package_id      text,
  max_uses        int,
  used_count      int not null default 0,
  expires_at      timestamptz,
  created_by      uuid references auth.users(id),
  created_at      timestamptz not null default now()
);
create index if not exists promocodes_code_idx on public.promocodes(code);

create table if not exists public.promocode_redemptions (
  id            uuid primary key default gen_random_uuid(),
  promocode_id  uuid not null references public.promocodes(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  redeemed_at   timestamptz not null default now(),
  granted_minutes int,
  unique (promocode_id, user_id)
);
create index if not exists redemptions_user_idx
  on public.promocode_redemptions(user_id, redeemed_at desc);

-- RLS: anyone authenticated can read & redeem (server-side validates limits)
alter table public.promocodes enable row level security;
alter table public.promocode_redemptions enable row level security;

drop policy if exists "promocodes_read_all" on public.promocodes;
create policy "promocodes_read_all" on public.promocodes
  for select using (auth.role() = 'authenticated');

-- Only service role writes promocodes (admin via server actions with admin client)

drop policy if exists "redemptions_select_own" on public.promocode_redemptions;
create policy "redemptions_select_own" on public.promocode_redemptions
  for select using (auth.uid() = user_id);

drop policy if exists "redemptions_insert_own" on public.promocode_redemptions;
create policy "redemptions_insert_own" on public.promocode_redemptions
  for insert with check (auth.uid() = user_id);
