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
          <DialogTitle>Новая папка</DialogTitle>
          <DialogDescription>Группируй записи по теме или дате.</DialogDescription>
        </DialogHeader>
        <form
          action={(fd) => {
            start(async () => {
              const res = await createFolder(fd);
              if (res?.error) {
                toast.error(res.error);
              } else {
                toast.success("Папка создана");
                setOpen(false);
              }
            });
          }}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Название</Label>
            <Input id="name" name="name" required maxLength={80} placeholder="Встречи" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Создаём…" : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
