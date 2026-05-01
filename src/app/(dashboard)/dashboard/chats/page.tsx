import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Чаты — VoiceApp" };
export const dynamic = "force-dynamic";

interface ChatRow {
  id: string;
  recording_id: string;
}

interface ChatPreview {
  chat_id: string;
  recording_id: string;
  recording_title: string;
  message_count: number;
  last_message_at: string;
  last_user_question: string | null;
  last_assistant_reply: string | null;
}

export default async function ChatsPage() {
  const supabase = await createClient();

  // Load all chats for current user (RLS filters)
  const { data: chats } = await supabase
    .from("chats")
    .select("id, recording_id")
    .order("created_at", { ascending: false });

  const chatRows = (chats ?? []) as ChatRow[];
  if (chatRows.length === 0) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-8 px-6 py-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <Header empty />
        <EmptyState />
      </div>
    );
  }

  // Pull recording titles + last message per chat in parallel
  const recordingIds = chatRows.map((c) => c.recording_id);
  const chatIds = chatRows.map((c) => c.id);

  const [{ data: recs }, { data: messages }] = await Promise.all([
    supabase.from("recordings").select("id, title").in("id", recordingIds),
    supabase
      .from("messages")
      .select("chat_id, role, content, created_at")
      .in("chat_id", chatIds)
      .order("created_at", { ascending: false }),
  ]);

  const titleByRecId = new Map((recs ?? []).map((r) => [r.id, r.title]));
  const messagesByChat = new Map<string, typeof messages>();
  for (const m of messages ?? []) {
    const arr = messagesByChat.get(m.chat_id) ?? [];
    arr.push(m);
    messagesByChat.set(m.chat_id, arr);
  }

  const previews: ChatPreview[] = chatRows
    .map((c) => {
      const msgs = messagesByChat.get(c.id) ?? [];
      const lastUser = msgs.find((m) => m.role === "user");
      const lastAssistant = msgs.find((m) => m.role === "assistant");
      const last = msgs[0]; // most recent message
      return {
        chat_id: c.id,
        recording_id: c.recording_id,
        recording_title:
          titleByRecId.get(c.recording_id) ?? "(запись недоступна)",
        message_count: msgs.length,
        last_message_at: last?.created_at ?? "",
        last_user_question: lastUser?.content ?? null,
        last_assistant_reply: lastAssistant?.content ?? null,
      };
    })
    .filter((p) => p.message_count > 0)
    .sort((a, b) => b.last_message_at.localeCompare(a.last_message_at));

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-6 py-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Header count={previews.length} />
      {previews.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid gap-2.5">
          {previews.map((p) => (
            <li key={p.chat_id}>
              <Link
                href={`/dashboard/recordings/${p.recording_id}?tab=chat`}
                className="block rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <MessagesSquare className="size-4 shrink-0 text-primary" />
                      <span className="truncate font-medium">
                        {p.recording_title}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                        {p.message_count}{" "}
                        {p.message_count === 1
                          ? "сообщение"
                          : p.message_count < 5
                            ? "сообщения"
                            : "сообщений"}
                      </span>
                    </div>

                    {p.last_user_question && (
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/70">Ты:</span>{" "}
                        {p.last_user_question}
                      </p>
                    )}
                    {p.last_assistant_reply && (
                      <p className="line-clamp-2 text-sm leading-relaxed text-foreground/85">
                        {p.last_assistant_reply}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {formatRelativeTime(p.last_message_at)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Header({ count, empty }: { count?: number; empty?: boolean }) {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Чаты</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {empty
          ? "История твоих диалогов с записями появится здесь."
          : `Всего ${count} ${count === 1 ? "диалог" : count && count < 5 ? "диалога" : "диалогов"}. Кликни, чтобы продолжить.`}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-card px-6 py-14 text-center">
      <MessagesSquare className="mx-auto size-9 text-muted-foreground/70" />
      <p className="mt-3 font-medium">Пока нет чатов</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Загрузи запись и спроси что-нибудь по ней — диалог появится здесь.
      </p>
      <Link
        href="/dashboard"
        className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
      >
        Загрузить запись →
      </Link>
    </div>
  );
}
