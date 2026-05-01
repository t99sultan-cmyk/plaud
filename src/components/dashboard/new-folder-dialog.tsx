"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createFolder } from "@/lib/actions/folders";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function NewFolderDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый проект</DialogTitle>
          <DialogDescription>
            Объедини записи по теме — встречи, лекции, интервью.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(fd) => {
            start(async () => {
              const res = await createFolder(fd);
              if (res?.error) {
                toast.error(res.error);
              } else {
                toast.success("Проект создан");
                setOpen(false);
              }
            });
          }}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Название проекта</Label>
            <Input
              id="name"
              name="name"
              required
              maxLength={80}
              placeholder="Например: Встречи команды"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Создаём…" : "Создать проект"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
