import type { TranscriptSegment } from "@/types/domain";

interface ChunkResult {
  startSec: number;
  endSec: number;
  segments: TranscriptSegment[];
}

/**
 * Stitch per-chunk Whisper segments into a single ordered list.
 * - Offsets each segment by its chunk's startSec.
 * - Drops segments whose midpoint falls in the overlap region of a later chunk
 *   (deduplication by time range, simple heuristic).
 */
export function stitch(chunks: ChunkResult[]): {
  segments: TranscriptSegment[];
  fullText: string;
} {
  const sorted = [...chunks].sort((a, b) => a.startSec - b.startSec);
  const out: TranscriptSegment[] = [];
  let nextId = 0;

  for (let i = 0; i < sorted.length; i++) {
    const chunk = sorted[i];
    const nextStart = sorted[i + 1]?.startSec ?? Infinity;

    for (const seg of chunk.segments) {
      const absStart = seg.start + chunk.startSec;
      const absEnd = seg.end + chunk.startSec;
      const mid = (absStart + absEnd) / 2;
      // If the segment lives in the overlap region with the next chunk
      // (its midpoint is past the next chunk's startSec), skip — the next
      // chunk has the higher-fidelity copy with full preceding context.
      if (mid >= nextStart) continue;

      out.push({
        id: nextId++,
        start: absStart,
        end: absEnd,
        text: seg.text.trim(),
      });
    }
  }

  const fullText = out.map((s) => s.text).join(" ");
  return { segments: out, fullText };
}
