"use client";

import { useState, useTransition } from "react";
import { FolderOpen, Inbox, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { moveRecording } from "@/lib/actions/recordings";
import type { Folder as FolderRow } from "@/types/domain";
import { cn } from "@/lib/utils";

export function MoveRecordingDialog({
  open,
  onOpenChange,
  recordingId,
  currentFolderId,
  folders,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  recordingId: string;
  currentFolderId: string | null;
  folders: FolderRow[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(currentFolderId);
  const [pending, start] = useTransition();

  function save() {
    start(async () => {
      const res = await moveRecording(recordingId, selected);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Перемещено");
        router.refresh();
        onOpenChange(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Переместить запись</DialogTitle>
          <DialogDescription>
            Выбери проект, в который переместить.
          </DialogDescription>
        </DialogHeader>

        <div className="grid max-h-72 gap-1.5 overflow-y-auto py-2">
          <SelectRow
            label="Все записи (без проекта)"
            icon={<Inbox className="size-4" />}
            active={selected === null}
            onClick={() => setSelected(null)}
          />
          {folders.length === 0 && (
            <p className="px-3 py-2 text-xs text-muted-foreground">
              У тебя ещё нет проектов. Создай в сайдбаре через «+».
            </p>
          )}
          {folders.map((f) => (
            <SelectRow
              key={f.id}
              label={f.name}
              icon={<FolderOpen className="size-4" />}
              active={selected === f.id}
              onClick={() => setSelected(f.id)}
            />
          ))}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Отмена
          </Button>
          <Button
            disabled={pending || selected === currentFolderId}
            onClick={save}
          >
            {pending && <Loader2 className="mr-2 size-3.5 animate-spin" />}
            Переместить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SelectRow({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-md border px-3 py-2 text-left text-sm transition-colors",
        active
          ? "border-primary/50 bg-primary/5 text-foreground"
          : "border-border/60 hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
      {active && (
        <span className="text-[10px] font-medium uppercase tracking-wider text-primary">
          Текущий
        </span>
      )}
    </button>
  );
}
