"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changeEmail } from "@/lib/actions/account";

export function ChangeEmailForm({ currentEmail }: { currentEmail: string }) {
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <form
      action={(fd) => {
        start(async () => {
          const res = await changeEmail(fd);
          if ("error" in res) {
            toast.error(res.error);
          } else {
            toast.success("На новый email отправлено подтверждение");
            setDone(true);
          }
        });
      }}
      className="grid gap-3"
    >
      <div className="grid gap-2">
        <Label htmlFor="email" className="text-xs text-muted-foreground">
          Новый email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={currentEmail}
          required
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending} size="sm">
          {pending ? "Сохраняем…" : "Изменить email"}
        </Button>
        {done && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400">
            Письмо отправлено
          </span>
        )}
      </div>
    </form>
  );
}
