"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, FileAudio } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDuration, formatRelativeTime } from "@/lib/utils";
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
      <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
        <FileAudio className="mx-auto size-10 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">
          Записей пока нет. Перетащи файл выше, чтобы начать.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-card">
      {recordings.map((r) => (
        <li key={r.id}>
          <Link
            href={`/dashboard/recordings/${r.id}`}
            className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-accent/40"
          >
            <FileAudio className="size-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{r.title}</p>
              <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {formatDuration(r.duration_sec)}
                <span>·</span>
                <span>{formatRelativeTime(r.created_at)}</span>
                {r.error_message && (
                  <>
                    <span>·</span>
                    <span className="text-destructive">{r.error_message}</span>
                  </>
                )}
              </p>
            </div>
            <StatusBadge status={r.status} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
