import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  unit,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  accent?: "primary" | "emerald" | "amber" | "rose";
}) {
  const accentBar: Record<string, string> = {
    primary: "from-primary/30 to-transparent",
    emerald: "from-emerald-500/30 to-transparent",
    amber: "from-amber-500/30 to-transparent",
    rose: "from-rose-500/30 to-transparent",
  };
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5">
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-gradient-to-r",
          accentBar[accent ?? "primary"],
        )}
      />
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
