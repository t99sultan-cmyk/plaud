import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-12 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, oklch(0.45 0.18 270 / 0.08), transparent 60%)",
        }}
      />
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="size-7" />
      </div>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
        Здесь ничего нет
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Страница не найдена. Возможно, ссылка устарела или ты ошибся в адресе.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
          <ArrowLeft className="size-4" />
          На главную
        </Link>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          Открыть приложение
        </Link>
      </div>
    </main>
  );
}
