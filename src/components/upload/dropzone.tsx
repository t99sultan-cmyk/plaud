"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ChevronDown, Sparkles, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpload, type UploadLanguage } from "@/hooks/use-upload";
import { UploadQueue } from "./upload-queue";

// AssemblyAI accepts both audio and video (extracts audio automatically).
// Listing common extensions explicitly because browsers report m4a/mov MIME
// types inconsistently (audio/x-m4a vs audio/mp4 vs application/octet-stream).
const ACCEPT = {
  "audio/*": [".mp3", ".m4a", ".wav", ".ogg", ".webm", ".flac", ".aac", ".aiff", ".opus", ".wma"],
  "video/*": [".mp4", ".mov", ".m4v", ".mkv", ".webm", ".avi", ".3gp"],
};

const LANGUAGE_OPTIONS: { value: UploadLanguage; label: string }[] = [
  { value: "ru", label: "Русский" },
  { value: "en", label: "English" },
  { value: "kk", label: "Қазақша" },
  { value: "auto", label: "Авто-определение" },
];

export function Dropzone({ folderId }: { folderId: string | null }) {
  const { items, enqueue } = useUpload(folderId);
  const [context, setContext] = useState("");
  const [language, setLanguage] = useState<UploadLanguage>("ru");
  const [optionsOpen, setOptionsOpen] = useState(false);

  const onDrop = useCallback(
    (files: File[]) => {
      const opts = { context: context.trim() || undefined, language };
      files.forEach((f) => enqueue(f, opts));
    },
    [enqueue, context, language],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: 500 * 1024 * 1024,
    noClick: true,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "group relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card px-6 py-14 text-center transition-colors hover:border-primary/40 hover:bg-accent/30",
          isDragActive && "border-primary bg-primary/5",
        )}
      >
        <input {...getInputProps()} />
        <div
          className={cn(
            "flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform",
            isDragActive && "scale-110",
          )}
        >
          <UploadCloud className="size-6" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-medium">
            {isDragActive
              ? "Отпусти, чтобы загрузить"
              : "Перетащи аудио сюда"}
          </p>
          <p className="text-sm text-muted-foreground">
            или{" "}
            <button
              type="button"
              onClick={open}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              выбери файл с компьютера
            </button>
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Аудио (mp3, m4a, wav, ogg, flac, aac) или видео (mp4, mov, mkv)
          &nbsp;·&nbsp; до 500 MB · до 8 часов
        </p>
        <p className="max-w-md text-xs text-muted-foreground/70">
          Из видео извлечём звуковую дорожку автоматически. Время обработки
          ≈ 15% от длины: 1 час → ~9 мин, 3 часа → ~27 мин.
        </p>
      </div>

      <details
        open={optionsOpen}
        onToggle={(e) => setOptionsOpen((e.target as HTMLDetailsElement).open)}
        className="rounded-xl border border-border/60 bg-card/50"
      >
        <summary
          className={cn(
            "flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium",
            "transition-colors hover:bg-accent/30",
          )}
        >
          <Sparkles className="size-4 text-primary" />
          <span>Подсказать языку и точности</span>
          <span className="ml-auto flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
            {LANGUAGE_OPTIONS.find((o) => o.value === language)?.label}
            {context.trim() && <span>· контекст указан</span>}
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform",
                optionsOpen && "rotate-180",
              )}
            />
          </span>
        </summary>
        <div className="space-y-3 border-t border-border/60 px-4 pb-4 pt-3">
          <div>
            <label className="text-xs font-medium text-foreground/80">
              Язык записи
            </label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {LANGUAGE_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setLanguage(o.value)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs transition-colors",
                    language === o.value
                      ? "border-primary/50 bg-primary/10 text-foreground"
                      : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Указывай язык явно — распознавание заметно точнее. «Авто» оставь
              только если в записи мешают разные языки.
            </p>
          </div>

          <div>
            <label htmlFor="dz-context" className="text-xs font-medium text-foreground/80">
              О чём запись? <span className="text-muted-foreground">(необязательно)</span>
            </label>
            <textarea
              id="dz-context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={2}
              maxLength={2000}
              placeholder="Например: звонок с Асель по таргету, упоминаются Aicreative, Kaspi, Meta, Pixel ID 1234"
              className={cn(
                "mt-1.5 block w-full resize-none rounded-md border border-border/60 bg-background px-3 py-2 text-sm",
                "placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20",
              )}
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Имена, термины, проекты, аббревиатуры — Plaud учтёт их при распознавании
              и при автоматическом исправлении опечаток.
            </p>
          </div>
        </div>
      </details>

      {items.length > 0 && <UploadQueue items={items} />}
    </div>
  );
}
