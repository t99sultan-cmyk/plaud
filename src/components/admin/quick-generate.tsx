"use client";

import { useState, useTransition } from "react";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createPromocode } from "@/lib/actions/promocodes";

const PLANS = [
  {
    id: "start",
    name: "Старт",
    minutes: 200,
    price: "2 998 ₸",
    color: "from-emerald-400/20 to-emerald-600/20 text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "regular",
    name: "Регулярно",
    minutes: 800,
    price: "7 998 ₸",
    color: "from-sky-400/20 to-sky-600/20 text-sky-700 dark:text-sky-300",
  },
  {
    id: "active",
    name: "Активно",
    minutes: 2500,
    price: "19 998 ₸",
    color: "from-fuchsia-400/20 to-fuchsia-600/20 text-fuchsia-700 dark:text-fuchsia-300",
  },
];

const PREFIX = "VAPP";

function generateCode(planId: string): string {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = (n: number) => {
    let s = "";
    for (let i = 0; i < n; i++) s += charset[Math.floor(Math.random() * charset.length)];
    return s;
  };
  return `${PREFIX}-${planId.slice(0, 3).toUpperCase()}-${part(4)}-${part(4)}`;
}

export function QuickGenerate() {
  const router = useRouter();
  const [generated, setGenerated] = useState<{
    code: string;
    plan: string;
    minutes: number;
    price: string;
  } | null>(null);
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState(false);

  function generate(plan: typeof PLANS[number]) {
    const code = generateCode(plan.id);
    start(async () => {
      const res = await createPromocode({
        code,
        description: `Тариф «${plan.name}» · ${plan.minutes} мин · ${plan.price}`,
        type: "free_minutes",
        free_minutes: plan.minutes,
        max_uses: 1, // одноразовый по умолчанию
      });
      if ("error" in res) {
        toast.error(res.error);
      } else {
        setGenerated({
          code,
          plan: plan.name,
          minutes: plan.minutes,
          price: plan.price,
        });
        toast.success(`Создан токен ${code}`);
        router.refresh();
      }
    });
  }

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="size-4" />
        </span>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">Быстрая генерация под тариф</h3>
          <p className="text-xs text-muted-foreground">
            Создаёт одноразовый токен с минутами под выбранный пакет.
            После оплаты в Kaspi отправь токен клиенту в Telegram.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {PLANS.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={pending}
            onClick={() => generate(p)}
            className={cn(
              "group flex flex-col items-start gap-1.5 rounded-xl border border-border/60 bg-card px-3.5 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md disabled:opacity-50",
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-sm font-medium">{p.name}</span>
              <span
                className={cn(
                  "rounded-full bg-gradient-to-br px-2 py-0.5 text-[10px] font-medium",
                  p.color,
                )}
              >
                {p.minutes} мин
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {p.price} · 1 использование
            </span>
          </button>
        ))}
      </div>

      {generated && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
            ✓ Токен создан — пришли клиенту в Telegram:
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 rounded-md bg-card px-3 py-2 font-mono text-sm">
              {generated.code}
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(generated.code);
                setCopied(true);
                toast.success("Скопировано");
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              Копировать
            </Button>
            {pending && <Loader2 className="size-4 animate-spin" />}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            <strong>Тариф «{generated.plan}»</strong> · {generated.minutes} мин ·{" "}
            {generated.price}
          </p>
        </div>
      )}
    </div>
  );
}
