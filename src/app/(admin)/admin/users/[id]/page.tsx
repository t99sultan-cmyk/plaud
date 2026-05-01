import Link from "next/link";
import { ChevronLeft, Mail, Calendar, LogIn } from "lucide-react";
import { notFound } from "next/navigation";
import {
  getUser,
  listUserRecordings,
  estimateCost,
} from "@/lib/admin/queries";
import { MetricCard } from "@/components/admin/metric-card";
import { StatusBadge } from "@/components/recording/status-badge";
import { formatDuration, formatRelativeTime } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) notFound();
  const recordings = await listUserRecordings(id);

  const totalSec = recordings.reduce(
    (s, r) => s + (r.duration_sec ?? 0),
    0,
  );
  const cost = Math.round(estimateCost(totalSec) * 100) / 100;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-8">
      <div>
        <Link
          href="/admin/users"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-4 -ml-2",
          )}
        >
          <ChevronLeft className="size-4" />К списку
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{user.email}</h1>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Mail className="size-3" />
            {user.email}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3" />
            Регистрация: {formatRelativeTime(user.created_at)}
          </span>
          {user.last_sign_in_at && (
            <span className="flex items-center gap-1.5">
              <LogIn className="size-3" />
              Последний вход: {formatRelativeTime(user.last_sign_in_at)}
            </span>
          )}
          {user.provider && (
            <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase tracking-wider">
              {user.provider}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Записи"
          value={recordings.length}
          accent="primary"
        />
        <MetricCard
          label="Длительность"
          value={totalSec > 0 ? formatDuration(totalSec) : "0:00"}
          accent="emerald"
        />
        <MetricCard
          label="Расход"
          value={`$${cost}`}
          accent="rose"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="border-b border-border/60 px-5 py-3 text-sm font-medium">
          Записи пользователя
        </div>
        <ul className="divide-y divide-border/60">
          {recordings.length === 0 && (
            <li className="px-5 py-6 text-center text-sm text-muted-foreground">
              Записей пока нет
            </li>
          )}
          {recordings.map((r) => (
            <li key={r.id}>
              <Link
                href={`/admin/recordings/${r.id}`}
                className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-accent/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{r.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDuration(r.duration_sec)} ·{" "}
                    {formatRelativeTime(r.created_at)}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
