import Link from "next/link";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function AdminLink() {
  return (
    <Link
      href="/admin"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "gap-1.5 border-primary/40 text-primary hover:bg-primary/5",
      )}
    >
      <Shield className="size-3.5" />
      Админка
    </Link>
  );
}
