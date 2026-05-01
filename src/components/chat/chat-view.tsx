"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2, MessagesSquare, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/domain";

const EXAMPLE_QUESTIONS = [
  "О чём была эта запись?",
  "Какие ключевые решения приняли?",
  "Какие действия и кто за них отвечает?",
  "Перечисли цифры и имена, которые упоминались.",
];

export function ChatView({
  recordingId,
  initialMessages,
  ready,
}: {
  recordingId: string;
  initialMessages: Message[];
  ready: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [streamingText, setStreamingText] = useState("");
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, streamingText]);

  if (!ready) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
        <MessagesSquare className="mx-auto size-9 text-muted-foreground/70" />
        <p className="mt-3 font-medium">Чат пока не доступен</p>
        <p className="mt-1 text-sm text-muted-foreground">
          После транскрипции и сводки здесь можно будет задавать вопросы по записи.
        </p>
      </div>
    );
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setInput("");
    setPending(true);
    setStreamingText("");

    const userMsg: Message = {
      id: crypto.randomUUID(),
      chat_id: "",
      user_id: "",
      role: "user",
      content: trimmed,
      tokens_in: null,
      tokens_out: null,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);

    try {
      const res = await fetch(`/api/chat/${recordingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setStreamingText(acc);
      }

      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          chat_id: "",
          user_id: "",
          role: "assistant",
          content: acc,
          tokens_in: null,
          tokens_out: null,
          created_at: new Date().toISOString(),
        },
      ]);
      setStreamingText("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ошибка чата";
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          chat_id: "",
          user_id: "",
          role: "assistant",
          content: `_Ошибка: ${msg}_`,
          tokens_in: null,
          tokens_out: null,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  const isEmpty = messages.length === 0 && !streamingText;

  return (
    <div className="flex h-[70vh] flex-col rounded-xl border border-border bg-card">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
            <div className="space-y-1">
              <MessagesSquare className="mx-auto size-9 text-muted-foreground/70" />
              <p className="font-medium">Спроси что-нибудь по этой записи</p>
              <p className="text-sm text-muted-foreground">
                Ассистент отвечает с цитатами из транскрипта.
              </p>
            </div>
            <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
              {EXAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm text-foreground/80 transition-colors hover:border-primary/40 hover:bg-accent/40"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="space-y-4">
            {messages.map((m) => (
              <ChatBubble key={m.id} role={m.role} content={m.content} />
            ))}
            {streamingText && (
              <ChatBubble role="assistant" content={streamingText} streaming />
            )}
          </ul>
        )}
      </div>
      <div className="border-t border-border p-3 space-y-2">
        {/* Example questions — always accessible via collapsible */}
        {!isEmpty && (
          <details className="group rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <Lightbulb className="size-3.5 text-primary" />
              <span>Примеры вопросов</span>
              <span className="ml-auto transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <div className="mt-2 grid gap-1.5 pb-1 sm:grid-cols-2">
              {EXAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  disabled={pending}
                  className="rounded-md border border-border/60 bg-background px-2.5 py-1.5 text-left text-xs text-foreground/80 transition-colors hover:border-primary/40 hover:bg-accent/40 disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </details>
        )}
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Спроси что-нибудь… (Enter — отправить, Shift+Enter — новая строка)"
            rows={1}
            className="min-h-[40px] resize-none"
            disabled={pending}
          />
          <Button
            onClick={() => send(input)}
            disabled={pending || !input.trim()}
            size="icon"
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({
  role,
  content,
  streaming,
}: {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}) {
  return (
    <li className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] px-4 py-3 text-sm shadow-sm",
          role === "user"
            ? "rounded-2xl rounded-br-md bg-gradient-to-br from-primary to-primary/85 text-primary-foreground shadow-primary/15"
            : "rounded-2xl rounded-bl-md border border-border/60 bg-card text-foreground",
        )}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-p:leading-relaxed prose-li:my-0.5 prose-headings:mb-1 prose-headings:mt-2 prose-pre:my-2 prose-strong:font-semibold">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
        {streaming && (
          <span className="ml-1 inline-flex items-center gap-0.5 align-middle">
            <span className="size-1 animate-pulse rounded-full bg-current [animation-delay:0ms]" />
            <span className="size-1 animate-pulse rounded-full bg-current [animation-delay:150ms]" />
            <span className="size-1 animate-pulse rounded-full bg-current [animation-delay:300ms]" />
          </span>
        )}
      </div>
    </li>
  );
}
