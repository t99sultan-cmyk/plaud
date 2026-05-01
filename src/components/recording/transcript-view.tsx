"use client";

import { useRef, useState } from "react";
import { AudioPlayer, type AudioPlayerHandle } from "./audio-player";
import { TranscriptSkeleton } from "./skeletons";
import { cn, formatDuration } from "@/lib/utils";
import type { TranscriptSegment } from "@/types/domain";

// Speaker letter (A, B, C…) → human label + color theme
const SPEAKER_THEMES: Record<string, { label: string; chip: string; bar: string }> = {
  A: { label: "Спикер 1", chip: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300", bar: "bg-emerald-500" },
  B: { label: "Спикер 2", chip: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300", bar: "bg-sky-500" },
  C: { label: "Спикер 3", chip: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300", bar: "bg-amber-500" },
  D: { label: "Спикер 4", chip: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300", bar: "bg-fuchsia-500" },
  E: { label: "Спикер 5", chip: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300", bar: "bg-rose-500" },
  F: { label: "Спикер 6", chip: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300", bar: "bg-indigo-500" },
};
const FALLBACK_THEME = {
  label: "Спикер ?",
  chip: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  bar: "bg-zinc-400",
};

function themeFor(speaker: string | null | undefined) {
  if (!speaker) return FALLBACK_THEME;
  return SPEAKER_THEMES[speaker] ?? FALLBACK_THEME;
}

export function TranscriptView({
  audioUrl,
  durationSec,
  segments,
}: {
  audioUrl: string;
  durationSec: number | null;
  segments: TranscriptSegment[];
}) {
  const playerRef = useRef<AudioPlayerHandle>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const activeIdx = segments.findIndex(
    (s) => currentTime >= s.start && currentTime < s.end,
  );

  const speakerCount = new Set(segments.map((s) => s.speaker).filter(Boolean)).size;

  return (
    <div className="space-y-4">
      <AudioPlayer
        ref={playerRef}
        src={audioUrl}
        duration={durationSec}
        onTimeUpdate={setCurrentTime}
      />

      {speakerCount > 1 && (
        <p className="text-xs text-muted-foreground">
          В записи распознано {speakerCount}{" "}
          {speakerCount === 1 ? "спикер" : speakerCount < 5 ? "спикера" : "спикеров"}
        </p>
      )}

      {segments.length === 0 ? (
        <TranscriptSkeleton />
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <ul className="max-h-[60vh] divide-y divide-border overflow-y-auto">
            {segments.map((seg, idx) => {
              const theme = themeFor(seg.speaker);
              const prevSpeaker = idx > 0 ? segments[idx - 1].speaker : null;
              const showSpeaker = seg.speaker && seg.speaker !== prevSpeaker;
              return (
                <li key={seg.id}>
                  <button
                    type="button"
                    onClick={() => playerRef.current?.seek(seg.start)}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent/40",
                      idx === activeIdx && "bg-primary/10",
                    )}
                  >
                    <span
                      className={cn("mt-1.5 h-3 w-1 shrink-0 rounded", theme.bar)}
                      aria-hidden
                    />
                    <span className="flex-1 space-y-1">
                      {showSpeaker && (
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                              theme.chip,
                            )}
                          >
                            {theme.label}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground tabular-nums">
                            {formatDuration(seg.start)}
                          </span>
                        </span>
                      )}
                      <span className="block text-sm leading-relaxed">{seg.text}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
