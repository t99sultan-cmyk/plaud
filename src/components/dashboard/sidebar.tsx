"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, Inbox, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NewFolderDialog } from "./new-folder-dialog";
import type { Folder as FolderRow } from "@/types/domain";

export function Sidebar({ folders }: { folders: FolderRow[] }) {
  const path = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="px-4 py-5">
        <Link href="/dashboard" className="text-lg font-semibold">
          Plaud<span className="text-primary">Web</span>
        </Link>
      </div>
      <Separator />
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          <SidebarLink
            href="/dashboard"
            label="Все записи"
            icon={<Inbox className="size-4" />}
            active={path === "/dashboard"}
          />
        </ul>

        <div className="mt-6 mb-2 flex items-center justify-between px-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Папки
          </span>
          <NewFolderDialog>
            <Button variant="ghost" size="icon" className="size-6">
              <Plus className="size-3.5" />
            </Button>
          </NewFolderDialog>
        </div>

        <ul className="space-y-1">
          {folders.length === 0 && (
            <li className="px-2 py-2 text-xs text-muted-foreground">
              Папок пока нет.
            </li>
          )}
          {folders.map((f) => (
            <SidebarLink
              key={f.id}
              href={`/dashboard/folders/${f.id}`}
              label={f.name}
              icon={<Folder className="size-4" />}
              active={path === `/dashboard/folders/${f.id}`}
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
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
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
