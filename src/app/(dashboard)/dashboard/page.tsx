import { createClient } from "@/lib/supabase/server";
import { Dropzone } from "@/components/upload/dropzone";
import { RecordingList } from "@/components/recording/recording-list";
import type { Recording } from "@/types/domain";

export const metadata = { title: "Все записи — Plaud Web" };

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: recordings } = await supabase
    .from("recordings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Все записи</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Загрузи аудио — мы расшифруем, сделаем краткое содержание и подготовим чат.
        </p>
      </div>
      <Dropzone folderId={null} />
      <RecordingList initial={(recordings ?? []) as Recording[]} />
    </div>
  );
}
