"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  FileAudio,
  LayoutDashboard,
  Shield,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Пользователи", icon: Users },
  { href: "/admin/recordings", label: "Все записи", icon: FileAudio },
];

export function AdminSidebar({ email }: { email: string }) {
  const path = usePathname();

  return (
    <aside className="flex h-full w-72 flex-col border-r border-border/60 bg-card">
      <div className="flex items-center gap-2 px-5 py-4">
        <Shield className="size-5 text-primary" />
        <Link href="/admin" className="text-base font-semibold tracking-tight">
          VoiceApp · <span className="text-primary">Admin</span>
        </Link>
      </div>

      <div className="mx-3 mb-3 rounded-lg bg-primary/5 px-3 py-2 text-[11px]">
        <div className="font-medium">Админ-доступ</div>
        <div className="truncate text-muted-foreground">{email}</div>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-0.5">
          {ITEMS.map((it) => {
            const active = it.exact ? path === it.href : path.startsWith(it.href);
            const Icon = it.icon;
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  <span>{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border/60 p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />В приложение
        </Link>
      </div>
    </aside>
  );
}
