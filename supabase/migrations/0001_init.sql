-- Plaud Web — initial schema
-- Tables: folders, recordings, transcripts, summaries, chats, messages
-- Storage bucket: 'recordings' (private)
-- RLS: every row scoped to auth.uid() = user_id

-- =============== Extensions ===============
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =============== Enums ===============
do $$ begin
  create type recording_status as enum (
    'uploading', 'queued', 'transcribing', 'summarizing', 'ready', 'failed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type chat_role as enum ('user', 'assistant');
exception when duplicate_object then null; end $$;

-- =============== Tables ===============

-- Folders
create table if not exists public.folders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null check (length(name) between 1 and 80),
  color       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists folders_user_idx
  on public.folders(user_id, created_at desc);

-- Recordings
create table if not exists public.recordings (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  folder_id     uuid references public.folders(id) on delete set null,
  title         text not null,
  storage_path  text not null,
  mime_type     text not null,
  size_bytes    bigint not null,
  duration_sec  numeric,
  status        recording_status not null default 'uploading',
  error_message text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists recordings_user_folder_idx
  on public.recordings(user_id, folder_id, created_at desc);
create index if not exists recordings_status_idx
  on public.recordings(status) where status in ('queued', 'transcribing', 'summarizing');

-- Transcripts (1:1 with recordings)
create table if not exists public.transcripts (
  recording_id  uuid primary key references public.recordings(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  language      text,
  full_text     text not null,
  segments      jsonb not null default '[]'::jsonb,
  token_count   int,
  created_at    timestamptz not null default now()
);

-- Summaries (1:1 with recordings)
create table if not exists public.summaries (
  recording_id  uuid primary key references public.recordings(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  tldr          text not null,
  bullets       jsonb not null default '[]'::jsonb,
  takeaways     jsonb not null default '[]'::jsonb,
  topics        jsonb default '[]'::jsonb,
  model         text not null,
  created_at    timestamptz not null default now()
);

-- Chats (one per recording per user, but schema allows multi)
create table if not exists public.chats (
  id            uuid primary key default gen_random_uuid(),
  recording_id  uuid not null references public.recordings(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  created_at    timestamptz not null default now()
);
create unique index if not exists chats_recording_user_idx
  on public.chats(recording_id, user_id);

-- Messages
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  chat_id     uuid not null references public.chats(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        chat_role not null,
  content     text not null,
  tokens_in   int,
  tokens_out  int,
  created_at  timestamptz not null default now()
);
create index if not exists messages_chat_idx
  on public.messages(chat_id, created_at);

-- =============== updated_at trigger ===============
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists folders_updated_at on public.folders;
create trigger folders_updated_at
  before update on public.folders
  for each row execute function public.set_updated_at();

drop trigger if exists recordings_updated_at on public.recordings;
create trigger recordings_updated_at
  before update on public.recordings
  for each row execute function public.set_updated_at();

-- =============== RLS ===============
alter table public.folders     enable row level security;
alter table public.recordings  enable row level security;
alter table public.transcripts enable row level security;
alter table public.summaries   enable row level security;
alter table public.chats       enable row level security;
alter table public.messages    enable row level security;

-- folders
drop policy if exists "folders_select_own" on public.folders;
create policy "folders_select_own" on public.folders
  for select using (auth.uid() = user_id);
drop policy if exists "folders_modify_own" on public.folders;
create policy "folders_modify_own" on public.folders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- recordings
drop policy if exists "recordings_select_own" on public.recordings;
create policy "recordings_select_own" on public.recordings
  for select using (auth.uid() = user_id);
drop policy if exists "recordings_modify_own" on public.recordings;
create policy "recordings_modify_own" on public.recordings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- transcripts
drop policy if exists "transcripts_select_own" on public.transcripts;
create policy "transcripts_select_own" on public.transcripts
  for select using (auth.uid() = user_id);
drop policy if exists "transcripts_modify_own" on public.transcripts;
create policy "transcripts_modify_own" on public.transcripts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- summaries
drop policy if exists "summaries_select_own" on public.summaries;
create policy "summaries_select_own" on public.summaries
  for select using (auth.uid() = user_id);
drop policy if exists "summaries_modify_own" on public.summaries;
create policy "summaries_modify_own" on public.summaries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- chats
drop policy if exists "chats_select_own" on public.chats;
create policy "chats_select_own" on public.chats
  for select using (auth.uid() = user_id);
drop policy if exists "chats_modify_own" on public.chats;
create policy "chats_modify_own" on public.chats
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- messages
drop policy if exists "messages_select_own" on public.messages;
create policy "messages_select_own" on public.messages
  for select using (auth.uid() = user_id);
drop policy if exists "messages_modify_own" on public.messages;
create policy "messages_modify_own" on public.messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =============== Storage bucket + policies ===============
-- Create private bucket if missing
insert into storage.buckets (id, name, public, file_size_limit)
values ('recordings', 'recordings', false, 524288000)  -- 500 MB cap per file
on conflict (id) do nothing;

-- Path convention: {user_id}/{recording_id}.{ext}
-- Owner-only access via storage.foldername

drop policy if exists "recordings_storage_select" on storage.objects;
create policy "recordings_storage_select" on storage.objects
  for select using (
    bucket_id = 'recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "recordings_storage_insert" on storage.objects;
create policy "recordings_storage_insert" on storage.objects
  for insert with check (
    bucket_id = 'recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "recordings_storage_update" on storage.objects;
create policy "recordings_storage_update" on storage.objects
  for update using (
    bucket_id = 'recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "recordings_storage_delete" on storage.objects;
create policy "recordings_storage_delete" on storage.objects
  for delete using (
    bucket_id = 'recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- =============== Realtime ===============
-- Enable realtime on recordings so the UI sees status changes live
alter publication supabase_realtime add table public.recordings;
