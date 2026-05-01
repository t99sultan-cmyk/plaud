"use client";

import { useState, useTransition } from "react";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createPromocode } from "@/lib/actions/promocodes";

const PLANS = [
  {
    id: "start",
    name: "Старт",
    minutes: 100,
    price: "1 990 ₸",
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
  const [maxUses, setMaxUses] = useState("1");
  const [generated, setGenerated] = useState<{
    code: string;
    plan: string;
    minutes: number;
    price: string;
    uses: number | "∞";
  } | null>(null);
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState(false);

  function generate(plan: typeof PLANS[number]) {
    const code = generateCode(plan.id);
    const usesNum = maxUses.trim() === "" ? null : parseInt(maxUses, 10);
    if (usesNum !== null && (Number.isNaN(usesNum) || usesNum < 1)) {
      toast.error("Укажи число ≥ 1 или оставь пустым для безлимита");
      return;
    }

    start(async () => {
      const res = await createPromocode({
        code,
        description: `Тариф «${plan.name}» · ${plan.minutes} мин · ${plan.price}${
          usesNum ? ` · ${usesNum} использований` : " · безлимит"
        }`,
        type: "free_minutes",
        free_minutes: plan.minutes,
        ...(usesNum !== null ? { max_uses: usesNum } : {}),
      });
      if ("error" in res) {
        toast.error(res.error);
      } else {
        setGenerated({
          code,
          plan: plan.name,
          minutes: plan.minutes,
          price: plan.price,
          uses: usesNum ?? "∞",
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
            Создаёт токен с минутами под выбранный пакет. Пришли клиенту в
            Telegram после оплаты в Kaspi.
          </p>
        </div>
      </div>

      {/* Max uses control */}
      <div className="mt-4 flex flex-wrap items-end gap-3 rounded-xl bg-card px-3.5 py-3">
        <div className="flex-1 min-w-[160px]">
          <Label htmlFor="quick-max-uses" className="text-xs">
            Сколько раз можно использовать
          </Label>
          <Input
            id="quick-max-uses"
            type="number"
            min={1}
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            placeholder="Безлимит"
            className="mt-1 h-8"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">
            Оставь пустым для безлимитного. По умолчанию 1 — для оплаты в Kaspi.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <PresetButton onClick={() => setMaxUses("1")} active={maxUses === "1"}>
            1× (Kaspi)
          </PresetButton>
          <PresetButton onClick={() => setMaxUses("5")} active={maxUses === "5"}>
            5×
          </PresetButton>
          <PresetButton onClick={() => setMaxUses("")} active={maxUses === ""}>
            ∞
          </PresetButton>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
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
              {p.price} · {maxUses ? `${maxUses}× использований` : "безлимит"}
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
            {generated.price} · использований: {generated.uses}
          </p>
        </div>
      )}
    </div>
  );
}

function PresetButton({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-2.5 py-1 text-xs transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
