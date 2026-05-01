"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, RotateCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  deleteRecording,
  retryTranscription,
} from "@/lib/actions/recordings";
import type { Recording } from "@/types/domain";

export function RecordingActions({ recording }: { recording: Recording }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon" disabled={pending}>
            <MoreHorizontal className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {recording.status === "failed" && (
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              start(async () => {
                const r = await retryTranscription(recording.id);
                if (r?.error) toast.error(r.error);
                else {
                  toast.success("Попытка повторной транскрипции");
                  router.refresh();
                }
              });
            }}
          >
            <RotateCw className="mr-2 size-4" />
            Повторить
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            if (!confirm(`Удалить «${recording.title}»?`)) return;
            start(async () => {
              const r = await deleteRecording(recording.id);
              if (r?.error) toast.error(r.error);
              else {
                toast.success("Удалено");
                router.push("/dashboard");
              }
            });
          }}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
