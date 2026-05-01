"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signUpWithPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "./google-button";

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  if (done) {
    return (
      <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-4 text-sm">
        <p>Проверь почту — мы отправили ссылку для подтверждения.</p>
        <p className="text-muted-foreground">
          Не пришло за минуту? Загляни в Спам или зарегистрируйся через Google.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <GoogleButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-card px-2 text-muted-foreground">или email</span>
        </div>
      </div>

      <form
        action={(fd) => {
          setError(null);
          start(async () => {
            const res = await signUpWithPassword(fd);
            if (res?.error) setError(res.error);
            else if (res?.ok) setDone(true);
          });
        }}
        className="grid gap-4"
      >
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground">Минимум 8 символов.</p>
        </div>
        {error && (
          <p
            className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Создаём…" : "Создать аккаунт"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Войти
        </Link>
      </p>
    </div>
  );
}
