import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Dropzone } from "@/components/upload/dropzone";
import { RecordingList } from "@/components/recording/recording-list";
import type { Recording } from "@/types/domain";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: folder } = await supabase
    .from("folders")
    .select("*")
    .eq("id", id)
    .single();
  if (!folder) notFound();

  const { data: recordings } = await supabase
    .from("recordings")
    .select("*")
    .eq("folder_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{folder.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Загруженные сюда аудио будут привязаны к этой папке.
        </p>
      </div>
      <Dropzone folderId={folder.id} />
      <RecordingList initial={(recordings ?? []) as Recording[]} />
    </div>
  );
}
