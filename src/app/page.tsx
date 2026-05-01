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
            <span className="text-zinc-200">🇰🇿 Сделано в Казахстане</span>
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
            VoiceApp превращает Zoom-созвоны, лекции и интервью в редактируемый
            транскрипт с разделением спикеров, краткое содержание с ключевыми
            решениями и чат, в котором можно переспрашивать кто и что сказал.
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
            Без карты · Загрузка через 30 секунд · Готовый текст через 5 минут
          </p>
        </FadeIn>

        <FadeIn delay={0.2} className="relative mx-auto mt-16 max-w-4xl">
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
  const rows: Array<{ feature: string; voice: boolean | string; plaud: boolean | string; otter: boolean | string; whisper: boolean | string }> = [
    { feature: "Цена за час", voice: "600 ₸", plaud: "$30/мес", otter: "$20/мес", whisper: "$0.36 + setup" },
    { feature: "Спикеры", voice: true, plaud: true, otter: true, whisper: false },
    { feature: "Русский", voice: true, plaud: "слабо", otter: "слабо", whisper: true },
    { feature: "Казахский", voice: true, plaud: false, otter: false, whisper: true },
    { feature: "Чат с записью", voice: true, plaud: false, otter: "ограничен", whisper: false },
    { feature: "Без подписки", voice: "оплата по факту", plaud: false, otter: false, whisper: true },
  ];

  return (
    <section className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Сравнение
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Чем мы отличаемся
          </h2>
        </FadeIn>
        <FadeIn delay={0.1} className="mt-10 overflow-hidden rounded-2xl border border-border/60 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Фича</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="text-primary">VoiceApp</span>
                  </th>
                  <th className="px-4 py-3 font-medium">Plaud</th>
                  <th className="px-4 py-3 font-medium">Otter</th>
                  <th className="px-4 py-3 font-medium">Whisper</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.feature} className={cn(i < rows.length - 1 && "border-b border-border/60")}>
                    <td className="px-4 py-3 font-medium">{r.feature}</td>
                    <td className="px-4 py-3 bg-primary/5"><Cell value={r.voice} highlight /></td>
                    <td className="px-4 py-3"><Cell value={r.plaud} /></td>
                    <td className="px-4 py-3"><Cell value={r.otter} /></td>
                    <td className="px-4 py-3"><Cell value={r.whisper} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-border/60 px-4 py-2.5 text-center text-[11px] text-muted-foreground sm:hidden">
            Прокрути таблицу горизонтально →
          </p>
        </FadeIn>
      </div>
    </section>
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
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Цены
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Платишь только за факт обработки
          </h2>
          <p className="mt-3 text-muted-foreground">
            Без подписок. Кредиты не сгорают год. Чем больше пакет — тем дешевле минута.
          </p>
        </FadeIn>

        <StaggerChildren className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4" delay={0.1}>
          <StaggerItem>
            <PriceCard
              name="Старт"
              price="1 000 ₸"
              minutes="100 минут"
              perMin="10 ₸ / мин"
              tagline="Попробовать"
              cta="Купить"
              ctaHref="/signup"
              features={[
                "100 минут обработки",
                "Распознавание спикеров",
                "Транскрипт + сводка + чат",
                "Все форматы аудио и видео",
              ]}
            />
          </StaggerItem>
          <StaggerItem>
            <PriceCard
              name="Mini"
              price="4 990 ₸"
              minutes="600 минут"
              perMin="8.3 ₸ / мин"
              tagline="Регулярная работа"
              cta="Купить"
              ctaHref="/signup"
              savings="−17%"
              features={[
                "600 минут обработки",
                "Безлимит проектов",
                "Распознавание до 6 спикеров",
                "Приоритет в очереди",
              ]}
            />
          </StaggerItem>
          <StaggerItem>
            <PriceCard
              name="Pro"
              price="14 990 ₸"
              minutes="2 000 минут"
              perMin="7.5 ₸ / мин"
              tagline="Активные пользователи"
              cta="Купить"
              ctaHref="/signup"
              savings="−25%"
              highlight
              features={[
                "2 000 минут (33 часа)",
                "Экспорт в PDF / SRT / Markdown",
                "Приоритет обработки",
                "Поддержка по email",
              ]}
            />
          </StaggerItem>
          <StaggerItem>
            <PriceCard
              name="Команда"
              price="49 990 ₸"
              minutes="7 000 минут"
              perMin="7.1 ₸ / мин"
              tagline="Для команды"
              cta="Скоро"
              ctaHref="#"
              savings="−29%"
              features={[
                "7 000 минут (116 часов)",
                "До 5 пользователей",
                "Совместный доступ к проектам",
                "Поддержка 24/7",
              ]}
            />
          </StaggerItem>
        </StaggerChildren>

        <FadeIn delay={0.3} className="mt-10 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-3 text-sm">
          <Sparkles className="size-4 text-emerald-600" />
          <span>
            <strong>10 минут бесплатно</strong> при регистрации — попробовать без карты
          </span>
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
      q: "Как работает оплата? Подписка или разовая?",
      a: "Разовая покупка пакета минут. Кредиты остаются на балансе и не сгорают 12 месяцев. Списываются по факту обработки записи. Можно докупить ещё в любой момент.",
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
      q: "Чем отличается от Plaud и Otter?",
      a: "Plaud — это аппаратный диктофон + подписка $30/мес безлимит. Otter — подписка $20/мес с лимитом 1200 минут. У нас оплата по факту: используешь меньше — платишь меньше. Плюс полная поддержка казахского и open data — всё в твоём аккаунте, можно экспортировать.",
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
