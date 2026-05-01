import Link from "next/link";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { getMetrics, listFeedback, listUserStats } from "@/lib/admin/queries";
import { MetricCard } from "@/components/admin/metric-card";
import { DailyBarChart, DailyLineChart, StatusDonut } from "@/components/admin/charts";
import { cn, formatDuration, formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Админка — VoiceApp" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [metrics, userStats, feedback] = await Promise.all([
    getMetrics(),
    listUserStats(),
    listFeedback(20),
  ]);
  const top10 = userStats
    .filter((u) => u.recording_count > 0)
    .slice(0, 10);

  const positive = feedback.filter((f) => f.rating === 1).length;
  const negative = feedback.filter((f) => f.rating === -1).length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Дашборд</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Обзор активности пользователей и обработки записей.
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Пользователи"
          value={metrics.totalUsers}
          accent="primary"
          hint="Всего зарегистрировано"
        />
        <MetricCard
          label="Записи"
          value={metrics.totalRecordings}
          accent="emerald"
          hint={`Готово: ${metrics.recordingsByStatus.ready}`}
        />
        <MetricCard
          label="Минуты"
          value={metrics.totalMinutes.toLocaleString("ru-RU")}
          unit="мин"
          accent="amber"
          hint="Обработано всего"
        />
        <MetricCard
          label="Расход"
          value={`$${metrics.totalCostUsd}`}
          accent="rose"
          hint="Себестоимость суммарно"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Записи за 30 дней"
          subtitle="Загружено новых записей по дням"
        >
          <DailyBarChart data={metrics.recordingsByDay} />
        </ChartCard>
        <ChartCard
          title="Регистрации за 30 дней"
          subtitle="Новые пользователи по дням"
        >
          <DailyLineChart data={metrics.signupsByDay} />
        </ChartCard>
        <ChartCard
          title="Распределение по статусам"
          subtitle="Текущее состояние всех записей"
        >
          <StatusDonut data={metrics.recordingsByStatus} />
        </ChartCard>
        <ChartCard
          title="Топ-10 пользователей"
          subtitle="По объёму обработанного аудио"
        >
          {top10.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Нет данных — никто ещё ничего не загрузил
            </p>
          ) : (
            <ol className="space-y-2 text-sm">
              {top10.map((u, i) => (
                <li
                  key={u.user_id}
                  className="flex items-center gap-3"
                >
                  <span className="w-5 text-right text-xs text-muted-foreground tabular-nums">
                    {i + 1}.
                  </span>
                  <span className="min-w-0 flex-1 truncate">{u.email}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {u.recording_count}{" "}
                    {u.recording_count === 1
                      ? "зап."
                      : u.recording_count < 5
                        ? "зап."
                        : "зап."}
                  </span>
                  <span className="w-16 text-right text-xs font-medium tabular-nums">
                    {formatDuration(u.total_seconds)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </ChartCard>
      </div>

      {/* Feedback section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Обратная связь от пользователей
            </h2>
            <p className="text-sm text-muted-foreground">
              Что юзеры пишут о точности транскриптов и сводок.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-700 dark:text-emerald-400">
              <ThumbsUp className="size-3" /> {positive}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-rose-700 dark:text-rose-400">
              <ThumbsDown className="size-3" /> {negative}
            </span>
          </div>
        </div>

        {feedback.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card p-10 text-center text-sm text-muted-foreground">
            Пока никто не оставлял отзывов
          </div>
        ) : (
          <ul className="space-y-2">
            {feedback.map((fb) => (
              <li
                key={`${fb.recording_id}-${fb.user_id}`}
                className="rounded-xl border border-border/60 bg-card px-4 py-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      fb.rating === 1 && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
                      fb.rating === -1 && "bg-rose-500/15 text-rose-700 dark:text-rose-400",
                      fb.rating === 0 && "bg-muted text-muted-foreground",
                    )}
                  >
                    {fb.rating === 1 && <ThumbsUp className="size-4" />}
                    {fb.rating === -1 && <ThumbsDown className="size-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <Link
                        href={`/admin/recordings/${fb.recording_id}`}
                        className="truncate font-medium hover:underline"
                      >
                        {fb.recording_title}
                      </Link>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatRelativeTime(fb.updated_at)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {fb.user_email}
                    </p>
                    {fb.comment && (
                      <p className="mt-2 whitespace-pre-wrap text-sm">
                        {fb.comment}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
