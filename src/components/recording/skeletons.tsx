import { cn } from "@/lib/utils";

export function TranscriptSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/60 bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="size-10 shrink-0 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-12 rounded-md bg-muted/60 animate-pulse" />
            <div className="flex justify-between text-[10px]">
              <div className="h-2 w-8 rounded bg-muted animate-pulse" />
              <div className="h-2 w-8 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card">
        <div className="space-y-1.5 p-4">
          {[80, 95, 70, 88, 72, 90].map((width, i) => (
            <div key={i} className="flex items-start gap-3 py-2">
              <div className="mt-1.5 h-3 w-1 shrink-0 rounded bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                {i % 2 === 0 && (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-16 rounded-full bg-muted animate-pulse" />
                    <div className="h-3 w-10 rounded bg-muted animate-pulse" />
                  </div>
                )}
                <div
                  className="h-3 rounded bg-muted/60 animate-pulse"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SummarySkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonCard label="TL;DR">
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted/60 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-muted/60 animate-pulse" />
        </div>
      </SkeletonCard>
      <SkeletonCard label="Основные пункты">
        <ul className="space-y-3">
          {[90, 70, 85, 60, 75].map((w, i) => (
            <li key={i} className="flex gap-2">
              <div className="mt-2 size-1.5 shrink-0 rounded-full bg-muted animate-pulse" />
              <div
                className="h-3 rounded bg-muted/60 animate-pulse"
                style={{ width: `${w}%` }}
              />
            </li>
          ))}
        </ul>
      </SkeletonCard>
      <SkeletonCard label="Ключевые выводы">
        <ul className="space-y-3">
          {[80, 65, 75].map((w, i) => (
            <li key={i} className="flex gap-2">
              <div className="mt-2 size-1.5 shrink-0 rounded-full bg-muted animate-pulse" />
              <div
                className="h-3 rounded bg-muted/60 animate-pulse"
                style={{ width: `${w}%` }}
              />
            </li>
          ))}
        </ul>
      </SkeletonCard>
    </div>
  );
}

function SkeletonCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="size-3.5 rounded bg-muted animate-pulse" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      {children}
    </section>
  );
}

export function ChatSkeleton() {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-5")}>
      <div className="space-y-4">
        {/* Empty state shimmer */}
        <div className="flex justify-end">
          <div className="h-8 w-3/4 max-w-md rounded-2xl rounded-tr-sm bg-primary/15 animate-pulse" />
        </div>
        <div className="flex justify-start">
          <div className="h-20 w-5/6 max-w-md rounded-2xl rounded-tl-sm bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
