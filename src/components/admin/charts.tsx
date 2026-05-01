"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function DailyBarChart({
  data,
  color = "var(--primary)",
}: {
  data: { date: string; count: number }[];
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          tickFormatter={(v: string) => v.slice(5)}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          width={28}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelFormatter={(v) => `Дата: ${v}`}
          formatter={(v) => [String(v), "Количество"] as [string, string]}
        />
        <Bar dataKey="count" fill={color} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DailyLineChart({
  data,
  color = "var(--primary)",
}: {
  data: { date: string; count: number }[];
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          tickFormatter={(v: string) => v.slice(5)}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          width={28}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelFormatter={(v) => `Дата: ${v}`}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

const STATUS_COLORS: Record<string, string> = {
  uploading: "#94a3b8",
  queued: "#3b82f6",
  transcribing: "#8b5cf6",
  summarizing: "#a855f7",
  ready: "#10b981",
  failed: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  uploading: "Загружается",
  queued: "В очереди",
  transcribing: "Транскрипция",
  summarizing: "Сводка",
  ready: "Готово",
  failed: "Ошибка",
};

export function StatusDonut({
  data,
}: {
  data: Record<string, number>;
}) {
  const items = Object.entries(data)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => ({
      key,
      name: STATUS_LABELS[key] ?? key,
      value: count,
      color: STATUS_COLORS[key] ?? "#888",
    }));

  if (items.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
        Нет данных
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={items}
            dataKey="value"
            nameKey="name"
            innerRadius={45}
            outerRadius={75}
            stroke="var(--background)"
            strokeWidth={2}
          >
            {items.map((it) => (
              <Cell key={it.key} fill={it.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <ul className="space-y-1.5 text-xs">
        {items.map((it) => (
          <li key={it.key} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ background: it.color }}
            />
            <span className="text-muted-foreground">{it.name}</span>
            <span className="font-medium tabular-nums">{it.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
