"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { adminRetryTranscription } from "@/lib/admin/actions";

export function AdminRetryButton({ recordingId }: { recordingId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const r = await adminRetryTranscription(recordingId);
          if ("error" in r) {
            toast.error(`Не удалось перезапустить: ${r.error}`);
          } else {
            toast.success("Запустили повторную обработку");
            router.refresh();
          }
        })
      }
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <RotateCw className="size-4" />
      )}
      Повторить
    </Button>
  );
}
