import { getMetrics, listUserStats } from "@/lib/admin/queries";
import { MetricCard } from "@/components/admin/metric-card";
import { DailyBarChart, DailyLineChart, StatusDonut } from "@/components/admin/charts";
import { formatDuration } from "@/lib/utils";

export const metadata = { title: "Админка — VoiceApp" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [metrics, userStats] = await Promise.all([getMetrics(), listUserStats()]);
  const top10 = userStats
    .filter((u) => u.recording_count > 0)
    .slice(0, 10);

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
