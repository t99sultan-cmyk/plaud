import Link from "next/link";
import { redirect } from "next/navigation";
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
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 px-4 py-12 text-center">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Plaud<span className="text-primary">Web</span>
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Загружай аудио — получай транскрипт, краткое содержание и чат по своим записям.
        </p>
      </div>
      <div className="flex gap-3">
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
          Войти
        </Link>
      </div>
    </main>
  );
}
