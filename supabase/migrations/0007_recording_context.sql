-- Per-recording transcription hints
--   `context`  — free-form description ("звонок про маркетинг с Асель",
--                "лекция по биологии"). Forwarded to AssemblyAI as word_boost
--                terms and to Claude as system context for post-correction.
--   `language` — explicit ISO code ("ru", "en", "kk") to skip auto-detection
--                when the user knows the language. NULL means auto-detect.

alter table public.recordings
  add column if not exists context  text,
  add column if not exists language text;
