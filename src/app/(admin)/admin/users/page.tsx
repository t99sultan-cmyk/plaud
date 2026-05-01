import Link from "next/link";
import { listUserStats } from "@/lib/admin/queries";
import { formatDuration, formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Пользователи — Админка VoiceApp" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const stats = await listUserStats();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Пользователи</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Всего {stats.length}{" "}
          {stats.length === 1
            ? "пользователь"
            : stats.length < 5
              ? "пользователя"
              : "пользователей"}
          . Кликни на строку для деталей.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <table className="w-full">
          <thead className="border-b border-border/60 bg-muted/30 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Записей</th>
              <th className="px-4 py-3 font-medium">Длительность</th>
              <th className="px-4 py-3 font-medium">Последняя запись</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {stats.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Нет пользователей
                </td>
              </tr>
            )}
            {stats.map((u) => (
              <tr
                key={u.user_id}
                className="border-b border-border/60 last:border-b-0 transition-colors hover:bg-accent/40"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/${u.user_id}`}
                    className="font-medium hover:underline"
                  >
                    {u.email || "(без email)"}
                  </Link>
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {u.recording_count}
                </td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {u.total_seconds > 0 ? formatDuration(u.total_seconds) : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {u.last_recording_at
                    ? formatRelativeTime(u.last_recording_at)
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
