import Link from "next/link";
import { YandexMetrica } from "@/components/yandex-metrica";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-8 px-4 py-12">
      <YandexMetrica />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% -20%, oklch(0.45 0.18 270 / 0.12), transparent 60%)",
        }}
      />
      <Link
        href="/"
        className="text-2xl font-semibold tracking-tight transition-opacity hover:opacity-80"
      >
        Voice<span className="text-primary">App</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
      <Link
        href="/"
        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        ← На главную
      </Link>
    </div>
  );
}
