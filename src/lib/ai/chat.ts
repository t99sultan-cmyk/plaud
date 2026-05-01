import { claude, CLAUDE_MODEL } from "./claude";
import type { Message } from "@/types/domain";

const SYSTEM_PROMPT = `Ты — помощник, который отвечает на вопросы пользователя по предоставленному транскрипту аудио-записи.

Правила:
- Отвечай на том же языке, на котором задан вопрос.
- Опирайся ТОЛЬКО на транскрипт. Если ответа нет — честно скажи "В записи об этом не упоминается".
- Цитируй конкретные фразы из транскрипта в кавычках, если они подтверждают ответ.
- Если в транскрипте указано время или цифра, обязательно сохрани её в ответе.
- Будь краток. Markdown допустим (списки, **выделение**), но без воды.`;

export interface ChatStreamArgs {
  transcript: string;
  history: Pick<Message, "role" | "content">[];
  userMessage: string;
}

/**
 * Stream a Q&A response from Claude. Caches the transcript block so follow-up
 * turns within ~5 minutes are ~10x cheaper.
 */
export function streamChat({ transcript, history, userMessage }: ChatStreamArgs) {
  return claude().messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
      },
      {
        type: "text",
        text: `<transcript>\n${transcript}\n</transcript>`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: userMessage },
    ],
  });
}
