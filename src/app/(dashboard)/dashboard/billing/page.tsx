import Link from "next/link";
import { ArrowRight, Clock, Sparkles, Check, History } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { availableMinutes, getUserCredits } from "@/lib/credits";
import { PromocodeWidget } from "@/components/dashboard/promocode-widget";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Тарифы и баланс — VoiceApp" };
export const dynamic = "force-dynamic";

const PLANS = [
  {
    id: "start",
    name: "Старт",
    price: "2 998 ₸",
    minutes: 200,
    perMin: "≈ 15 ₸ / мин",
  },
  {
    id: "regular",
    name: "Регулярно",
    price: "7 998 ₸",
    minutes: 800,
    perMin: "≈ 10 ₸ / мин",
    highlight: true,
  },
  {
    id: "active",
    name: "Активно",
    price: "19 998 ₸",
    minutes: 2500,
    perMin: "≈ 8 ₸ / мин",
  },
];

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const credits = await getUserCredits(supabase, user.id);
  const total = availableMinutes(credits);
  const free = credits?.free_minutes_remaining ?? 0;
  const paid = credits?.paid_minutes_remaining ?? 0;
  const expired =
    credits?.paid_minutes_expires_at &&
    new Date(credits.paid_minutes_expires_at) < new Date();
  const expiresIn =
    credits?.paid_minutes_expires_at && !expired
      ? Math.ceil(
          (new Date(credits.paid_minutes_expires_at).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        )
      : null;

  // Redemption history
  const { data: history } = await supabase
    .from("promocode_redemptions")
    .select("*")
    .order("redeemed_at", { ascending: false })
    .limit(20);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-4 py-6 animate-in fade-in slide-in-from-bottom-2 duration-500 md:px-6 md:py-8">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Тарифы и баланс
        </h1>
        <p className="text-sm text-muted-foreground">
          Минуты на счёте, история начислений и оформление подписки.
        </p>
      </div>

      {/* Balance card */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Clock className="size-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold tracking-tight tabular-nums">
                {total}
              </span>
              <span className="text-sm text-muted-foreground">
                {total === 1 ? "минута" : total < 5 ? "минуты" : "минут"} на счёте
              </span>
            </div>
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                <span className="text-muted-foreground">Бесплатные</span>
                <span className="font-medium tabular-nums">{free} мин</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                <span className="text-muted-foreground">Купленные</span>
                <span className="font-medium tabular-nums">
                  {paid} мин
                  {expiresIn !== null && paid > 0 && (
                    <span className="ml-1.5 text-[10px] text-muted-foreground">
                      · истекает через {expiresIn} дн
                    </span>
                  )}
                  {expired && paid > 0 && (
                    <span className="ml-1.5 text-[10px] text-rose-600">
                      · истекли
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Использовано всего:{" "}
              <span className="font-medium text-foreground tabular-nums">
                {credits?.total_minutes_used ?? 0} мин
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Promocode widget */}
      <PromocodeWidget />

      {/* Plans */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">
            Подписаться на ежемесячный пакет
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Оплата через Kaspi · активация одноразовым токеном · действует 30 дней
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          {PLANS.map((p) => (
            <Link
              key={p.id}
              href={`/checkout?plan=${p.id}`}
              className={cn(
                "group relative flex flex-col rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md",
                p.highlight
                  ? "border-primary/40 shadow-sm shadow-primary/10"
                  : "border-border/60 hover:border-primary/30",
              )}
            >
              {p.highlight && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-primary to-fuchsia-500 px-2.5 py-0.5 text-[10px] font-medium text-white">
                  Популярно
                </span>
              )}
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold tracking-tight">{p.name}</h3>
                <span className="text-xs text-muted-foreground">
                  {p.minutes} мин
                </span>
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-tight">
                {p.price}
                <span className="ml-1 text-xs text-muted-foreground">/мес</span>
              </div>
              <div className="mt-1 text-xs text-primary">{p.perMin}</div>
              <span
                className={cn(
                  buttonVariants({
                    variant: p.highlight ? "default" : "outline",
                    size: "sm",
                  }),
                  "mt-4 w-full gap-1.5",
                )}
              >
                Подписаться
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <History className="size-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold tracking-tight">
            История начислений
          </h2>
        </div>
        {!history || history.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/60 bg-card px-5 py-8 text-center text-sm text-muted-foreground">
            Пока пусто. После активации первого токена тут появится запись.
          </p>
        ) : (
          <ul className="overflow-hidden rounded-xl border border-border/60 bg-card">
            {history.map((h, i) => (
              <li
                key={h.id}
                className={cn(
                  "flex items-center justify-between gap-3 px-5 py-3 text-sm",
                  i < history.length - 1 && "border-b border-border/60",
                )}
              >
                <span className="flex items-center gap-2">
                  <Check className="size-3.5 text-emerald-500" />
                  <span>+{h.granted_minutes ?? 0} минут</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(h.redeemed_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
