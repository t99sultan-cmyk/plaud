import { createClient } from "@/lib/supabase/server";
import { Dropzone } from "@/components/upload/dropzone";
import { RecordingList } from "@/components/recording/recording-list";
import type { Recording } from "@/types/domain";

export const metadata = { title: "Все записи — VoiceApp" };

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: recordings } = await supabase
    .from("recordings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-6 py-8">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight">Все записи</h1>
        <p className="text-sm text-muted-foreground">
          Загрузи аудио — мы расшифруем, сделаем краткое содержание и подготовим чат.
        </p>
      </div>
      <Dropzone folderId={null} />
      <RecordingList initial={(recordings ?? []) as Recording[]} />
    </div>
  );
}
