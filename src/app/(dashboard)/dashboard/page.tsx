import { createClient } from "@/lib/supabase/server";
import { Dropzone } from "@/components/upload/dropzone";
import { RecordingList } from "@/components/recording/recording-list";
import { formatDuration } from "@/lib/utils";
import type { Recording } from "@/types/domain";

export const metadata = { title: "Все записи — VoiceApp" };

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: recordings } = await supabase
    .from("recordings")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (recordings ?? []) as Recording[];
  const totalSec = list.reduce((sum, r) => sum + (r.duration_sec ?? 0), 0);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-6 py-8">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold tracking-tight">Все записи</h1>
          <p className="text-sm text-muted-foreground">
            Загрузи аудио — мы расшифруем, сделаем сводку и подготовим чат.
          </p>
        </div>
        {list.length > 0 && (
          <div className="hidden text-right text-xs text-muted-foreground sm:block">
            <span className="font-medium text-foreground">{list.length}</span>{" "}
            {list.length === 1 ? "запись" : list.length < 5 ? "записи" : "записей"}
            {totalSec > 0 && (
              <> · <span className="font-medium text-foreground">{formatDuration(totalSec)}</span></>
            )}
          </div>
        )}
      </div>
      <Dropzone folderId={null} />
      <RecordingList initial={list} />
    </div>
  );
}
