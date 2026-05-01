"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar-content";
import type { Folder as FolderRow } from "@/types/domain";

export function MobileTopBar({
  folders,
  userEmail,
  rightSlot,
}: {
  folders: FolderRow[];
  userEmail: string;
  rightSlot?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 items-center justify-between gap-2 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md md:hidden">
      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label="Меню">
                <Menu className="size-4" />
              </Button>
            }
          />
          <SheetContent side="left" className="flex w-[80%] max-w-[320px] flex-col p-0">
            <SidebarContent
              folders={folders}
              userEmail={userEmail}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <Link
          href="/dashboard"
          className="text-base font-semibold tracking-tight"
        >
          Voice<span className="text-primary">App</span>
        </Link>
      </div>
      <div className="flex items-center gap-1.5">{rightSlot}</div>
    </header>
  );
}
