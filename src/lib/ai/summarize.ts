import { z } from "zod";
import { claude, CLAUDE_MODEL } from "./claude";

export const summarySchema = z.object({
  tldr: z.string().min(1),
  bullets: z.array(z.string()).min(1).max(15),
  takeaways: z.array(z.string()).min(1).max(10),
  topics: z.array(z.string()).max(10).default([]),
});

export type SummaryShape = z.infer<typeof summarySchema>;

const SYSTEM_PROMPT = `Ты — ассистент, который делает краткое содержание аудио-записей по их транскрипту.
Отвечай ТОЛЬКО валидным JSON по схеме:
{
  "tldr": "1-3 предложения главной сути",
  "bullets": ["буллет 1", "буллет 2", ...],
  "takeaways": ["ключевой вывод 1", ...],
  "topics": ["тема 1", "тема 2", ...]
}

Правила:
- Пиши на том же языке, что и транскрипт.
- bullets: 5–10 пунктов с фактами, цифрами, именами.
- takeaways: 3–5 главных выводов или решений.
- topics: 3–7 тем (одно-два слова каждая).
- Никаких markdown, никаких пояснений, ТОЛЬКО JSON.`;

/**
 * Generate a structured summary of a transcript using Claude.
 * Uses prompt caching on the system prompt for cheaper repeat runs.
 */
export async function summarize(transcript: string): Promise<SummaryShape> {
  const response = await claude().messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Транскрипт:\n\n${transcript}\n\nВерни JSON по схеме.`,
      },
    ],
  });

  const block = response.content[0];
  if (block.type !== "text") {
    throw new Error("Unexpected Claude response type");
  }

  const jsonMatch = block.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in Claude response");
  }

  return summarySchema.parse(JSON.parse(jsonMatch[0]));
}
