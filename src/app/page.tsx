import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Check,
  FileAudio,
  FolderOpen,
  Globe,
  Languages,
  Lock,
  MessagesSquare,
  Mic,
  Sparkles,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-svh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Voice<span className="text-primary">App</span>
          </Link>
          <nav className="flex items-center gap-2">
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
              Тарифы
            </Link>
            <Link
              href="#faq"
              className="hidden px-3 py-2 text-sm text-muted-foreground hover:text-foreground sm:block"
            >
              Вопросы
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Войти
            </Link>
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "sm" }), "ml-1")}
            >
              Начать бесплатно
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% -10%, oklch(0.45 0.18 270 / 0.18), transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 text-center md:pt-24">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Beta · открытый доступ
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Превращаем аудио в{" "}
            <span className="bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">
              текст, сводку и диалог
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground">
            Загружай встречи Zoom, лекции и интервью. VoiceApp распознаёт спикеров,
            генерирует краткое содержание и отвечает на вопросы по содержимому записи —
            с цитатами и таймкодами.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "gap-2 px-5")}
            >
              Попробовать бесплатно
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-5",
              )}
            >
              Войти в аккаунт
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Без карты · 100 минут на старте · отмена в любой момент
          </p>

          {/* Mock UI preview */}
          <div className="relative mx-auto mt-14 max-w-4xl">
            <div
              aria-hidden
              className="absolute -inset-x-6 -inset-y-4 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-transparent blur-2xl"
            />
            <MockTranscriptPreview />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Всё что нужно для работы со звуком
            </h2>
            <p className="mt-3 text-muted-foreground">
              От транскрипции до диалога с записью — за пару минут после загрузки.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Mic className="size-5" />}
              title="Распознавание спикеров"
              description="Универсальная модель различает 2-6 голосов в записи и помечает реплики «Спикер 1», «Спикер 2». Идеально для встреч 1:1, командных созвонов, интервью."
            />
            <FeatureCard
              icon={<Sparkles className="size-5" />}
              title="Краткое содержание"
              description="Claude Sonnet 4.6 за 10 секунд собирает TL;DR, ключевые пункты, выводы и темы. Не пересказ, а суть."
            />
            <FeatureCard
              icon={<MessagesSquare className="size-5" />}
              title="Чат по записи"
              description="Спрашивай в свободной форме: «Что решили по бюджету?», «Кто что обещал?». Ассистент отвечает с прямыми цитатами из транскрипта."
            />
            <FeatureCard
              icon={<FolderOpen className="size-5" />}
              title="Проекты"
              description="Объединяй записи по теме: встречи команды, интервью кандидатов, лекции курса. Чистая навигация без хаоса."
            />
            <FeatureCard
              icon={<Lock className="size-5" />}
              title="Полная приватность"
              description="Postgres Row Level Security — только ты видишь свои записи. Файлы в приватном S3-хранилище. Никаких публичных ссылок."
            />
            <FeatureCard
              icon={<Languages className="size-5" />}
              title="Многоязычность"
              description="Русский, казахский, английский и ещё 90 языков. Автоопределение языка — не нужно ничего настраивать."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Прозрачная цена за минуту
            </h2>
            <p className="mt-3 text-muted-foreground">
              Платишь только за то, что обработал. Без ежемесячных списаний на старте.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <PriceCard
              name="Старт"
              price="Бесплатно"
              tagline="Для знакомства"
              cta="Начать"
              ctaHref="/signup"
              features={[
                "100 минут в месяц",
                "1 проект",
                "Транскрипт + сводка + чат",
                "Распознавание спикеров",
              ]}
            />
            <PriceCard
              name="Pro"
              price="4 990 ₸"
              priceUnit="/мес"
              tagline="Для постоянной работы"
              cta="Скоро"
              ctaHref="#"
              highlight
              features={[
                "30 часов в месяц",
                "Безлимит проектов",
                "Распознавание до 6 спикеров",
                "Экспорт в PDF / SRT / Markdown",
                "Приоритет в очереди",
              ]}
            />
            <PriceCard
              name="Команда"
              price="19 990 ₸"
              priceUnit="/мес"
              tagline="Для команды"
              cta="Скоро"
              ctaHref="#"
              features={[
                "100 часов в месяц",
                "До 5 пользователей",
                "Совместный доступ к проектам",
                "API доступ",
                "Поддержка 24/7",
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border/60 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Частые вопросы
            </h2>
          </div>
          <div className="mt-12 space-y-3">
            <FAQ
              q="Что с приватностью моих записей?"
              a="Аудио хранится в приватном S3-совместимом сторадже Supabase, доступ только по подписанным URL с истечением. На уровне БД включён Row Level Security — даже если кто-то получит мой service-key, доступ к вашим данным ограничен по user_id. Транскрипт и сводка обрабатываются через AssemblyAI и Anthropic — оба провайдера не используют ваши данные для обучения."
            />
            <FAQ
              q="На каких языках работает?"
              a="Русский, казахский, английский, плюс ещё 90 языков через AssemblyAI. Язык определяется автоматически. Для смешанных записей (например, русский + английский) тоже работает."
            />
            <FAQ
              q="Чем отличается от Plaud?"
              a="Plaud — это аппаратный диктофон + подписка $30/мес безлимит. VoiceApp — веб-приложение, где платишь по факту использования. Если расходуешь меньше 70 часов в месяц — мы дешевле. Плюс открытые данные: всё в твоём Supabase, можно экспортировать."
            />
            <FAQ
              q="Сколько стоит обработка минуты?"
              a="100 минут аудио со всеми фичами (транскрипт + сводка + 10 вопросов в чате) — около $1 себестоимости. На бесплатном тарифе мы покрываем эту стоимость как стартовый бонус."
            />
            <FAQ
              q="Можно ли удалить аккаунт и все записи?"
              a="Да. В настройках аккаунта (скоро) будет кнопка «Удалить всё». Действие необратимое — удаляются все аудио-файлы, транскрипты, сводки и история чатов из Postgres + Storage. Через 7 дней также чистится из бэкапов Supabase."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/60 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Готов начать?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Регистрация за 10 секунд. Первая запись расшифруется через пару минут.
          </p>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-7 gap-2 px-6",
            )}
          >
            Создать аккаунт
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} VoiceApp. Все права защищены.</span>
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
    </main>
  );
}

/* ─────────── components ─────────── */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-1.5 font-medium">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function PriceCard({
  name,
  price,
  priceUnit,
  tagline,
  features,
  cta,
  ctaHref,
  highlight,
}: {
  name: string;
  price: string;
  priceUnit?: string;
  tagline: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-6",
        highlight
          ? "border-primary/40 shadow-[0_0_0_1px_hsl(var(--primary)/0.2)] shadow-primary/20"
          : "border-border/60",
      )}
    >
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
          Популярно
        </span>
      )}
      <div className="space-y-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-xs text-muted-foreground">{tagline}</p>
      </div>
      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight">{price}</span>
        {priceUnit && (
          <span className="text-sm text-muted-foreground">{priceUnit}</span>
        )}
      </div>
      <ul className="mt-6 space-y-2.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className={cn(
          buttonVariants({
            variant: highlight ? "default" : "outline",
            size: "default",
          }),
          "mt-7 w-full",
        )}
      >
        {cta}
      </Link>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-border/60 bg-card px-5 py-4 transition-colors open:border-primary/30">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
        {q}
        <span className="text-muted-foreground transition-transform group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
    </details>
  );
}

function MockTranscriptPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-3 py-2">
        <span className="size-2.5 rounded-full bg-rose-400/70" />
        <span className="size-2.5 rounded-full bg-amber-400/70" />
        <span className="size-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 text-[11px] text-muted-foreground">
          voiceapp.app · Встреча команды · 24:18
        </span>
      </div>
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border/60 px-4 py-2 text-xs">
        <span className="rounded-md bg-secondary px-2.5 py-1 font-medium">
          Транскрипт
        </span>
        <span className="px-2.5 py-1 text-muted-foreground">Краткое содержание</span>
        <span className="px-2.5 py-1 text-muted-foreground">Чат</span>
      </div>
      {/* Player */}
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
      {/* Transcript snippets */}
      <div className="space-y-3 px-4 py-4 text-left">
        <SpeakerLine speaker="A" name="Спикер 1" color="emerald" time="00:42">
          «Главное — успеть закрыть второй спринт до конца недели. Тимур, ты по
          фронту в графике?»
        </SpeakerLine>
        <SpeakerLine speaker="B" name="Спикер 2" color="sky" time="00:51">
          «Да, профиль и настройки делают сегодня, проектные карточки — завтра.
          Останется только тестирование.»
        </SpeakerLine>
        <SpeakerLine speaker="A" name="Спикер 1" color="emerald" time="01:09">
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
  speaker: string;
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

// Suppress unused-icon imports (kept for potential future use)
void Globe;
void Users;
