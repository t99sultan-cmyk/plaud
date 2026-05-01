"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, Inbox, MessagesSquare, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NewFolderDialog } from "./new-folder-dialog";
import type { Folder as FolderRow } from "@/types/domain";

const DEFAULT_DOT = "bg-zinc-400 dark:bg-zinc-500";

export function Sidebar({
  folders,
  userEmail,
}: {
  folders: FolderRow[];
  userEmail: string;
}) {
  const path = usePathname();
  const initials = userEmail.slice(0, 2).toUpperCase();

  return (
    <aside className="flex h-full w-72 flex-col border-r border-border/60 bg-card">
      <div className="flex items-center gap-2.5 px-4 py-4">
        <Link
          href="/dashboard"
          className="text-base font-semibold tracking-tight"
        >
          Voice<span className="text-primary">App</span>
        </Link>
      </div>

      <div className="mx-3 mb-2 flex items-center gap-2.5 rounded-lg bg-muted/40 px-2.5 py-2">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {initials}
        </div>
        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
          {userEmail}
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="space-y-0.5">
          <SidebarLink
            href="/dashboard"
            label="Все записи"
            icon={<Inbox className="size-4" />}
            active={path === "/dashboard"}
          />
          <SidebarLink
            href="/dashboard/chats"
            label="Чаты"
            icon={<MessagesSquare className="size-4" />}
            active={path === "/dashboard/chats"}
          />
        </ul>

        <div className="mt-7 mb-2 flex items-center justify-between px-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Проекты
          </span>
          <NewFolderDialog>
            <Button variant="ghost" size="icon-xs" className="size-5">
              <Plus className="size-3" />
            </Button>
          </NewFolderDialog>
        </div>

        <ul className="space-y-0.5">
          {folders.length === 0 && (
            <li className="px-2 py-2 text-xs text-muted-foreground">
              Создай первый проект
            </li>
          )}
          {folders.map((f) => (
            <ProjectLink
              key={f.id}
              href={`/dashboard/projects/${f.id}`}
              name={f.name}
              color={f.color}
              active={path === `/dashboard/projects/${f.id}`}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
          active
            ? "bg-secondary text-secondary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        )}
      >
        {icon}
        <span className="truncate">{label}</span>
      </Link>
    </li>
  );
}

function ProjectLink({
  href,
  name,
  color,
  active,
}: {
  href: string;
  name: string;
  color: string | null;
  active?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
          active
            ? "bg-secondary text-secondary-foreground"
            : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
        )}
      >
        <span
          className={cn("size-1.5 shrink-0 rounded-full", color ?? DEFAULT_DOT)}
          aria-hidden
        />
        <FolderOpen className="size-4 shrink-0 opacity-60" />
        <span className="truncate">{name}</span>
      </Link>
    </li>
  );
}
