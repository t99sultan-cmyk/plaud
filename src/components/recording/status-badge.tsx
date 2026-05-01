import { Badge } from "@/components/ui/badge";
import type { RecordingStatus } from "@/types/domain";

const LABELS: Record<RecordingStatus, string> = {
  uploading: "Загружается",
  queued: "В очереди",
  transcribing: "Транскрипция",
  summarizing: "Сводка",
  ready: "Готово",
  failed: "Ошибка",
};

const VARIANTS: Record<RecordingStatus, "default" | "secondary" | "destructive" | "outline"> = {
  uploading: "outline",
  queued: "secondary",
  transcribing: "secondary",
  summarizing: "secondary",
  ready: "default",
  failed: "destructive",
};

export function StatusBadge({ status }: { status: RecordingStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>;
}
