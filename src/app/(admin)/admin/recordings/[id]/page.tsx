import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Eye, FileText, MessagesSquare, Sparkles } from "lucide-react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getFeedback, getUser } from "@/lib/admin/queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranscriptView } from "@/components/recording/transcript-view";
import { SummaryView } from "@/components/recording/summary-view";
import { StatusBadge } from "@/components/recording/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatDuration, formatRelativeTime } from "@/lib/utils";
import type { Message, Recording, Summary, Transcript } from "@/types/domain";

export const dynamic = "force-dynamic";

export default async function AdminRecordingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supa = createAdminClient();

  const { data: recording } = await supa
    .from("recordings")
    .select("*")
    .eq("id", id)
    .single<Recording>();
  if (!recording) notFound();

  const [{ data: transcript }, { data: summary }, { data: chat }, owner, feedback] =
    await Promise.all([
      supa
        .from("transcripts")
        .select("*")
        .eq("recording_id", id)
        .maybeSingle<Transcript>(),
      supa
        .from("summaries")
        .select("*")
        .eq("recording_id", id)
        .maybeSingle<Summary>(),
      supa
        .from("chats")
        .select("id")
        .eq("recording_id", id)
        .maybeSingle(),
      getUser(recording.user_id),
      getFeedback(id),
    ]);

  let messages: Message[] = [];
  if (chat?.id) {
    const { data } = await supa
      .from("messages")
      .select("*")
      .eq("chat_id", chat.id)
      .order("created_at", { ascending: true });
    messages = (data ?? []) as Message[];
  }

  const { data: signedAudio } = await supa.storage
    .from("recordings")
    .createSignedUrl(recording.storage_path, 60 * 60);
  const audioUrl = signedAudio?.signedUrl ?? "";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/recordings"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          <ChevronLeft className="size-4" />Назад
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-700 dark:text-amber-400">
          <Eye className="size-3.5" />
          Admin view: {owner?.email ?? "—"}
        </span>
      </div>

      <header className="space-y-2.5">
        <div className="flex items-start gap-3">
          <h1 className="flex-1 text-3xl font-semibold tracking-tight">
            {recording.title}
          </h1>
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

      {feedback && (
        <div
          className={cn(
            "rounded-xl border p-4",
            feedback.rating === 1 &&
              "border-emerald-500/30 bg-emerald-500/5",
            feedback.rating === -1 && "border-rose-500/30 bg-rose-500/5",
            feedback.rating === 0 && "border-border/60 bg-card",
          )}
        >
          <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {feedback.rating === 1 && (
              <>
                <ThumbsUp className="size-3.5 text-emerald-600" /> Положительный отзыв
              </>
            )}
            {feedback.rating === -1 && (
              <>
                <ThumbsDown className="size-3.5 text-rose-600" /> Негативный отзыв
              </>
            )}
            {feedback.rating === 0 && <>Отзыв</>}
            <span className="ml-auto text-[11px] normal-case text-muted-foreground">
              {formatRelativeTime(feedback.updated_at)}
            </span>
          </div>
          {feedback.comment ? (
            <p className="whitespace-pre-wrap text-sm">{feedback.comment}</p>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              Оценка без комментария
            </p>
          )}
        </div>
      )}

      <Tabs defaultValue="transcript">
        <TabsList>
          <TabsTrigger value="transcript" className="gap-1.5">
            <FileText className="size-3.5" />
            Транскрипт
          </TabsTrigger>
          <TabsTrigger value="summary" className="gap-1.5">
            <Sparkles className="size-3.5" />
            Краткое содержание
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-1.5">
            <MessagesSquare className="size-3.5" />
            Чат ({messages.length})
          </TabsTrigger>
        </TabsList>
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
          {messages.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 bg-card p-8 text-center text-sm text-muted-foreground">
              Пользователь ещё не задавал вопросов по этой записи.
            </div>
          ) : (
            <ul className="space-y-3 rounded-xl border border-border/60 bg-card p-4">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    m.role === "user"
                      ? "ml-auto max-w-[85%] bg-primary/10"
                      : "max-w-[85%] bg-muted",
                  )}
                >
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {m.role === "user" ? "Пользователь" : "Ассистент"}
                  </p>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
