"use client";

import { useRef, useState } from "react";
import { AudioPlayer, type AudioPlayerHandle } from "./audio-player";
import { cn, formatDuration } from "@/lib/utils";
import type { TranscriptSegment } from "@/types/domain";

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

  return (
    <div className="space-y-4">
      <AudioPlayer
        ref={playerRef}
        src={audioUrl}
        duration={durationSec}
        onTimeUpdate={setCurrentTime}
      />
      {segments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Транскрипт пока не готов.
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <ul className="max-h-[60vh] divide-y divide-border overflow-y-auto">
            {segments.map((seg, idx) => (
              <li key={seg.id}>
                <button
                  type="button"
                  onClick={() => playerRef.current?.seek(seg.start)}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent/40",
                    idx === activeIdx && "bg-primary/10",
                  )}
                >
                  <span className="mt-0.5 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                    {formatDuration(seg.start)}
                  </span>
                  <span className="text-sm leading-relaxed">{seg.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
