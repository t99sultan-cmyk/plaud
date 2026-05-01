"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpload } from "@/hooks/use-upload";
import { UploadQueue } from "./upload-queue";

const ACCEPT = {
  "audio/*": [".mp3", ".m4a", ".wav", ".ogg", ".webm", ".flac", ".aac"],
};

export function Dropzone({ folderId }: { folderId: string | null }) {
  const { items, enqueue } = useUpload(folderId);

  const onDrop = useCallback(
    (files: File[]) => {
      files.forEach(enqueue);
    },
    [enqueue],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: 500 * 1024 * 1024,
    noClick: true,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "group relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card px-6 py-14 text-center transition-colors hover:border-primary/40 hover:bg-accent/30",
          isDragActive && "border-primary bg-primary/5",
        )}
      >
        <input {...getInputProps()} />
        <div
          className={cn(
            "flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform",
            isDragActive && "scale-110",
          )}
        >
          <UploadCloud className="size-6" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-medium">
            {isDragActive
              ? "Отпусти, чтобы загрузить"
              : "Перетащи аудио сюда"}
          </p>
          <p className="text-sm text-muted-foreground">
            или{" "}
            <button
              type="button"
              onClick={open}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              выбери файл с компьютера
            </button>
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          mp3 · m4a · wav · ogg · webm · flac · aac &nbsp;·&nbsp; до 500 MB
        </p>
      </div>
      {items.length > 0 && <UploadQueue items={items} />}
    </div>
  );
}
