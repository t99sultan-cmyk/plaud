"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface NavLink {
  href: string;
  label: string;
}

const LINKS: NavLink[] = [
  { href: "#use-cases", label: "Кейсы" },
  { href: "#features", label: "Возможности" },
  { href: "#pricing", label: "Цены" },
  { href: "#faq", label: "FAQ" },
];

export function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex size-9 items-center justify-center rounded-md text-foreground/80 hover:bg-accent sm:hidden"
        aria-label="Открыть меню"
      >
        <Menu className="size-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md sm:hidden">
          <div className="flex h-14 items-center justify-between border-b border-border/40 px-6">
            <span className="text-lg font-semibold tracking-tight">
              Voice<span className="text-primary">App</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex size-9 items-center justify-center rounded-md text-foreground/80 hover:bg-accent"
              aria-label="Закрыть меню"
            >
              <X className="size-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-6 py-6">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="px-6 pt-4 grid gap-2">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ size: "lg" }), "w-full")}
              >
                Открыть приложение
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ size: "lg" }), "w-full")}
                >
                  Начать бесплатно
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "w-full",
                  )}
                >
                  Войти
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
