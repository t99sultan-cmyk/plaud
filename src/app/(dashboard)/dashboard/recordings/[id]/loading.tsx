export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 px-4 py-4 md:space-y-6 md:px-6 md:py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-24 rounded-md bg-muted animate-pulse" />
        <div className="flex gap-2">
          <div className="size-10 rounded-md bg-muted animate-pulse" />
          <div className="size-10 rounded-md bg-muted animate-pulse" />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-3">
        <div className="h-9 w-3/4 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-48 rounded bg-muted/60 animate-pulse" />
      </div>

      {/* Tabs row */}
      <div className="flex gap-2 border-b border-border/40 pb-2">
        <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />
        <div className="h-8 w-32 rounded-md bg-muted/60 animate-pulse" />
        <div className="h-8 w-16 rounded-md bg-muted/60 animate-pulse" />
      </div>

      {/* Audio player skeleton */}
      <div className="rounded-2xl border border-border/60 bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="size-10 shrink-0 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-12 rounded-md bg-muted/40 animate-pulse" />
            <div className="flex justify-between">
              <div className="h-2 w-8 rounded bg-muted animate-pulse" />
              <div className="h-2 w-8 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Content lines */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
        {[80, 90, 65, 75, 88, 70, 82].map((w, i) => (
          <div
            key={i}
            className="h-4 rounded bg-muted/60 animate-pulse"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}
