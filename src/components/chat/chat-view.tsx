"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/domain";

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
      <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Чат будет доступен после транскрипции.
      </div>
    );
  }

  async function send() {
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    setPending(true);
    setStreamingText("");

    const userMsg: Message = {
      id: crypto.randomUUID(),
      chat_id: "",
      user_id: "",
      role: "user",
      content: text,
      tokens_in: null,
      tokens_out: null,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);

    try {
      const res = await fetch(`/api/chat/${recordingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
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

  return (
    <div className="flex h-[70vh] flex-col rounded-lg border border-border bg-card">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && !streamingText && (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            <div>
              <p>Спроси что-то про эту запись.</p>
              <p className="mt-1 text-xs">
                Например: «О чём была встреча?», «Что решили по бюджету?»
              </p>
            </div>
          </div>
        )}
        <ul className="space-y-4">
          {messages.map((m) => (
            <ChatBubble key={m.id} role={m.role} content={m.content} />
          ))}
          {streamingText && <ChatBubble role="assistant" content={streamingText} streaming />}
        </ul>
      </div>
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Спроси что-нибудь… (Enter — отправить)"
            rows={1}
            className="min-h-[40px] resize-none"
            disabled={pending}
          />
          <Button onClick={send} disabled={pending || !input.trim()} size="icon">
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
    <li
      className={cn(
        "flex",
        role === "user" ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3 py-2 text-sm",
          role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-0">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {streaming && (
          <span className="ml-1 inline-block size-1.5 animate-pulse rounded-full bg-current align-middle" />
        )}
      </div>
    </li>
  );
}
