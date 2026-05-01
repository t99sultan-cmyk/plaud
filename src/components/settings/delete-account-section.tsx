"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteAccount } from "@/lib/actions/account";

export function DeleteAccountSection({ email }: { email: string }) {
  const [confirm, setConfirm] = useState("");
  const [pending, start] = useTransition();

  const canDelete = confirm === email;

  return (
    <div className="space-y-3">
      <div className="rounded-md bg-rose-500/5 px-3 py-2.5 text-xs leading-relaxed text-rose-900 dark:text-rose-200">
        Это действие <strong>необратимо</strong>. После удаления:
        <ul className="mt-2 list-disc space-y-0.5 pl-4">
          <li>Все аудио-файлы в Storage стираются</li>
          <li>Все транскрипты, сводки и чаты удаляются из БД</li>
          <li>Баланс минут аннулируется (без возврата средств)</li>
          <li>Email освобождается — можно снова зарегистрироваться</li>
        </ul>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirm" className="text-xs text-muted-foreground">
          Чтобы подтвердить, введи свой email:{" "}
          <code className="rounded bg-muted px-1 font-mono">{email}</code>
        </Label>
        <Input
          id="confirm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder={email}
        />
      </div>

      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={!canDelete || pending}
        onClick={() => {
          if (
            !confirm.length ||
            !window.confirm("Точно удалить аккаунт навсегда? Действие нельзя отменить.")
          )
            return;
          start(async () => {
            const res = await deleteAccount();
            if (res && "error" in res) toast.error(res.error);
          });
        }}
        className="gap-2"
      >
        {pending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Trash2 className="size-3.5" />
        )}
        Удалить аккаунт навсегда
      </Button>
    </div>
  );
}
