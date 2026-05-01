"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Pause, Play, Loader2 } from "lucide-react";
import WaveSurfer from "wavesurfer.js";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [actualDuration, setActualDuration] = useState<number | null>(
    duration ?? null,
  );

  // Initialize WaveSurfer
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "rgba(140, 110, 230, 0.4)",
      progressColor: "rgb(140, 110, 230)",
      cursorColor: "transparent",
      barWidth: 2,
      barRadius: 3,
      barGap: 2,
      height: 56,
      normalize: true,
      interact: true,
    });
    wsRef.current = ws;

    ws.load(src);

    ws.on("ready", () => {
      setLoaded(true);
      setActualDuration(ws.getDuration());
    });
    ws.on("play", () => setPlaying(true));
    ws.on("pause", () => setPlaying(false));
    ws.on("finish", () => setPlaying(false));
    ws.on("timeupdate", (t) => {
      setCurrent(t);
      onTimeUpdate?.(t);
    });

    return () => {
      ws.destroy();
      wsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useImperativeHandle(ref, () => ({
    seek: (sec: number) => {
      const ws = wsRef.current;
      if (!ws || !loaded) return;
      const total = ws.getDuration();
      if (total > 0) ws.seekTo(Math.min(sec, total) / total);
      // Do NOT autoplay on seek — let user decide when to play.
      // (Click on segment = "show me the moment", not "play it now")
    },
  }));

  const totalSec = actualDuration ?? duration ?? 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="default"
          disabled={!loaded}
          onClick={() => {
            const ws = wsRef.current;
            if (!ws || !loaded) return;
            if (ws.isPlaying()) ws.pause();
            else ws.play();
          }}
          className="size-10 shrink-0 rounded-full shadow-md shadow-primary/20"
        >
          {!loaded ? (
            <Loader2 className="size-4 animate-spin" />
          ) : playing ? (
            <Pause className="size-4 fill-current" />
          ) : (
            <Play className="size-4 fill-current" />
          )}
        </Button>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div ref={containerRef} className="w-full" />
          <div className="flex items-center justify-between text-[10px] tabular-nums text-muted-foreground">
            <span>{formatDuration(current)}</span>
            <span>{formatDuration(totalSec)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
