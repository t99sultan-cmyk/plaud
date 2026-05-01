import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  FileText,
  Loader2,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TranscriptView } from "@/components/recording/transcript-view";
import { SummaryView } from "@/components/recording/summary-view";
import { ChatView } from "@/components/chat/chat-view";
import { StatusBadge } from "@/components/recording/status-badge";
import { RecordingActions } from "@/components/recording/recording-actions";
import { ShareButton } from "@/components/recording/share-button";
import { FeedbackWidget } from "@/components/recording/feedback-widget";
import { InlineTitleEdit } from "@/components/recording/inline-title-edit";
import type {
  Folder as FolderRow,
  Message,
  Recording,
  RecordingFeedback,
  Summary,
  Transcript,
} from "@/types/domain";
import { formatDuration, formatRelativeTime } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  uploading: "Загружаем файл…",
  queued: "В очереди на транскрипцию…",
  transcribing: "Идёт транскрипция…",
  summarizing: "Генерируем краткое содержание…",
};

export default async function RecordingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: recording } = await supabase
    .from("recordings")
    .select("*")
    .eq("id", id)
    .single<Recording>();
  if (!recording) notFound();

  const [
    { data: transcript },
    { data: summary },
    { data: chat },
    { data: feedback },
    { data: folders },
  ] = await Promise.all([
    supabase
      .from("transcripts")
      .select("*")
      .eq("recording_id", id)
      .maybeSingle<Transcript>(),
    supabase
      .from("summaries")
      .select("*")
      .eq("recording_id", id)
      .maybeSingle<Summary>(),
    supabase
      .from("chats")
      .select("id")
      .eq("recording_id", id)
      .maybeSingle(),
    supabase
      .from("recording_feedback")
      .select("*")
      .eq("recording_id", id)
      .maybeSingle<RecordingFeedback>(),
    supabase
      .from("folders")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  let messages: Message[] = [];
  if (chat?.id) {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chat.id)
      .order("created_at", { ascending: true });
    messages = (data ?? []) as Message[];
  }

  const { data: signedAudio } = await supabase.storage
    .from("recordings")
    .createSignedUrl(recording.storage_path, 60 * 60);
  const audioUrl = signedAudio?.signedUrl ?? "";

  const inProgress =
    recording.status === "queued" ||
    recording.status === "transcribing" ||
    recording.status === "summarizing" ||
    recording.status === "uploading";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 px-4 py-4 animate-in fade-in slide-in-from-bottom-2 duration-500 md:space-y-6 md:px-6 md:py-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          <ChevronLeft className="size-4" />К записям
        </Link>
        <div className="flex items-center gap-2">
          {recording.status === "ready" && (
            <ShareButton
              recordingId={recording.id}
              initialToken={recording.share_token}
            />
          )}
          <RecordingActions
            recording={recording}
            folders={(folders ?? []) as FolderRow[]}
          />
        </div>
      </div>

      <header className="space-y-2.5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <InlineTitleEdit
              recordingId={recording.id}
              initialTitle={recording.title}
            />
          </div>
          <StatusBadge status={recording.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {formatDuration(recording.duration_sec)} ·{" "}
          {formatRelativeTime(recording.created_at)}
          {recording.error_message && (
            <>
              {" · "}
              <span className="text-destructive">{recording.error_message}</span>
            </>
          )}
        </p>
      </header>

      {inProgress && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-primary/5 p-4 text-sm">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>{STATUS_LABELS[recording.status] ?? "Обработка…"}</span>
        </div>
      )}

      <Tabs defaultValue="transcript">
        <div className="sticky top-0 z-10 -mx-4 border-b border-border/40 bg-background/85 px-4 py-2 backdrop-blur-md md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="transcript" className="flex-1 gap-1.5 md:flex-initial">
              <FileText className="size-3.5" />
              <span className="hidden sm:inline">Транскрипт</span>
              <span className="sm:hidden">Текст</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex-1 gap-1.5 md:flex-initial">
              <Sparkles className="size-3.5" />
              <span className="hidden sm:inline">Краткое содержание</span>
              <span className="sm:hidden">Сводка</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1 gap-1.5 md:flex-initial">
              <MessagesSquare className="size-3.5" />
              Чат
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="transcript" className="mt-5">
          <TranscriptView
            audioUrl={audioUrl}
            durationSec={recording.duration_sec}
            segments={transcript?.segments ?? []}
          />
        </TabsContent>
        <TabsContent value="summary" className="mt-5">
          <SummaryView summary={summary ?? null} />
        </TabsContent>
        <TabsContent value="chat" className="mt-5">
          <ChatView
            recordingId={recording.id}
            initialMessages={messages}
            ready={recording.status === "ready"}
          />
        </TabsContent>
      </Tabs>

      {recording.status === "ready" && (
        <FeedbackWidget recordingId={recording.id} initial={feedback ?? null} />
      )}
    </div>
  );
}
