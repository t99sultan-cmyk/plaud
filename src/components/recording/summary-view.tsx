import { Sparkles } from "lucide-react";
import type { Summary } from "@/types/domain";

export function SummaryView({ summary }: { summary: Summary | null }) {
  if (!summary) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Сводка ещё генерируется. Обычно это занимает 10–30 секунд после транскрипции.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-5">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            TL;DR
          </h3>
        </div>
        <p className="text-base leading-relaxed">{summary.tldr}</p>
      </section>

      {summary.bullets.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Основные пункты
          </h3>
          <ul className="space-y-2 text-sm">
            {summary.bullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {summary.takeaways.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Ключевые выводы
          </h3>
          <ul className="space-y-2 text-sm">
            {summary.takeaways.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-green-600" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {summary.topics.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Темы
          </h3>
          <div className="flex flex-wrap gap-2">
            {summary.topics.map((t) => (
              <span
                key={t}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
