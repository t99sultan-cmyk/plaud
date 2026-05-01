"use client";

import { useState, useTransition } from "react";
import { Tag, Sparkles, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { redeemPromocode } from "@/lib/actions/promocodes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function PromocodeWidget() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [pending, start] = useTransition();

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      className="rounded-xl border border-border/60 bg-card transition-colors open:border-primary/30"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2.5 px-4 py-3">
        <Tag className="size-4 text-primary" />
        <span className="text-sm font-medium">У тебя есть промокод?</span>
        <span className="ml-auto text-xs text-muted-foreground">
          Введи и получи бонусные минуты
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </summary>
      <div className="border-t border-border/60 px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!code.trim()) return;
            start(async () => {
              const res = await redeemPromocode({ code: code.trim() });
              if ("error" in res) {
                toast.error(res.error);
              } else {
                toast.success(
                  res.granted_minutes
                    ? `+${res.granted_minutes} минут на счёт!`
                    : "Код применён",
                  { icon: "✨" },
                );
                setCode("");
                setOpen(false);
              }
            });
          }}
          className="flex gap-2"
        >
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="LAUNCH50"
            className="font-mono uppercase"
            maxLength={40}
            disabled={pending}
            autoFocus
          />
          <Button type="submit" disabled={pending || !code.trim()}>
            <Sparkles className="size-3.5" />
            Применить
          </Button>
        </form>
      </div>
    </details>
  );
}
