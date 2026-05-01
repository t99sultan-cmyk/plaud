export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 md:space-y-8 md:px-6 md:py-8">
      <div className="space-y-3">
        <div className="h-8 w-48 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-72 rounded bg-muted/60 animate-pulse" />
      </div>

      {/* Dropzone skeleton */}
      <div className="rounded-2xl border-2 border-dashed border-border/60 bg-card px-6 py-14 flex flex-col items-center gap-4">
        <div className="size-14 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-48 rounded bg-muted animate-pulse" />
        <div className="h-3 w-72 rounded bg-muted/60 animate-pulse" />
      </div>

      {/* List skeleton */}
      <div className="space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-border/60 bg-card px-4 py-3.5"
          >
            <div className="size-12 shrink-0 rounded-xl bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-muted/60 animate-pulse" />
            </div>
            <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
