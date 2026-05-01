# Plaud Web

Свой клон Plaud: загружаешь аудио → автоматическая транскрипция → краткое содержание → чат с Claude по содержимому записи.

## Стек

- **Next.js 16** (App Router) + TypeScript + Tailwind v4 + shadcn/ui
- **Supabase** — Postgres + Storage + Auth (email/пароль)
- **OpenAI Whisper API** — транскрипция (с silence-aware chunking для длинных файлов)
- **Anthropic Claude Sonnet 4.6** — summary + Q&A с prompt caching
- **Inngest** — фоновые задачи транскрипции/саммаризации (durable steps, fan-out, retry)
- **ffmpeg** — нарезка аудио на ≤24MB chunks под лимит Whisper

## Что нужно настроить перед запуском

1. **Supabase project** — https://supabase.com → New Project
   - Применить миграцию: `supabase/migrations/0001_init.sql` (через SQL Editor или `supabase db push`)
   - Создать private bucket `recordings` (миграция уже это делает)
   - Скопировать URL и ключи из Settings → API

2. **OpenAI API key** — https://platform.openai.com/api-keys

3. **Anthropic API key** — https://console.anthropic.com/settings/keys

4. **Inngest** — https://app.inngest.com → создать app → скопировать Event Key + Signing Key
   - Для локальной разработки: `npx inngest-cli@latest dev`

5. **ffmpeg** — `brew install ffmpeg` локально. Для прода нужен Docker worker (см. ниже).

6. Скопировать `.env.local.example` → `.env.local` и заполнить.

## Локальный запуск

```bash
npm install
cp .env.local.example .env.local   # заполни ключи
npm run dev
```

В отдельном терминале для Inngest:

```bash
npx inngest-cli@latest dev
```

Открой http://localhost:3000 → зарегистрируйся → загрузи аудио.

## Production деплой

- **Frontend (Next.js)** — Vercel. Все env vars из `.env.local.example` в Vercel Settings → Environment Variables.
- **Inngest worker с ffmpeg** — Vercel serverless не годится для длинной транскрипции (timeout) и не имеет ffmpeg в рантайме. Подними отдельный worker на **Fly.io** с Dockerfile, где `apt-get install ffmpeg`. Worker обрабатывает только функции из `src/lib/inngest/functions/`. UI остаётся на Vercel.
- **Supabase** — деплой миграций: `supabase link` + `supabase db push`.

## Архитектура

```
app/
├─ (auth)/{login,signup}        — auth страницы
├─ auth/callback/route.ts       — Supabase email confirm
├─ (dashboard)/                  — защищённые роуты (middleware гонит на /login)
│  ├─ dashboard/page.tsx        — все записи
│  ├─ dashboard/folders/[id]    — записи в папке
│  └─ dashboard/recordings/[id] — плеер + транскрипт + сводка + чат
└─ api/
   ├─ chat/[recordingId]/       — стриминг Claude (SSE)
   └─ inngest/                  — webhook handler

lib/
├─ supabase/{client,server,admin,middleware}.ts
├─ ai/{whisper,claude,summarize,chat}.ts
├─ audio/{ffmpeg,chunker,stitch}.ts
└─ inngest/functions/{transcribe,summarize}.ts
```

### Поток обработки записи

1. Браузер `POST /api/recordings/init` (server action) → row в `recordings` + signed upload URL
2. Браузер `PUT` файла напрямую в Supabase Storage (без прокси)
3. Браузер `POST /api/recordings/[id]/finalize` → status=`queued` + `inngest.send('recording.uploaded')`
4. **Inngest** `transcribeRecording`: download → ffmpeg chunk → Whisper параллельно → stitch → status=`summarizing`
5. **Inngest** `summarizeRecording`: Claude → JSON сводка → status=`ready`
6. UI получает обновления через Supabase Realtime подписку на `recordings`

### Q&A чат

`POST /api/chat/[recordingId]` → загружает транскрипт + историю → Claude `messages.stream()` с `cache_control: ephemeral` на блок транскрипта → SSE-стрим в браузер → сохранение `user` + `assistant` сообщений.

## Стоимость (за час аудио)

- Whisper транскрипция: $0.36
- Claude саммари: ~$0.05
- Claude чат (cached follow-ups): ~$0.011/вопрос
- **Итого с 10 вопросами: ~$0.57/час** против $30/мес у Plaud

## TODO / nice-to-have

- [ ] Speaker diarization (через AssemblyAI или WhisperX)
- [ ] Поиск по всем транскриптам (pgvector + embeddings)
- [ ] Экспорт PDF / Markdown / .srt
- [ ] Запись с микрофона прямо в браузере
- [ ] Шаринг записи по ссылке
- [ ] Multi-folder (запись может быть в нескольких папках)
- [ ] Темная тема (toggle)
