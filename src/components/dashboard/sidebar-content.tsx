"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, Inbox, MessagesSquare, Plus, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NewFolderDialog } from "./new-folder-dialog";
import { ProjectContextMenu } from "./project-context-menu";
import type { Folder as FolderRow } from "@/types/domain";

const DEFAULT_DOT = "bg-zinc-400 dark:bg-zinc-500";

/**
 * Shared sidebar content used both as a fixed sidebar (desktop) and inside
 * a Sheet drawer (mobile). `onNavigate` is called after every nav click —
 * the mobile drawer uses it to close itself.
 */
export function SidebarContent({
  folders,
  userEmail,
  onNavigate,
}: {
  folders: FolderRow[];
  userEmail: string;
  onNavigate?: () => void;
}) {
  const path = usePathname();
  const initials = userEmail.slice(0, 2).toUpperCase();

  return (
    <>
      <div className="flex items-center gap-2.5 px-4 py-4">
        <Link
          href="/dashboard"
          onClick={onNavigate}
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
            onClick={onNavigate}
          />
          <SidebarLink
            href="/dashboard/chats"
            label="Чаты"
            icon={<MessagesSquare className="size-4" />}
            active={path === "/dashboard/chats"}
            onClick={onNavigate}
          />
          <SidebarLink
            href="/dashboard/billing"
            label="Тарифы и баланс"
            icon={<Wallet className="size-4" />}
            active={path === "/dashboard/billing"}
            onClick={onNavigate}
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
              id={f.id}
              href={`/dashboard/projects/${f.id}`}
              name={f.name}
              color={f.color}
              active={path === `/dashboard/projects/${f.id}`}
              onClick={onNavigate}
            />
          ))}
        </ul>
      </nav>
    </>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
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
  id,
  href,
  name,
  color,
  active,
  onClick,
}: {
  id: string;
  href: string;
  name: string;
  color: string | null;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <li>
      <div
        className={cn(
          "group flex items-center gap-1 rounded-md pr-1 transition-colors",
          active
            ? "bg-secondary text-secondary-foreground"
            : "hover:bg-accent",
        )}
      >
        <Link
          href={href}
          onClick={onClick}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
            active
              ? "text-secondary-foreground"
              : "text-foreground/80 hover:text-accent-foreground",
          )}
        >
          <span
            className={cn(
              "size-1.5 shrink-0 rounded-full",
              color ?? DEFAULT_DOT,
            )}
            aria-hidden
          />
          <FolderOpen className="size-4 shrink-0 opacity-60" />
          <span className="truncate">{name}</span>
        </Link>
        <ProjectContextMenu id={id} name={name} />
      </div>
    </li>
  );
}
