"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, FileAudio, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDuration, formatRelativeTime } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import type { Recording } from "@/types/domain";

export function RecordingList({ initial }: { initial: Recording[] }) {
  const router = useRouter();
  const [recordings, setRecordings] = useState(initial);

  useEffect(() => setRecordings(initial), [initial]);

  // Realtime: refresh when any recording row changes
  useEffect(() => {
    const supa = createClient();
    const channel = supa
      .channel("recordings-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "recordings" },
        () => router.refresh(),
      )
      .subscribe();
    return () => {
      supa.removeChannel(channel);
    };
  }, [router]);

  if (recordings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
        <FileAudio className="mx-auto size-9 text-muted-foreground/70" />
        <p className="mt-3 font-medium">Записей пока нет</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Перетащи аудио в зону выше, чтобы начать.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-2.5">
      {recordings.map((r) => {
        const inProgress =
          r.status === "queued" ||
          r.status === "transcribing" ||
          r.status === "summarizing" ||
          r.status === "uploading";
        const failed = r.status === "failed";

        return (
          <li key={r.id}>
            <Link
              href={`/dashboard/recordings/${r.id}`}
              className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div
                className={cn(
                  "relative flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                  inProgress &&
                    "bg-primary/10 text-primary",
                  failed && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                  !inProgress &&
                    !failed &&
                    "bg-gradient-to-br from-primary/15 to-fuchsia-500/10 text-primary",
                )}
              >
                {inProgress ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <FileAudio className="size-5" />
                )}
                {/* Subtle pulse for in-progress */}
                {inProgress && (
                  <span className="absolute inset-0 -z-10 rounded-xl bg-primary/15 animate-pulse" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{r.title}</p>
                <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  <span className="tabular-nums">{formatDuration(r.duration_sec)}</span>
                  <span aria-hidden>·</span>
                  <span>{formatRelativeTime(r.created_at)}</span>
                  {r.error_message && (
                    <>
                      <span aria-hidden>·</span>
                      <span className="text-destructive">{r.error_message}</span>
                    </>
                  )}
                </p>
              </div>
              <StatusBadge status={r.status} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
