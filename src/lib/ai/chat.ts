import { claude, CLAUDE_MODEL } from "./claude";
import type { Message } from "@/types/domain";

const SYSTEM_PROMPT = `Ты — внимательный ассистент, который отвечает на вопросы пользователя по конкретной аудио-записи. Тебе дан её транскрипт в теге <transcript>.

Принципы:
- Отвечай на том же языке, на котором задан вопрос.
- Опирайся СТРОГО на содержимое транскрипта. Не выдумывай, не достраивай контекст. Если ответа в транскрипте нет — честно скажи "В записи об этом не упоминается".
- Подтверждай ключевые утверждения **прямой цитатой из транскрипта в кавычках**. Цитата должна быть короткой (одна фраза) и максимально дословной.
- Сохраняй цифры, имена, даты, термины ровно так, как они звучат в записи.
- Структурируй ответ. Для перечислений — markdown-списки. Для важных слов — **жирный**. Без визуального шума.
- Будь краток. Сначала прямой ответ, затем 1–2 коротких подтверждающих цитаты или пояснения. Не пересказывай весь транскрипт.
- Если вопрос неоднозначный — задай уточняющий вопрос вместо догадок.`;

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
