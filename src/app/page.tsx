import Link from "next/link";
import { redirect } from "next/navigation";
import { FileAudio, MessagesSquare, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Voice<span className="text-primary">App</span>
        </Link>
        <nav className="flex items-center gap-3">
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
            Создать аккаунт
          </Link>
        </nav>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-12 text-center md:pt-24">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Превращаем аудио в текст,
            <br />
            <span className="text-primary">сводку и диалог</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Загружай встречи, лекции и интервью — получай точный транскрипт,
            краткое содержание и чат, в котором можно задавать вопросы по записи.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Начать бесплатно
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              У меня уже есть аккаунт
            </Link>
          </div>
        </div>

        <div className="mt-16 grid w-full max-w-4xl gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<FileAudio className="size-5" />}
            title="Точная транскрипция"
            description="Whisper расшифровывает русский, казахский, английский. Поддержка длинных файлов до 1+ часа."
          />
          <FeatureCard
            icon={<Sparkles className="size-5" />}
            title="Краткое содержание"
            description="Claude собирает TL;DR, ключевые пункты и выводы за секунды после транскрипции."
          />
          <FeatureCard
            icon={<MessagesSquare className="size-5" />}
            title="Чат по записи"
            description="Задавай вопросы по содержимому. Ассистент отвечает с цитатами из транскрипта."
          />
        </div>
      </section>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        VoiceApp · {new Date().getFullYear()}
      </footer>
    </main>
  );
}

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
    <div className="rounded-xl border border-border bg-card p-5 text-left">
      <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-1 font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
