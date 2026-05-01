"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { initUpload, finalizeUpload } from "@/lib/actions/recordings";

export interface UploadItem {
  id: string;
  file: File;
  status: "uploading" | "finalizing" | "queued" | "ready" | "error";
  progress: number;
  recordingId?: string;
  error?: string;
}

export function useUpload(folderId: string | null) {
  const router = useRouter();
  const [items, setItems] = useState<UploadItem[]>([]);

  const update = (id: string, patch: Partial<UploadItem>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const enqueue = useCallback(
    async (file: File) => {
      const localId = crypto.randomUUID();
      setItems((prev) => [
        ...prev,
        { id: localId, file, status: "uploading", progress: 0 },
      ]);

      const init = await initUpload({
        filename: file.name,
        mimeType: file.type || "audio/mpeg",
        sizeBytes: file.size,
        folderId,
      });
      if ("error" in init) {
        update(localId, { status: "error", error: init.error });
        if (init.error === "out_of_minutes") {
          toast.error("Минуты закончились — купи пакет", {
            action: {
              label: "Купить",
              onClick: () => router.push("/checkout?plan=start"),
            },
          });
        } else {
          toast.error(`Не удалось начать загрузку: ${init.error}`);
        }
        return;
      }

      try {
        await uploadWithProgress(init.signedUrl, file, (pct) =>
          update(localId, { progress: pct }),
        );
      } catch (err) {
        update(localId, {
          status: "error",
          error: err instanceof Error ? err.message : "upload_failed",
        });
        toast.error(`Загрузка прервана: ${file.name}`);
        return;
      }

      update(localId, { status: "finalizing", progress: 100, recordingId: init.recordingId });
      const fin = await finalizeUpload(init.recordingId);
      if ("error" in fin) {
        update(localId, { status: "error", error: fin.error });
        toast.error(`Не удалось поставить в очередь: ${fin.error}`);
        return;
      }

      update(localId, { status: "queued" });
      toast.success(`${file.name} в очереди на транскрипцию`);
      router.refresh();
    },
    [folderId, router],
  );

  return { items, enqueue };
}

function uploadWithProgress(
  url: string,
  file: File,
  onProgress: (percent: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress((e.loaded / e.total) * 100);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`PUT ${xhr.status}: ${xhr.responseText.slice(0, 120)}`));
    };
    xhr.onerror = () => reject(new Error("network_error"));
    xhr.send(file);
  });
}
