"use client";

import { useState, useTransition } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { renameRecording } from "@/lib/actions/recordings";
import { cn } from "@/lib/utils";

export function InlineTitleEdit({
  recordingId,
  initialTitle,
}: {
  recordingId: string;
  initialTitle: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialTitle);
  const [pending, start] = useTransition();

  function save() {
    const trimmed = value.trim();
    if (!trimmed || trimmed === initialTitle) {
      setEditing(false);
      setValue(initialTitle);
      return;
    }
    start(async () => {
      const res = await renameRecording(recordingId, trimmed);
      if ("error" in res) {
        toast.error(res.error);
        setValue(initialTitle);
      } else {
        toast.success("Название обновлено");
        router.refresh();
      }
      setEditing(false);
    });
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={value}
          maxLength={200}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") {
              setEditing(false);
              setValue(initialTitle);
            }
          }}
          className={cn(
            "min-w-0 flex-1 rounded-md border border-primary/40 bg-background px-2 py-1",
            "text-3xl font-semibold tracking-tight outline-none ring-2 ring-primary/20",
            "focus:border-primary",
          )}
          disabled={pending}
        />
        <button
          type="button"
          onClick={save}
          disabled={pending}
          aria-label="Сохранить"
          className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Check className="size-4" />
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setValue(initialTitle);
          }}
          aria-label="Отмена"
          className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="group inline-flex items-center gap-2 text-left"
      aria-label="Изменить название"
    >
      <h1 className="flex-1 text-3xl font-semibold tracking-tight">
        {initialTitle}
      </h1>
      <Pencil className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
