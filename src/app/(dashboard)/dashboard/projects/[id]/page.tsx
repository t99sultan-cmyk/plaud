import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Dropzone } from "@/components/upload/dropzone";
import { RecordingList } from "@/components/recording/recording-list";
import { formatDuration } from "@/lib/utils";
import type { Recording } from "@/types/domain";

export default async function ProjectPage({
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

  const list = (recordings ?? []) as Recording[];
  const totalSec = list.reduce((sum, r) => sum + (r.duration_sec ?? 0), 0);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-6 py-8">
      <nav
        aria-label="breadcrumb"
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link href="/dashboard" className="hover:text-foreground">
          Все записи
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{folder.name}</span>
      </nav>

      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold tracking-tight">{folder.name}</h1>
          <p className="text-sm text-muted-foreground">
            Перетащи аудио — оно автоматически привяжется к этому проекту.
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

      <Dropzone folderId={folder.id} />
      <RecordingList initial={list} />
    </div>
  );
}
