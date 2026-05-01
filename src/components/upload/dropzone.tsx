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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: 500 * 1024 * 1024,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card px-6 py-10 text-center transition-colors hover:border-primary/50 hover:bg-accent/40",
          isDragActive && "border-primary bg-primary/5",
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="size-8 text-muted-foreground" />
        <p className="text-sm font-medium">
          {isDragActive ? "Отпусти, чтобы загрузить" : "Перетащи аудио или нажми для выбора"}
        </p>
        <p className="text-xs text-muted-foreground">
          mp3 · m4a · wav · ogg · webm · flac · до 500MB
        </p>
      </div>
      {items.length > 0 && <UploadQueue items={items} />}
    </div>
  );
}
