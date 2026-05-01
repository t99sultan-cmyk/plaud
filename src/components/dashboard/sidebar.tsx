"use client";

import { SidebarContent } from "./sidebar-content";
import type { Folder as FolderRow } from "@/types/domain";

export function Sidebar({
  folders,
  userEmail,
}: {
  folders: FolderRow[];
  userEmail: string;
}) {
  return (
    <aside className="hidden h-full w-72 flex-col border-r border-border/60 bg-card md:flex">
      <SidebarContent folders={folders} userEmail={userEmail} />
    </aside>
  );
}
