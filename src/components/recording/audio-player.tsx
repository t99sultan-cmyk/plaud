"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/utils";

export interface AudioPlayerHandle {
  seek: (sec: number) => void;
}

export const AudioPlayer = forwardRef<
  AudioPlayerHandle,
  {
    src: string;
    onTimeUpdate?: (sec: number) => void;
    duration?: number | null;
  }
>(function AudioPlayer({ src, onTimeUpdate, duration }, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);

  useImperativeHandle(ref, () => ({
    seek: (sec: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = sec;
        audioRef.current.play().catch(() => {});
      }
    },
  }));

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="default"
          onClick={() => {
            const a = audioRef.current;
            if (!a) return;
            if (a.paused) a.play();
            else a.pause();
          }}
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </Button>
        <div className="flex flex-1 items-center gap-2 text-xs text-muted-foreground tabular-nums">
          <span>{formatDuration(current)}</span>
          <input
            type="range"
            min={0}
            max={duration ?? 0}
            step={0.1}
            value={current}
            onChange={(e) => {
              const sec = Number(e.target.value);
              if (audioRef.current) audioRef.current.currentTime = sec;
            }}
            className="flex-1 accent-primary"
          />
          <span>{formatDuration(duration)}</span>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime;
          setCurrent(t);
          onTimeUpdate?.(t);
        }}
      />
    </div>
  );
});
