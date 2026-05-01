"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { renameFolder, deleteFolder } from "@/lib/actions/folders";

export function ProjectContextMenu({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [renameOpen, setRenameOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              className="size-5 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
              onClick={(e) => e.preventDefault()}
              aria-label="Действия с проектом"
            >
              <MoreHorizontal className="size-3" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setRenameOpen(true);
            }}
          >
            <Pencil className="mr-2 size-3.5" />
            Переименовать
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={async (e) => {
              e.preventDefault();
              if (
                !window.confirm(
                  `Удалить проект «${name}»?\n\nЗаписи внутри останутся в «Все записи» (без проекта).`,
                )
              )
                return;
              const r = await deleteFolder(id);
              if (r?.error) toast.error(r.error);
              else {
                toast.success("Проект удалён");
                router.push("/dashboard");
                router.refresh();
              }
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 size-3.5" />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        id={id}
        currentName={name}
        onDone={() => router.refresh()}
      />
    </>
  );
}

function RenameDialog({
  open,
  onOpenChange,
  id,
  currentName,
  onDone,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  id: string;
  currentName: string;
  onDone: () => void;
}) {
  const [value, setValue] = useState(currentName);
  const [pending, start] = useTransition();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Переименовать проект</DialogTitle>
          <DialogDescription>
            Новое название отобразится в сайдбаре сразу.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = value.trim();
            if (!trimmed || trimmed === currentName) {
              onOpenChange(false);
              return;
            }
            start(async () => {
              const res = await renameFolder(id, trimmed);
              if (res?.error) {
                toast.error(res.error);
              } else {
                toast.success("Проект переименован");
                onDone();
                onOpenChange(false);
              }
            });
          }}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="rename" className="text-xs text-muted-foreground">
              Название
            </Label>
            <Input
              id="rename"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={80}
              autoFocus
              required
            />
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
              type="submit"
              disabled={pending || !value.trim() || value.trim() === currentName}
            >
              {pending && <Loader2 className="mr-2 size-3.5 animate-spin" />}
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
