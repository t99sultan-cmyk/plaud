-- Public share for recordings.
-- Owner generates a random share_token (UUID). Anyone with the link reads
-- transcript + summary in read-only mode through a server-side public endpoint
-- (bypasses RLS via service role + token validation).

alter table public.recordings
  add column if not exists share_token text unique;

create index if not exists recordings_share_token_idx
  on public.recordings(share_token)
  where share_token is not null;
