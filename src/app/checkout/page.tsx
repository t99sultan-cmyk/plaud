import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CopyChip } from "@/components/checkout/copy-chip";
import { YandexMetrica } from "@/components/yandex-metrica";

export const metadata = {
  title: "Оплата подписки — VoiceApp",
  description:
    "Оплата через Kaspi и активация подписки одноразовым токеном поддержки.",
};

const KASPI_URL = "https://pay.kaspi.kz/pay/0p9drfes";
const SUPPORT_TG = "@voise_kz";
const SUPPORT_TG_URL = "https://t.me/voise_kz";

interface Plan {
  id: string;
  name: string;
  price: string;
  priceNumber: number;
  minutes: string;
  perMin: string;
  duration: string;
  features: string[];
}

const PLANS: Record<string, Plan> = {
  start: {
    id: "start",
    name: "Старт",
    price: "1 990 ₸",
    priceNumber: 1990,
    minutes: "100 минут",
    perMin: "≈ 20 ₸ / мин",
    duration: "1 месяц",
    features: [
      "100 минут на месяц",
      "Перенос остатка до 100 мин",
      "До 2 устройств",
      "Транскрипт + сводка + чат",
    ],
  },
  regular: {
    id: "regular",
    name: "Регулярно",
    price: "7 998 ₸",
    priceNumber: 7998,
    minutes: "800 минут",
    perMin: "≈ 10 ₸ / мин",
    duration: "1 месяц",
    features: [
      "800 минут на месяц (≈ 13 часов)",
      "Перенос остатка до 800 мин",
      "До 2 устройств · приоритет",
      "Все возможности приложения",
    ],
  },
  active: {
    id: "active",
    name: "Активно",
    price: "19 998 ₸",
    priceNumber: 19998,
    minutes: "2 500 минут",
    perMin: "≈ 8 ₸ / мин",
    duration: "1 месяц",
    features: [
      "2 500 минут (≈ 41 час) на месяц",
      "Минимальная цена-минута",
      "До 2 устройств",
      "Email-поддержка",
    ],
  },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: planId } = await searchParams;
  const plan = (planId && PLANS[planId]) || PLANS.start;

  return (
    <main className="min-h-svh bg-background">
      <YandexMetrica />
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Voice<span className="text-primary">App</span>
          </Link>
          <Link
            href="/#pricing"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← К тарифам
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Оформление подписки
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Тариф «{plan.name}»
          </h1>
          <p className="mt-2 text-muted-foreground">
            Оплата через Kaspi · активация одноразовым токеном · действует {plan.duration}
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_360px]">
          {/* Left: Steps */}
          <div className="space-y-4">
            <Step
              n={1}
              title="Оплати через Kaspi"
              icon={<CreditCard className="size-5" />}
            >
              <p className="text-sm text-muted-foreground">
                Сумма для оплаты:{" "}
                <span className="font-semibold text-foreground">
                  {plan.price}
                </span>{" "}
                за {plan.minutes} на {plan.duration}.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a
                  href={KASPI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: "default" }),
                    "gap-2",
                  )}
                >
                  Открыть Kaspi
                  <ArrowRight className="size-4" />
                </a>
                <CopyChip
                  label="Скопировать ссылку"
                  value={KASPI_URL}
                />
              </div>
            </Step>

            <Step
              n={2}
              title="Напиши в поддержку"
              icon={<MessageCircle className="size-5" />}
            >
              <p className="text-sm text-muted-foreground">
                Пришли скриншот чека и название тарифа («{plan.name}» · {plan.price})
                в Telegram-поддержку.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a
                  href={SUPPORT_TG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "default" }),
                    "gap-2",
                  )}
                >
                  <MessageCircle className="size-4" />
                  Написать {SUPPORT_TG}
                </a>
                <CopyChip
                  label={`Скопировать ${SUPPORT_TG}`}
                  value={SUPPORT_TG}
                />
              </div>
            </Step>

            <Step
              n={3}
              title="Получи одноразовый токен"
              icon={<Clock className="size-5" />}
            >
              <p className="text-sm text-muted-foreground">
                Поддержка проверит оплату и в ответе пришлёт{" "}
                <strong className="text-foreground">одноразовый токен</strong>{" "}
                — это код вида <code className="rounded bg-muted px-1.5 py-0.5 text-xs">VAPP-XXXX-XXXX</code>.
                Обычно занимает до 30 минут в рабочее время.
              </p>
            </Step>

            <Step
              n={4}
              title="Активируй токен в приложении"
              icon={<Check className="size-5" />}
            >
              <p className="text-sm text-muted-foreground">
                Зайди в дашборд и в блоке{" "}
                <span className="font-medium text-foreground">«У тебя есть промокод?»</span>{" "}
                введи полученный код. Минуты появятся на счёте мгновенно и будут
                действовать <strong className="text-foreground">{plan.duration}</strong>.
              </p>
              <div className="mt-4">
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "gap-2",
                  )}
                >
                  Открыть дашборд
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </Step>
          </div>

          {/* Right: Plan summary */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold tracking-tight">{plan.name}</h2>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  Выбранный тариф
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-semibold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/ мес</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {plan.minutes} · {plan.perMin}
                </div>
                <div className="text-xs text-primary">
                  Действует {plan.duration}
                </div>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
              <p className="font-medium">Это ручной процесс</p>
              <p className="mt-1">
                Автоматическая интеграция с Kaspi скоро будет. Пока активация
                занимает 5-30 минут — мы вручную проверяем оплату и присылаем
                токен. Это бережёт цены от наценок платёжных систем.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-4 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Сменить тариф?</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.values(PLANS)
                  .filter((p) => p.id !== plan.id)
                  .map((p) => (
                    <Link
                      key={p.id}
                      href={`/checkout?plan=${p.id}`}
                      className="rounded-full border border-border/60 px-2.5 py-1 hover:border-primary/40 hover:text-foreground"
                    >
                      {p.name} — {p.price}
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Step({
  n,
  title,
  icon,
  children,
}: {
  n: number;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 md:p-6">
      <div className="flex items-start gap-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {icon}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Шаг {n}
            </span>
          </div>
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
}
