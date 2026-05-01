import Link from "next/link";
import { listAllRecordings } from "@/lib/admin/queries";
import { StatusBadge } from "@/components/recording/status-badge";
import { formatDuration, formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Все записи — Админка VoiceApp" };
export const dynamic = "force-dynamic";

export default async function AdminAllRecordingsPage() {
  const recordings = await listAllRecordings({ limit: 200 });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Все записи</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Последние {recordings.length} записей со всех аккаунтов.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <table className="w-full">
          <thead className="border-b border-border/60 bg-muted/30 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Название</th>
              <th className="px-4 py-3 font-medium">Пользователь</th>
              <th className="px-4 py-3 font-medium">Длительность</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium">Загружено</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {recordings.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Нет записей
                </td>
              </tr>
            )}
            {recordings.map((r) => (
              <tr
                key={r.id}
                className="border-b border-border/60 last:border-b-0 transition-colors hover:bg-accent/40"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/recordings/${r.id}`}
                    className="font-medium hover:underline"
                  >
                    {r.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {r.user_email || "—"}
                </td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {formatDuration(r.duration_sec)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatRelativeTime(r.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
