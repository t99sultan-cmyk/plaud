"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/lib/actions/account";

export function ChangePasswordForm() {
  const [pending, start] = useTransition();
  const [password, setPassword] = useState("");

  return (
    <form
      action={(fd) => {
        start(async () => {
          const res = await changePassword(fd);
          if ("error" in res) {
            toast.error(res.error);
          } else {
            toast.success("Пароль обновлён");
            setPassword("");
          }
        });
      }}
      className="grid gap-3"
    >
      <div className="grid gap-2">
        <Label htmlFor="password" className="text-xs text-muted-foreground">
          Новый пароль
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>
      <Button
        type="submit"
        disabled={pending || password.length < 8}
        size="sm"
        className="justify-self-start"
      >
        {pending ? "Сохраняем…" : "Изменить пароль"}
      </Button>
    </form>
  );
}
