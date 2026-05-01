import OpenAI from "openai";
import { createReadStream } from "node:fs";
import type { TranscriptSegment } from "@/types/domain";

let cached: OpenAI | null = null;

function client() {
  if (cached) return cached;
  cached = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return cached;
}

export interface WhisperResult {
  language: string;
  text: string;
  segments: TranscriptSegment[];
  duration: number;
}

/**
 * Transcribe a single audio file (≤25MB Whisper limit).
 * Use the chunker to split larger files first.
 */
export async function transcribeFile(
  filePath: string,
  opts: { language?: string; prompt?: string } = {},
): Promise<WhisperResult> {
  const response = await client().audio.transcriptions.create({
    file: createReadStream(filePath),
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
    language: opts.language,
    prompt: opts.prompt,
  });

  // The verbose_json shape from OpenAI's SDK
  const raw = response as unknown as {
    language: string;
    text: string;
    duration: number;
    segments: { id: number; start: number; end: number; text: string }[];
  };

  return {
    language: raw.language,
    text: raw.text,
    duration: raw.duration,
    segments: raw.segments.map((s) => ({
      id: s.id,
      start: s.start,
      end: s.end,
      text: s.text.trim(),
    })),
  };
}
