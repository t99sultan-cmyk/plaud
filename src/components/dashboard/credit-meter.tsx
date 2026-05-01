import Link from "next/link";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserCredits } from "@/types/domain";

export function CreditMeter({ credits }: { credits: UserCredits | null }) {
  if (!credits) return null;

  const free = credits.free_minutes_remaining;
  const expired =
    credits.paid_minutes_expires_at &&
    new Date(credits.paid_minutes_expires_at) < new Date();
  const paid = expired ? 0 : credits.paid_minutes_remaining;
  const total = free + paid;

  const lowBalance = total < 5;
  const empty = total === 0;

  return (
    <Link
      href="/dashboard/billing"
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        empty
          ? "border-rose-500/30 bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 dark:text-rose-400"
          : lowBalance
            ? "border-amber-500/30 bg-amber-500/10 text-amber-700 hover:bg-amber-500/15 dark:text-amber-400"
            : "border-border/60 bg-card hover:bg-accent",
      )}
    >
      <Clock className="size-3" />
      <span className="tabular-nums">
        {empty ? "0 минут" : `${total} мин`}
      </span>
    </Link>
  );
}
