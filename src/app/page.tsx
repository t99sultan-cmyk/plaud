import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  FileAudio,
  FolderOpen,
  Globe2,
  Headphones,
  Languages,
  Lock,
  MessagesSquare,
  Mic,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { FadeIn, StaggerChildren, StaggerItem, HoverLift } from "@/components/landing/animated";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <main className="min-h-svh bg-background">
      <Header isLoggedIn={isLoggedIn} />
      <Hero />
      <Metrics />
      <UseCases />
      <Features />
      <Comparison />
      <Pricing />
      <Testimonial />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}

/* ─────────── HEADER ─────────── */

function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Voice<span className="text-primary">App</span>
        </Link>
        <nav className="flex items-center gap-1.5">
          <Link
            href="#use-cases"
            className="hidden px-3 py-2 text-sm text-muted-foreground hover:text-foreground sm:block"
          >
            Кейсы
          </Link>
          <Link
            href="#features"
            className="hidden px-3 py-2 text-sm text-muted-foreground hover:text-foreground sm:block"
          >
            Возможности
          </Link>
          <Link
            href="#pricing"
            className="hidden px-3 py-2 text-sm text-muted-foreground hover:text-foreground sm:block"
          >
            Цены
          </Link>
          <Link
            href="#faq"
            className="hidden px-3 py-2 text-sm text-muted-foreground hover:text-foreground sm:block"
          >
            FAQ
          </Link>
          <div className="ml-2 flex items-center gap-1.5">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
              >
                Открыть приложение
                <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  Войти
                </Link>
                <Link
                  href="/signup"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Начать бесплатно
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

/* ─────────── HERO ─────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-zinc-50">
      {/* Premium dark gradient bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.45 0.18 270 / 0.55), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 30%, oklch(0.6 0.2 320 / 0.25), transparent 70%)",
        }}
      />
      {/* Grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black, transparent 70%)",
        }}
      />
      {/* Top border glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 md:pt-28">
        <FadeIn className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-zinc-200">💜 Некоммерческий проект</span>
            <span className="text-zinc-500">·</span>
            <span className="text-primary">10 минут бесплатно</span>
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Твоя встреча длится час —{" "}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-200 bg-clip-text text-transparent">
              текст и сводку
            </span>{" "}
            получаешь за 6 минут
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-lg text-zinc-300">
            Сервис без подписок и навязчивых продаж. Загрузил аудио — получил
            транскрипт со спикерами, краткое содержание и чат по содержимому.
            Цена покрывает только API-провайдеров и хостинг.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-zinc-900 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/30"
            >
              Начать бесплатно
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#use-cases"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              Посмотреть кейсы
            </Link>
          </div>

          <p className="mt-4 text-xs text-zinc-400">
            Без карты · Загрузка за 30 секунд · Готовый текст через 3-5 минут
          </p>
        </FadeIn>

        {/* Free-trial selling block */}
        <FadeIn delay={0.15} className="mx-auto mt-12 max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md md:p-6">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/30 blur-3xl"
            />
            <div className="relative grid items-center gap-5 md:grid-cols-[auto_1fr_auto]">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-2xl font-bold text-white shadow-lg shadow-primary/40">
                  10
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">бесплатных минут</div>
                  <div className="text-xs text-zinc-400">сразу после регистрации</div>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                  Хватит на 1-2 коротких звонка или интервью
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                  Полный функционал: транскрипт, сводка, чат
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                  Без карты и скрытых платежей
                </li>
              </ul>
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30"
              >
                Получить
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.25} className="relative mx-auto mt-16 max-w-4xl">
          <div
            aria-hidden
            className="absolute -inset-x-8 -inset-y-8 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/40 via-fuchsia-500/30 to-transparent blur-3xl"
          />
          <MockTranscriptPreview />
        </FadeIn>
      </div>

      {/* Bottom fade to light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background"
      />
    </section>
  );
}

/* ─────────── METRICS BAR ─────────── */

function Metrics() {
  const items = [
    { icon: Clock, label: "<6 мин", sub: "обработка часа аудио" },
    { icon: Mic, label: "до 6 спикеров", sub: "распознаём автоматически" },
    { icon: Globe2, label: "93 языка", sub: "RU, KK, EN и больше" },
    { icon: ShieldCheck, label: "RLS + S3", sub: "приватные данные" },
  ];
  return (
    <section className="border-y border-border/60 bg-card/50">
      <StaggerChildren className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 gap-x-4 px-6 py-8 md:grid-cols-4">
        {items.map((it) => (
          <StaggerItem key={it.label} className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <it.icon className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">{it.label}</div>
              <div className="text-xs text-muted-foreground">{it.sub}</div>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  );
}

/* ─────────── USE CASES ─────────── */

function UseCases() {
  const cases = [
    {
      icon: Users,
      title: "Для команд",
      desc: "Не теряй контекст после встречи. Все решения, ответственные и дедлайны — в одном документе с цитатами.",
      tag: "Встречи команды",
    },
    {
      icon: Headphones,
      title: "Для рекрутеров",
      desc: "Запиши собеседование — получи структурированную сводку и сможешь сравнить нескольких кандидатов за 5 минут.",
      tag: "Интервью",
    },
    {
      icon: Sparkles,
      title: "Для контента",
      desc: "Сделал подкаст или лекцию — получи текст, тайм-кодами и темы для соц-сетей за минуты.",
      tag: "Подкаст · Лекция",
    },
  ];
  return (
    <section id="use-cases" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Кейсы использования
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Если ты тратишь время на расшифровку — VoiceApp нужен тебе
          </h2>
        </FadeIn>
        <StaggerChildren className="mt-12 grid gap-4 md:grid-cols-3" delay={0.1}>
          {cases.map((c) => (
            <StaggerItem key={c.title}>
              <HoverLift className="h-full rounded-2xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-lg">
                <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  {c.tag}
                </span>
                <div className="mt-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-fuchsia-500/10 text-primary">
                  <c.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {c.desc}
                </p>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

/* ─────────── FEATURES ─────────── */

function Features() {
  const features = [
    {
      icon: Mic,
      title: "Распознавание спикеров",
      desc: "Универсальная модель различает 2-6 голосов в записи. «Спикер 1», «Спикер 2», «Спикер 3» — с цветами и разными аватарками.",
    },
    {
      icon: Sparkles,
      title: "Краткое содержание",
      desc: "Claude Sonnet 4.6 за 10 секунд собирает TL;DR, ключевые пункты, выводы и темы. Не пересказ, а суть.",
    },
    {
      icon: MessagesSquare,
      title: "Чат по записи",
      desc: "«Что решили по бюджету?», «Кто что обещал?» — ассистент отвечает с прямыми цитатами из транскрипта.",
    },
    {
      icon: FolderOpen,
      title: "Проекты",
      desc: "Объединяй записи по теме: встречи команды, интервью кандидатов, лекции курса. Чистая навигация без хаоса.",
    },
    {
      icon: Lock,
      title: "Полная приватность",
      desc: "Postgres Row Level Security — только ты видишь свои записи. Файлы в приватном S3-хранилище.",
    },
    {
      icon: Languages,
      title: "Многоязычность",
      desc: "Русский, казахский, английский и ещё 90 языков. Автоопределение — не нужно ничего настраивать.",
    },
  ];
  return (
    <section id="features" className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Возможности
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Всё что нужно для работы со звуком
          </h2>
          <p className="mt-3 text-muted-foreground">
            От транскрипции до диалога с записью — за пару минут после загрузки.
          </p>
        </FadeIn>
        <StaggerChildren
          className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          delay={0.1}
        >
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <HoverLift className="h-full rounded-2xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-md">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mb-1.5 font-medium">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

/* ─────────── COMPARISON ─────────── */

function Comparison() {
  const rows: Array<{ feature: string; voice: boolean | string; plaud: boolean | string }> = [
    { feature: "Стоимость", voice: "20 ₸ / мин (без подписки)", plaud: "≈ 14 000 ₸ / мес" },
    { feature: "Поддержка казахского", voice: true, plaud: false },
    { feature: "Веб-приложение", voice: true, plaud: false },
    { feature: "Распознавание спикеров", voice: true, plaud: true },
    { feature: "Чат с содержимым записи", voice: true, plaud: false },
    { feature: "Без подписки — платишь за факт", voice: true, plaud: false },
    { feature: "Промокоды и бонусы", voice: true, plaud: false },
    { feature: "Нужна покупка устройства", voice: false, plaud: true },
  ];

  return (
    <section className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Сравнение
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Почему VoiceApp вместо Plaud
          </h2>
          <p className="mt-3 text-muted-foreground">
            Plaud — это аппаратный диктофон с подпиской ≈$30/мес. VoiceApp — веб без
            устройств, оплата по факту, родная поддержка казахского.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="grid grid-cols-[1fr_auto_auto] items-stretch">
            {/* Header */}
            <div className="border-b border-border/60 bg-muted/30 px-5 py-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Параметр
            </div>
            <div className="border-b border-border/60 bg-primary/10 px-5 py-4 text-center font-semibold tracking-tight text-primary">
              VoiceApp
            </div>
            <div className="border-b border-border/60 bg-muted/30 px-5 py-4 text-center text-sm font-medium text-muted-foreground">
              Plaud
            </div>

            {/* Rows */}
            {rows.map((r, i) => (
              <ComparisonRow
                key={r.feature}
                feature={r.feature}
                voice={r.voice}
                plaud={r.plaud}
                last={i === rows.length - 1}
              />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ComparisonRow({
  feature,
  voice,
  plaud,
  last,
}: {
  feature: string;
  voice: boolean | string;
  plaud: boolean | string;
  last: boolean;
}) {
  return (
    <>
      <div
        className={cn(
          "px-5 py-4 text-sm font-medium",
          !last && "border-b border-border/60",
        )}
      >
        {feature}
      </div>
      <div
        className={cn(
          "flex items-center justify-center bg-primary/5 px-5 py-4",
          !last && "border-b border-border/60",
        )}
      >
        <Cell value={voice} highlight />
      </div>
      <div
        className={cn(
          "flex items-center justify-center px-5 py-4",
          !last && "border-b border-border/60",
        )}
      >
        <Cell value={plaud} />
      </div>
    </>
  );
}

function Cell({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  if (value === true) {
    return (
      <span
        className={cn(
          "inline-flex size-5 items-center justify-center rounded-full text-white",
          highlight ? "bg-primary" : "bg-emerald-500",
        )}
      >
        <Check className="size-3" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <X className="size-3" />
      </span>
    );
  }
  return (
    <span className={cn("text-sm", highlight ? "font-semibold text-primary" : "text-muted-foreground")}>
      {value}
    </span>
  );
}

/* ─────────── PRICING ─────────── */

function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Цены
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Просто и без подписок
          </h2>
          <p className="mt-3 text-muted-foreground">
            Один тариф. Без рекуррентных списаний. Кредиты не сгорают год.
          </p>
        </FadeIn>

        <StaggerChildren
          className="mx-auto mt-12 grid max-w-3xl gap-4 md:grid-cols-2"
          delay={0.1}
        >
          <StaggerItem>
            <PriceCard
              name="Бесплатно"
              price="0 ₸"
              minutes="10 минут"
              perMin="При регистрации"
              tagline="Чтобы попробовать"
              cta="Начать"
              ctaHref="/signup"
              features={[
                "10 минут на запись и обработку",
                "Полный функционал — без ограничений",
                "Транскрипт со спикерами",
                "Краткое содержание + чат",
              ]}
            />
          </StaggerItem>
          <StaggerItem>
            <PriceCard
              name="Пакет минут"
              price="2 000 ₸"
              minutes="100 минут"
              perMin="20 ₸ / мин"
              tagline="Когда понадобится больше"
              cta="Купить"
              ctaHref="/signup"
              highlight
              features={[
                "100 минут на твоём счёте",
                "Не сгорает год",
                "Можно докупать сколько нужно",
                "Чат, проекты, экспорт",
              ]}
            />
          </StaggerItem>
        </StaggerChildren>

        <FadeIn delay={0.3} className="mx-auto mt-8 max-w-3xl">
          <CostBreakdown />
        </FadeIn>
      </div>
    </section>
  );
}

function PriceCard({
  name,
  price,
  minutes,
  perMin,
  tagline,
  features,
  cta,
  ctaHref,
  highlight,
  savings,
}: {
  name: string;
  price: string;
  minutes: string;
  perMin: string;
  tagline: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlight?: boolean;
  savings?: string;
}) {
  return (
    <HoverLift
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-card p-6",
        highlight
          ? "border-primary/50 shadow-xl shadow-primary/10"
          : "border-border/60",
      )}
    >
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-fuchsia-500 px-3 py-0.5 text-xs font-medium text-white shadow-md">
          Популярно
        </span>
      )}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold tracking-tight">{name}</h3>
          {savings && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
              {savings}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{tagline}</p>
      </div>
      <div className="mt-5 space-y-1">
        <div className="text-3xl font-semibold tracking-tight">{price}</div>
        <div className="text-sm text-muted-foreground">{minutes}</div>
        <div className="text-xs text-primary">{perMin}</div>
      </div>
      <ul className="mt-6 space-y-2.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-7">
        <Link
          href={ctaHref}
          className={cn(
            buttonVariants({
              variant: highlight ? "default" : "outline",
              size: "default",
            }),
            "w-full",
          )}
        >
          {cta}
        </Link>
      </div>
    </HoverLift>
  );
}

function CostBreakdown() {
  const items = [
    { label: "AssemblyAI · транскрипция со спикерами", cost: 340 },
    { label: "Anthropic Claude · сводка и чат", cost: 110 },
    { label: "Vercel + Supabase + Inngest · хостинг", cost: 30 },
  ];
  const total = items.reduce((s, it) => s + it.cost, 0);
  return (
    <details className="group rounded-2xl border border-border/60 bg-card p-5 transition-colors open:border-primary/30">
      <summary className="flex cursor-pointer list-none items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          💜
        </span>
        <span className="flex-1">
          <span className="block text-sm font-medium">Куда уходят деньги</span>
          <span className="block text-xs text-muted-foreground">
            Это некоммерческий проект — раскроем расходы за 100 минут
          </span>
        </span>
        <span className="text-xs text-muted-foreground transition-transform group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <div className="mt-5 space-y-2 border-t border-border/60 pt-4">
        {items.map((it) => (
          <div
            key={it.label}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="text-muted-foreground">{it.label}</span>
            <span className="font-mono tabular-nums">~{it.cost} ₸</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-2 text-sm font-medium">
          <span>Себестоимость 100 минут</span>
          <span className="font-mono tabular-nums text-primary">~{total} ₸</span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Цена <strong className="text-foreground">2 000 ₸</strong> покрывает
          расходы на API-провайдеров и оставляет небольшой запас на
          инфраструктуру, бэкапы и развитие. Прибыль здесь не цель — это
          инструмент для людей, а не бизнес.
        </p>
      </div>
    </details>
  );
}

/* ─────────── TESTIMONIAL ─────────── */

function Testimonial() {
  return (
    <section className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <FadeIn>
          <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-background to-fuchsia-500/5 p-8 md:p-12">
            <div className="text-5xl text-primary">«</div>
            <blockquote className="-mt-4 text-balance text-xl leading-relaxed md:text-2xl">
              Раньше каждое утро тратил по 30 минут на расшифровку планёрки.
              Теперь VoiceApp делает это за 3 минуты, и я сразу вижу
              ответственных по задачам и принятые решения.
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">
                ТС
              </div>
              <div>
                <div className="text-sm font-medium">Тимур С.</div>
                <div className="text-xs text-muted-foreground">
                  Руководитель студии
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────── FAQ ─────────── */

function FAQ() {
  const items = [
    {
      q: "Это коммерческий проект?",
      a: "Нет. VoiceApp создан как полезный инструмент для людей, не как бизнес. Цена 2 000 ₸ за 100 минут покрывает расходы на ИИ-провайдеров (AssemblyAI, Anthropic Claude) и инфраструктуру. Прибыль здесь не цель — мы хотим, чтобы транскрипция и сводки были доступны без подписок и навязчивых продаж.",
    },
    {
      q: "Как работает оплата? Подписка или разовая?",
      a: "Только разовая покупка пакета минут — никаких рекуррентных списаний. Кредиты остаются на балансе и не сгорают 12 месяцев. Списываются по факту обработки записи. Можно докупить ещё в любой момент.",
    },
    {
      q: "Что с приватностью моих записей?",
      a: "Аудио хранится в приватном S3-совместимом сторадже Supabase, доступ только по подписанным URL с истечением. Postgres Row Level Security гарантирует, что ваши записи видите только вы. Файлы и транскрипты не используются для обучения моделей.",
    },
    {
      q: "На каких языках работает?",
      a: "Русский, казахский, английский, плюс ещё 90 языков. Язык определяется автоматически. Для смешанных записей (русский + английский) тоже работает.",
    },
    {
      q: "Чем отличается от Plaud?",
      a: "Plaud — это физический диктофон-кулон с подпиской $30/мес безлимит, нужно покупать устройство (~$170). VoiceApp — веб-приложение, ничего покупать не надо: загружаешь любой mp3/m4a/mp4 с компа или телефона. Оплата по факту использования: 20 ₸ за минуту, без подписки. Плюс родной казахский, чат с записью и open data — всё в твоём аккаунте. И главное — это некоммерческий проект, мы не пытаемся максимизировать выручку.",
    },
    {
      q: "Сколько хранятся записи?",
      a: "Бессрочно, пока ты сам не удалишь. Можно удалить запись по кнопке или весь аккаунт целиком — тогда удалятся все аудио, транскрипты, сводки и история чатов.",
    },
    {
      q: "Можно ли получить возврат денег?",
      a: "Да. В течение 7 дней после первой покупки — возвращаем 100% средств без вопросов, если продукт не подошёл.",
    },
  ];
  return (
    <section id="faq" className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <FadeIn className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Вопросы
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Что обычно спрашивают
          </h2>
        </FadeIn>
        <StaggerChildren className="mt-12 space-y-3" delay={0.1}>
          {items.map((it) => (
            <StaggerItem key={it.q}>
              <details className="group rounded-xl border border-border/60 bg-card px-5 py-4 transition-colors open:border-primary/30">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {it.q}
                  <span className="text-muted-foreground transition-transform group-open:rotate-180">
                    ⌄
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {it.a}
                </p>
              </details>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

/* ─────────── FINAL CTA ─────────── */

function FinalCTA() {
  return (
    <section className="border-t border-border/60 py-24">
      <FadeIn className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Готов начать?
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Регистрация за 10 секунд. Первая запись расшифруется через пару минут.
        </p>
        <div className="mt-8 inline-flex flex-col items-center gap-3 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-fuchsia-500/5 px-8 py-7">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="size-4 text-primary" />
            <span className="font-medium">10 минут бесплатно при регистрации</span>
          </div>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "gap-2 px-7 shadow-lg shadow-primary/20",
            )}
          >
            Создать аккаунт
            <ArrowRight className="size-4" />
          </Link>
          <p className="text-xs text-muted-foreground">
            Гарантия возврата денег в течение 7 дней
          </p>
        </div>
      </FadeIn>
    </section>
  );
}

/* ─────────── FOOTER ─────────── */

function Footer() {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-xs text-muted-foreground sm:flex-row">
        <span>
          © {new Date().getFullYear()} VoiceApp. Все права защищены.
        </span>
        <span className="flex items-center gap-4">
          <Link href="/login" className="hover:text-foreground">
            Войти
          </Link>
          <Link href="/signup" className="hover:text-foreground">
            Регистрация
          </Link>
          <a
            href="mailto:t99.sultan@gmail.com"
            className="hover:text-foreground"
          >
            Связаться
          </a>
        </span>
      </div>
    </footer>
  );
}

/* ─────────── MOCK PREVIEW ─────────── */

function MockTranscriptPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-3 py-2">
        <span className="size-2.5 rounded-full bg-rose-400/70" />
        <span className="size-2.5 rounded-full bg-amber-400/70" />
        <span className="size-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 text-[11px] text-muted-foreground">
          voiceapp.app · Встреча команды · 24:18
        </span>
      </div>
      <div className="flex items-center gap-1 border-b border-border/60 px-4 py-2 text-xs">
        <span className="rounded-md bg-secondary px-2.5 py-1 font-medium">
          Транскрипт
        </span>
        <span className="px-2.5 py-1 text-muted-foreground">Краткое</span>
        <span className="px-2.5 py-1 text-muted-foreground">Чат</span>
      </div>
      <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <FileAudio className="size-3.5" />
        </div>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 bg-primary" />
        </div>
        <span className="text-[11px] tabular-nums text-muted-foreground">
          08:12 / 24:18
        </span>
      </div>
      <div className="space-y-3 px-4 py-4 text-left">
        <SpeakerLine name="Спикер 1" color="emerald" time="00:42">
          «Главное — успеть закрыть второй спринт до конца недели. Тимур, ты по
          фронту в графике?»
        </SpeakerLine>
        <SpeakerLine name="Спикер 2" color="sky" time="00:51">
          «Да, профиль и настройки делают сегодня, проектные карточки — завтра.
          Останется только тестирование.»
        </SpeakerLine>
        <SpeakerLine name="Спикер 1" color="emerald" time="01:09">
          «Окей. Тогда демо ставим на пятницу 18:00, всех зову.»
        </SpeakerLine>
      </div>
    </div>
  );
}

function SpeakerLine({
  name,
  color,
  time,
  children,
}: {
  name: string;
  color: "emerald" | "sky" | "amber";
  time: string;
  children: React.ReactNode;
}) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    sky: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  };
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-end gap-1 pt-0.5">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
            colorMap[color],
          )}
        >
          {name}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {time}
        </span>
      </div>
      <p className="flex-1 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
