"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  FileAudio,
  FolderInput,
  Loader2,
  MoreHorizontal,
  RotateCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDuration, formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteRecording,
  retryTranscription,
} from "@/lib/actions/recordings";
import { StatusBadge } from "./status-badge";
import { SwipeableRow } from "./swipeable-row";
import { MoveRecordingDialog } from "./move-recording-dialog";
import type { Folder as FolderRow, Recording } from "@/types/domain";

export function RecordingList({
  initial,
  folders = [],
}: {
  initial: Recording[];
  folders?: FolderRow[];
}) {
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
      {recordings.map((r) => (
        <li key={r.id}>
          <RecordingListRow recording={r} folders={folders} />
        </li>
      ))}
    </ul>
  );
}

function RecordingListRow({
  recording,
  folders,
}: {
  recording: Recording;
  folders: FolderRow[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [moveOpen, setMoveOpen] = useState(false);

  const inProgress =
    recording.status === "queued" ||
    recording.status === "transcribing" ||
    recording.status === "summarizing" ||
    recording.status === "uploading";
  const failed = recording.status === "failed";

  function doDelete() {
    if (!confirm(`Удалить «${recording.title}»? Это действие нельзя отменить.`)) {
      return;
    }
    start(async () => {
      const r = await deleteRecording(recording.id);
      if (r?.error) {
        toast.error(r.error);
      } else {
        toast.success("Запись удалена");
        router.refresh();
      }
    });
  }

  function doRetry() {
    start(async () => {
      const r = await retryTranscription(recording.id);
      if ("error" in r) toast.error(r.error);
      else {
        toast.success("Запустили повторную транскрипцию");
        router.refresh();
      }
    });
  }

  return (
    <>
      <SwipeableRow
        className={cn(
          "border border-border/60 bg-card transition-all duration-200",
          pending && "opacity-50",
          "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
        )}
        actionButton={
          <button
            type="button"
            disabled={pending}
            onClick={doDelete}
            className="flex h-full w-full flex-col items-center justify-center gap-1 bg-rose-600 px-2 text-xs font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
            aria-label="Удалить запись"
          >
            <Trash2 className="size-5" />
            <span>Удалить</span>
          </button>
        }
      >
        <div className="flex items-center gap-2 bg-card pr-1.5">
          <Link
            href={`/dashboard/recordings/${recording.id}`}
            className="group flex flex-1 items-center gap-4 rounded-xl px-4 py-3.5 outline-none transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <div
              className={cn(
                "relative flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                inProgress && "bg-primary/10 text-primary",
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
              {inProgress && (
                <span className="absolute inset-0 -z-10 rounded-xl bg-primary/15 animate-pulse" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{recording.title}</p>
              <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3" />
                <span className="tabular-nums">
                  {formatDuration(recording.duration_sec)}
                </span>
                <span aria-hidden>·</span>
                <span>{formatRelativeTime(recording.created_at)}</span>
                {recording.error_message && (
                  <>
                    <span aria-hidden>·</span>
                    <span className="text-destructive">{recording.error_message}</span>
                  </>
                )}
              </p>
            </div>
            <StatusBadge status={recording.status} />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={pending}
                  aria-label="Действия с записью"
                  className="size-9 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              {failed && (
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    doRetry();
                  }}
                >
                  <RotateCw className="mr-2 size-4" />
                  Повторить транскрипцию
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setMoveOpen(true);
                }}
              >
                <FolderInput className="mr-2 size-4" />
                Переместить в проект
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  doDelete();
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SwipeableRow>

      <MoveRecordingDialog
        open={moveOpen}
        onOpenChange={setMoveOpen}
        recordingId={recording.id}
        currentFolderId={recording.folder_id}
        folders={folders}
      />
    </>
  );
}
