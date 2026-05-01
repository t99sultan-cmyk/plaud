-- Per-recording feedback from end users.
-- Allows admin to see how accurate transcripts/summaries feel to real people.

create table if not exists public.recording_feedback (
  recording_id uuid primary key references public.recordings(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  rating       smallint not null check (rating in (-1, 0, 1)), -- -1 thumbs-down, 0 neutral, 1 thumbs-up
  comment      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists feedback_user_idx
  on public.recording_feedback(user_id, created_at desc);

-- updated_at trigger reuses existing function
drop trigger if exists feedback_updated_at on public.recording_feedback;
create trigger feedback_updated_at
  before update on public.recording_feedback
  for each row execute function public.set_updated_at();

-- RLS: users see and edit only their own feedback
alter table public.recording_feedback enable row level security;

drop policy if exists "feedback_select_own" on public.recording_feedback;
create policy "feedback_select_own" on public.recording_feedback
  for select using (auth.uid() = user_id);

drop policy if exists "feedback_modify_own" on public.recording_feedback;
create policy "feedback_modify_own" on public.recording_feedback
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
