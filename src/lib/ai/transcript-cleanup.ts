import { claude, CLAUDE_MODEL } from "./claude";
import type { TranscriptSegment } from "@/types/domain";

const SYSTEM = `Ты — редактор автоматических транскриптов. На входе — расшифровка от ASR-системы. Она содержит:
- Возможные ошибки распознавания (омонимы, нетипичные имена, термины, неверно понятые из-за акцента слова).
- Возможные опечатки и склейки слов.
- Метки спикеров вида "Спикер A:", "Спикер B:" — НЕ удаляй и не переименовывай их.

Твоя задача — выдать ИСПРАВЛЕННЫЙ транскрипт.

Правила:
1. Сохраняй смысл и стиль речи говорящих. НЕ переписывай, НЕ сокращай, НЕ обобщай.
2. Сохраняй число строк/реплик и их порядок. Метки "Спикер X:" — на месте.
3. Чини только то, что выглядит как ошибка распознавания: имена собственные, профессиональные термины, технические слова, явные опечатки.
4. Если пользователь дал контекст в теге <context> — используй его для понимания, какие имена/термины ожидать.
5. Не добавляй ничего от себя — никаких комментариев, мета-заметок, пояснений в скобках.
6. Сохраняй пунктуацию AAI; правь её только при явной ошибке.
7. Сохраняй язык говорящего. Если в записи звучит русский — оставляй русский. Если казахский — казахский. Не переводи.

Верни ТОЛЬКО исправленный текст транскрипта, ничего больше.`;

export interface CleanupArgs {
  fullText: string;
  context?: string | null;
  language?: string | null;
}

/**
 * Post-process the raw ASR transcript through Claude to fix recognition
 * errors (names, terms, homophones). Returns the cleaned-up text. On any
 * failure returns the original input — never blocks the pipeline.
 */
export async function cleanupTranscript({
  fullText,
  context,
  language,
}: CleanupArgs): Promise<string> {
  // Bail out on tiny / empty transcripts — nothing meaningful to fix.
  if (!fullText || fullText.length < 30) return fullText;

  const userParts: string[] = [];
  if (context && context.trim()) {
    userParts.push(`<context>\n${context.trim()}\n</context>`);
  }
  if (language) {
    userParts.push(`<language>${language}</language>`);
  }
  userParts.push(`<transcript>\n${fullText}\n</transcript>`);

  try {
    // 16k output tokens should cover ~12k words — enough for ~80 min of speech.
    // Longer transcripts will be truncated; we fall back to the original below.
    const res = await claude().messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 16000,
      system: SYSTEM,
      messages: [{ role: "user", content: userParts.join("\n\n") }],
    });
    const block = res.content.find((b) => b.type === "text");
    const cleaned = block && "text" in block ? block.text.trim() : "";
    if (!cleaned) return fullText;
    // Quick sanity check: if Claude shrunk the transcript by more than 30 %,
    // assume it summarised against the rules — fall back to the original.
    if (cleaned.length < fullText.length * 0.7) return fullText;
    return cleaned;
  } catch {
    return fullText;
  }
}

/**
 * Apply cleaned full-text back to segment text. We re-join the cleaned text
 * to segments by aligning on speaker boundaries; if alignment is impossible
 * (Claude reorganised the structure), we keep the original segments and the
 * cleaned `full_text` separately.
 */
export function realignSegments(
  segments: TranscriptSegment[],
  cleanedFullText: string,
): TranscriptSegment[] {
  if (segments.length === 0) return segments;

  // Split cleaned text by speaker markers preserving order.
  const lines = cleanedFullText
    .split(/\r?\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  // If we can't pair 1-to-1, keep originals — chat & summary still use
  // `full_text` which is the cleaned version.
  if (lines.length !== segments.length) return segments;

  return segments.map((seg, i) => {
    const line = lines[i];
    // Strip "Спикер X:" prefix if present.
    const stripped = line.replace(/^\s*Спикер\s+[A-ZА-ЯЁ]:\s*/i, "");
    return { ...seg, text: stripped || seg.text };
  });
}
