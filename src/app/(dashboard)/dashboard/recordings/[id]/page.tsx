import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TranscriptView } from "@/components/recording/transcript-view";
import { SummaryView } from "@/components/recording/summary-view";
import { ChatView } from "@/components/chat/chat-view";
import { StatusBadge } from "@/components/recording/status-badge";
import { RecordingActions } from "@/components/recording/recording-actions";
import type { Message, Recording, Summary, Transcript } from "@/types/domain";
import { formatDuration, formatRelativeTime } from "@/lib/utils";

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

  const [{ data: transcript }, { data: summary }, { data: chat }] = await Promise.all([
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

  // Sign a URL for audio playback
  const { data: signedAudio } = await supabase.storage
    .from("recordings")
    .createSignedUrl(recording.storage_path, 60 * 60); // 1 hour
  const audioUrl = signedAudio?.signedUrl ?? "";

  const inProgress =
    recording.status === "queued" ||
    recording.status === "transcribing" ||
    recording.status === "summarizing" ||
    recording.status === "uploading";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          <ChevronLeft className="size-4" />
          Назад
        </Link>
        <RecordingActions recording={recording} />
      </div>

      <header className="space-y-2">
        <div className="flex items-start gap-3">
          <h1 className="flex-1 text-2xl font-semibold tracking-tight">
            {recording.title}
          </h1>
          <StatusBadge status={recording.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {formatDuration(recording.duration_sec)} · {formatRelativeTime(recording.created_at)}
          {recording.error_message && (
            <>
              {" · "}
              <span className="text-destructive">{recording.error_message}</span>
            </>
          )}
        </p>
      </header>

      {inProgress && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-sm">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>
            {recording.status === "uploading" && "Загружаем файл…"}
            {recording.status === "queued" && "В очереди на транскрипцию…"}
            {recording.status === "transcribing" && "Идёт транскрипция…"}
            {recording.status === "summarizing" && "Генерируем краткое содержание…"}
          </span>
        </div>
      )}

      <Tabs defaultValue="transcript">
        <TabsList>
          <TabsTrigger value="transcript">Транскрипт</TabsTrigger>
          <TabsTrigger value="summary">Краткое содержание</TabsTrigger>
          <TabsTrigger value="chat">Q&A чат</TabsTrigger>
        </TabsList>
        <TabsContent value="transcript" className="mt-4">
          <TranscriptView
            audioUrl={audioUrl}
            durationSec={recording.duration_sec}
            segments={transcript?.segments ?? []}
          />
        </TabsContent>
        <TabsContent value="summary" className="mt-4">
          <SummaryView summary={summary ?? null} />
        </TabsContent>
        <TabsContent value="chat" className="mt-4">
          <ChatView
            recordingId={recording.id}
            initialMessages={messages}
            ready={recording.status === "ready"}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
