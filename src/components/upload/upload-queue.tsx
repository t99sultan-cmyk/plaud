"use client";

import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { UploadItem } from "@/hooks/use-upload";

export function UploadQueue({ items }: { items: UploadItem[] }) {
  return (
    <ul className="space-y-2 rounded-lg border border-border bg-card p-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3">
          <StatusIcon status={item.status} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(item.file.size)}
              {item.status === "uploading" && ` · ${Math.round(item.progress)}%`}
              {item.status === "queued" && " · в очереди на транскрипцию"}
              {item.status === "ready" && " · готово"}
              {item.status === "error" && ` · ${item.error}`}
            </p>
            {item.status === "uploading" && (
              <Progress value={item.progress} className="mt-1 h-1" />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function StatusIcon({ status }: { status: UploadItem["status"] }) {
  if (status === "uploading" || status === "finalizing")
    return <Loader2 className="size-4 animate-spin text-primary" />;
  if (status === "queued" || status === "ready")
    return <CheckCircle2 className="size-4 text-green-600" />;
  if (status === "error") return <AlertCircle className="size-4 text-destructive" />;
  return <Loader2 className={cn("size-4 text-muted-foreground")} />;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
