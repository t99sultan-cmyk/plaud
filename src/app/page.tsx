import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  Eye,
  FileAudio,
  FolderOpen,
  Globe2,
  Headphones,
  Languages,
  Lock,
  MessagesSquare,
  Mic,
  Server,
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
import { AnimatedCounter } from "@/components/landing/animated-counter";
import { ScrollProgress } from "@/components/landing/scroll-progress";
import { getLandingStats } from "@/lib/landing-stats";

export const revalidate = 300; // 5 minutes

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  const stats = await getLandingStats();

  return (
    <main className="min-h-svh bg-background">
      <ScrollProgress />
      <Header isLoggedIn={isLoggedIn} />
      <Hero />
      <LiveCounters stats={stats} />
      <UseCases />
      <OriginStory />
      <Features />
      <PrivacySection />
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
            Спроси у своей{" "}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-200 bg-clip-text text-transparent">
              записи
            </span>
            <span className="text-zinc-500">.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-lg text-zinc-300">
            Загружаешь встречу, лекцию или интервью —{" "}
            <span className="text-white">получаешь транскрипт со спикерами,
            краткое содержание и чат, в котором можно задавать вопросы по
            содержимому записи</span>. Подписка от 1 990 ₸/мес — без накрутки.
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

          {/* Trust chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-zinc-400">
            <TrustChip icon={<ShieldCheck className="size-3" />}>
              Аудио хранится только у тебя
            </TrustChip>
            <TrustChip icon={<Server className="size-3" />}>
              Не уходит в внешние источники
            </TrustChip>
            <TrustChip icon={<Eye className="size-3" />}>
              Никаких third-party аналитиков на чате
            </TrustChip>
          </div>
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

/* ─────────── TRUST CHIP ─────────── */

function TrustChip({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-emerald-400">{icon}</span>
      {children}
    </span>
  );
}

/* ─────────── LIVE COUNTERS ─────────── */

function LiveCounters({
  stats,
}: {
  stats: {
    totalUsers: number;
    totalMinutes: number;
    totalHoursSaved: number;
    averageProcessingMinutes: number;
  };
}) {
  return (
    <section className="border-y border-border/60 bg-card/40">
      <StaggerChildren
        className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 gap-x-4 px-6 py-12 md:grid-cols-4"
        delay={0.1}
      >
        <StaggerItem>
          <CounterCell
            icon={<Mic className="size-5" />}
            value={stats.totalMinutes}
            unit="минут"
            label="расшифровано всего"
          />
        </StaggerItem>
        <StaggerItem>
          <CounterCell
            icon={<Clock className="size-5" />}
            value={stats.totalHoursSaved}
            unit="часов"
            label="сэкономлено пользователям"
          />
        </StaggerItem>
        <StaggerItem>
          <CounterCell
            icon={<Users className="size-5" />}
            value={stats.totalUsers}
            unit=""
            label="активных пользователей"
            suffix="+"
          />
        </StaggerItem>
        <StaggerItem>
          <CounterCell
            icon={<Zap className="size-5" />}
            value={stats.averageProcessingMinutes}
            unit="мин"
            label="средняя обработка"
            prefix="≈"
          />
        </StaggerItem>
      </StaggerChildren>
    </section>
  );
}

function CounterCell({
  icon,
  value,
  unit,
  label,
  prefix,
  suffix,
}: {
  icon: React.ReactNode;
  value: number;
  unit: string;
  label: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="space-y-0.5">
        <div className="text-3xl font-semibold tracking-tight tabular-nums">
          {prefix}
          <AnimatedCounter to={value} />
          {suffix}
          {unit && <span className="ml-1 text-base text-muted-foreground">{unit}</span>}
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
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

/* ─────────── ORIGIN STORY ─────────── */

function OriginStory() {
  return (
    <section className="relative overflow-hidden border-t border-border/60 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.45 0.18 270 / 0.08), transparent 60%)",
        }}
      />
      <div className="mx-auto max-w-3xl px-6">
        <FadeIn>
          <p className="text-center text-sm font-medium uppercase tracking-wider text-primary">
            Origin
          </p>
          <h2 className="mt-2 text-center text-3xl font-semibold tracking-tight md:text-4xl">
            Почему мы сделали VoiceApp
          </h2>
        </FadeIn>

        <StaggerChildren
          className="mt-10 space-y-5 text-base leading-relaxed text-foreground/85"
          delay={0.1}
        >
          <StaggerItem>
            <p>
              Каждое утро уходило по 30 минут на расшифровку командной планёрки
              вручную. Платные альтернативы — Plaud за $30/мес или Otter — не
              работают с казахским и навязывают подписки. Whisper API хорош, но
              требует разработчика.
            </p>
          </StaggerItem>
          <StaggerItem>
            <p>
              VoiceApp — попытка сделать <strong>простой инструмент без
              впаривания</strong>. Один тариф, прозрачная цена, понятный
              функционал. Аудио остаётся только у тебя — никаких third-party
              аналитиков.
            </p>
          </StaggerItem>
          <StaggerItem>
            <p>
              Если нашёл баг или есть идея —{" "}
              <a
                href="https://t.me/voise_kz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                напиши в @voise_kz
              </a>
              . Мы читаем каждое сообщение сами.
            </p>
          </StaggerItem>
        </StaggerChildren>

        <FadeIn delay={0.4} className="mt-10 flex justify-center">
          <div className="rounded-full border border-border/60 bg-card px-4 py-2 text-xs text-muted-foreground">
            🇰🇿 Команда VoiceApp · Алматы, 2026
          </div>
        </FadeIn>
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

/* ─────────── PRIVACY ─────────── */

function PrivacySection() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Аудио остаётся только у тебя",
      desc: "Файлы хранятся в приватном S3-сторадже Supabase, доступ только через подписанные URL с истечением. Никаких публичных ссылок — пока ты сам не создашь.",
    },
    {
      icon: Lock,
      title: "Никуда не уходит наружу",
      desc: "Транскрипция и сводка обрабатываются у API-провайдеров (AssemblyAI, Anthropic) — обе команды публично декларируют, что данные клиентов не используются для обучения моделей.",
    },
    {
      icon: Eye,
      title: "Row Level Security в Postgres",
      desc: "На уровне БД каждая строка привязана к user_id. Даже если кто-то получит наш сервис-ключ, доступ к чужим записям невозможен — RLS блокирует на уровне базы.",
    },
    {
      icon: Server,
      title: "Удалить можно в один клик",
      desc: "Удаляешь запись или весь аккаунт — все аудио, транскрипты, сводки и история чатов исчезают из Postgres + Storage. Из бэкапов Supabase данные чистятся в течение 7 дней.",
    },
  ];
  return (
    <section className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Приватность
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Твои записи — твои
          </h2>
          <p className="mt-3 text-muted-foreground">
            Никаких third-party аналитиков на содержимом. Никаких внешних
            интеграций без твоего согласия. Анонимность по умолчанию.
          </p>
        </FadeIn>
        <StaggerChildren
          className="mt-12 grid gap-4 md:grid-cols-2"
          delay={0.1}
        >
          {items.map((it) => (
            <StaggerItem key={it.title}>
              <HoverLift className="h-full rounded-2xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-md">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <it.icon className="size-5" />
                </div>
                <h3 className="mb-1.5 font-medium">{it.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {it.desc}
                </p>
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
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Тарифы
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Ежемесячная подписка
          </h2>
          <p className="mt-3 text-muted-foreground">
            Списываем фиксированную сумму раз в месяц — внутри пакет минут.
            Неиспользованные минуты переносим на следующий месяц (до 2× от пакета).
          </p>
        </FadeIn>

        <StaggerChildren
          className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          delay={0.1}
        >
          <StaggerItem>
            <PriceCard
              name="Бесплатно"
              price="0 ₸"
              minutes="10 минут"
              perMin="Без подписки"
              tagline="Чтобы попробовать"
              cta="Начать без карты"
              ctaHref="/signup"
              features={[
                "10 минут на старте",
                "Полный функционал",
                "Транскрипт со спикерами",
                "1 устройство",
              ]}
            />
          </StaggerItem>
          <StaggerItem>
            <PriceCard
              name="Старт"
              price="1 990 ₸"
              priceUnit="/ мес"
              minutes="100 минут / мес"
              perMin="≈ 20 ₸ / мин"
              tagline="Личное использование"
              cta="Оформить Старт"
              ctaHref="/checkout?plan=start"
              features={[
                "100 минут каждый месяц",
                "≈ 1 встреча в неделю",
                "Перенос остатка до 100 мин",
                "До 2 устройств",
              ]}
            />
          </StaggerItem>
          <StaggerItem>
            <PriceCard
              name="Регулярно"
              price="7 998 ₸"
              priceUnit="/ мес"
              minutes="800 минут / мес"
              perMin="≈ 10 ₸ / мин"
              tagline="Постоянная работа"
              cta="Стать активным"
              ctaHref="/checkout?plan=regular"
              savings="−33%"
              highlight
              features={[
                "800 минут каждый месяц",
                "≈ 13 часов в месяц",
                "Перенос до 800 мин в запас",
                "До 2 устройств · приоритет",
              ]}
            />
          </StaggerItem>
          <StaggerItem>
            <PriceCard
              name="Активно"
              price="19 998 ₸"
              priceUnit="/ мес"
              minutes="2 500 минут / мес"
              perMin="≈ 8 ₸ / мин"
              tagline="Команды и активные юзеры"
              cta="Получить максимум"
              ctaHref="/checkout?plan=active"
              savings="−47%"
              features={[
                "2 500 минут (≈ 41 час) / мес",
                "Минимальная цена-минута",
                "До 2 устройств",
                "Email-поддержка",
              ]}
            />
          </StaggerItem>
        </StaggerChildren>

        <FadeIn delay={0.3} className="mx-auto mt-8 max-w-3xl space-y-3">
          <DeviceLimitNote />
          <CostBreakdown />
        </FadeIn>
      </div>
    </section>
  );
}

function PriceCard({
  name,
  price,
  priceUnit,
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
  priceUnit?: string;
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
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tracking-tight">{price}</span>
          {priceUnit && (
            <span className="text-sm text-muted-foreground">{priceUnit}</span>
          )}
        </div>
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

function DeviceLimitNote() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card px-5 py-4">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        🔒
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium">Доступ с двух устройств</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Один аккаунт — максимум два активных входа (компьютер + телефон).
          Это бережёт твои данные и не даёт делиться подпиской массово.
          При попытке войти с третьего — старая сессия отключается.
        </p>
      </div>
    </div>
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
            Расходы на 100 минут обработки — без скрытых наценок
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
          Подписка покрывает API-расходы (AssemblyAI + Claude) и инфраструктуру.
          На больших тарифах per-minute дешевле, потому что стоимость хостинга
          и поддержки распределяется на больший объём. Это не бизнес, нацеленный
          на максимизацию прибыли — это устойчивый сервис, который должен
          оплачивать сам себя.
        </p>
      </div>
    </details>
  );
}

/* ─────────── TESTIMONIAL ─────────── */

function Testimonial() {
  const reviews = [
    {
      initials: "АЖ",
      color: "from-emerald-400/20 to-emerald-600/20 text-emerald-700 dark:text-emerald-300",
      name: "Айгерим",
      role: "Студентка, КИМЭП",
      audience: "Студенты",
      text: "Болела две недели и пропустила лекции по экономике. Загрузила записи однокурсницы — VoiceApp за пару минут сделал структурированные конспекты. Перед экзаменом просто перечитала и сдала на отлично.",
    },
    {
      initials: "ДК",
      color: "from-sky-400/20 to-sky-600/20 text-sky-700 dark:text-sky-300",
      name: "Данияр",
      role: "Тимлид, IT-компания",
      audience: "Команды",
      text: "Записываю все созвоны команды. Сводка появляется через минуту — кидаю её в чат, никто не выпадает из контекста, даже если не смог быть. И не надо переслушивать час, чтобы понять что решили.",
    },
    {
      initials: "АА",
      color: "from-fuchsia-400/20 to-fuchsia-600/20 text-fuchsia-700 dark:text-fuchsia-300",
      name: "Альмира",
      role: "Ведущая подкаста",
      audience: "Контент-мейкеры",
      text: "Раньше уходило 3-4 часа на ручную расшифровку часового выпуска. Теперь VoiceApp даёт чистый текст со спикерами и таймкодами за 5 минут — остаётся только отредактировать и опубликовать в Telegram.",
    },
    {
      initials: "АН",
      color: "from-amber-400/20 to-amber-600/20 text-amber-700 dark:text-amber-300",
      name: "Алия",
      role: "HR-менеджер, маркетинг",
      audience: "Рекрутёры",
      text: "Собеседования с кандидатами стали проще: после интервью открываю чат и спрашиваю «какие сильные стороны?», «какие риски?». Сравнить пятерых кандидатов теперь занимает 10 минут вместо часа.",
    },
  ];

  return (
    <section className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Кому помогает
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Реальные сценарии использования
          </h2>
          <p className="mt-3 text-muted-foreground">
            Студенты, команды, контент-мейкеры, рекрутёры — у каждого свой повод
            не тратить часы на расшифровку.
          </p>
        </FadeIn>

        <StaggerChildren
          className="mt-12 grid gap-4 md:grid-cols-2"
          delay={0.1}
        >
          {reviews.map((r) => (
            <StaggerItem key={r.name}>
              <HoverLift className="h-full rounded-2xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-md">
                <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  {r.audience}
                </span>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                  «{r.text}»
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full bg-gradient-to-br font-semibold",
                      r.color,
                    )}
                  >
                    {r.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.role}
                    </div>
                  </div>
                </div>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn delay={0.4} className="mx-auto mt-8 max-w-2xl text-center">
          <p className="text-xs text-muted-foreground">
            Имена изменены, истории взяты из реальных запросов первых
            пользователей. Хочешь поделиться своим — напиши на{" "}
            <a
              href="mailto:t99.sultan@gmail.com"
              className="text-primary hover:underline"
            >
              t99.sultan@gmail.com
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────── FAQ ─────────── */

function FAQ() {
  const items = [
    {
      q: "Как работает подписка?",
      a: "Раз в месяц списывается фиксированная сумма (от 1 990 ₸/мес). На балансе появляется пакет минут — расходуются по факту обработки записей. Неиспользованные минуты переносятся на следующий месяц до 2× от пакета (например, на тарифе Старт можно накопить максимум 200 минут).",
    },
    {
      q: "Можно ли отменить подписку?",
      a: "Да, в любой момент. После отмены остаток минут на балансе остаётся доступным до конца оплаченного месяца. Никаких штрафов, скрытых платежей или ограничений на возврат.",
    },
    {
      q: "Сколько устройств может пользоваться одним аккаунтом?",
      a: "Максимум 2 одновременных устройства (например, ноутбук + телефон). При попытке войти с третьего — самая старая сессия отключается. Это защищает данные от случайного шеринга и не даёт массово раздавать одну подписку.",
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
  const cols = [
    {
      title: "Продукт",
      links: [
        { label: "Возможности", href: "#features" },
        { label: "Тарифы", href: "#pricing" },
        { label: "Сравнение", href: "#use-cases" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Аккаунт",
      links: [
        { label: "Войти", href: "/login" },
        { label: "Регистрация", href: "/signup" },
        { label: "Тарифы и баланс", href: "/dashboard/billing" },
      ],
    },
    {
      title: "Контакты",
      links: [
        { label: "@voise_kz · Telegram", href: "https://t.me/voise_kz", external: true },
        { label: "t99.sultan@gmail.com", href: "mailto:t99.sultan@gmail.com" },
        { label: "GitHub", href: "https://github.com/t99sultan-cmyk/plaud", external: true },
      ],
    },
  ];

  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight"
            >
              Voice<span className="text-primary">App</span>
            </Link>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Транскрипция со спикерами, краткое содержание и чат по
              содержимому. Сделано в Казахстане, аудио остаётся только у тебя.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Все системы работают</span>
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {col.title}
              </h4>
              <ul className="space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.external ? "_blank" : undefined}
                      rel={l.external ? "noopener noreferrer" : undefined}
                      className="text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} VoiceApp · 🇰🇿 Сделано в Алматы · Все права защищены
          </span>
          <span className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-foreground">
              Приватность
            </a>
            <span aria-hidden>·</span>
            <span>Версия 1.0</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────── MOCK PREVIEW ─────────── */

function MockTranscriptPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-3 py-2">
        <span className="size-2.5 rounded-full bg-rose-400/70" />
        <span className="size-2.5 rounded-full bg-amber-400/70" />
        <span className="size-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 truncate text-[11px] text-muted-foreground">
          voiceapp.app · Планёрка команды · 24:18
        </span>
      </div>

      {/* Tabs row — chat is active */}
      <div className="flex items-center gap-1 border-b border-border/60 px-4 py-2 text-xs">
        <span className="px-2.5 py-1 text-muted-foreground">Транскрипт</span>
        <span className="px-2.5 py-1 text-muted-foreground">Краткое</span>
        <span className="rounded-md bg-secondary px-2.5 py-1 font-medium">
          Чат
        </span>
        <span className="ml-auto text-[10px] text-muted-foreground">
          Запись готова · 12 спикеров идентифицированы
        </span>
      </div>

      {/* Chat dialog */}
      <div className="space-y-3 px-4 py-5 text-left">
        <UserBubble>Кто отвечает за дизайн и какие сроки обещали?</UserBubble>
        <AssistantBubble>
          Дизайн ведёт <strong>Мадина (Спикер 2)</strong>. По её словам, макеты
          закрываются <strong>к среде</strong>:
          <em className="mt-1.5 block rounded-md bg-muted/60 px-2.5 py-1.5 text-xs not-italic text-foreground/80">
            «Профиль и настройки делаю сегодня, проектные карточки — завтра.
            Останется только тестирование.» — 00:51
          </em>
        </AssistantBubble>

        <UserBubble>А когда демо?</UserBubble>
        <AssistantBubble>
          Демо назначено на <strong>пятницу в 18:00</strong>. Тимур (Спикер 1)
          сказал: <em>«Тогда демо ставим на пятницу 18:00, всех зову» — 01:09</em>.
        </AssistantBubble>

        {/* Input mock */}
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
          <span className="flex-1 text-xs text-muted-foreground">
            Спроси что-нибудь по записи…
          </span>
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
        {children}
      </div>
    </div>
  );
}

function AssistantBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm leading-relaxed text-foreground">
        {children}
      </div>
    </div>
  );
}
