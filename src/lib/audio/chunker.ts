import { mkdtemp, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runFfmpeg, probeDuration } from "./ffmpeg";

export interface AudioChunk {
  path: string;
  index: number;
  startSec: number;
  endSec: number;
}

const WHISPER_LIMIT_MB = 24; // safe under 25MB Whisper limit
const OVERLAP_SEC = 2;

/**
 * Estimate seconds per chunk to stay under Whisper's size limit, given the
 * source file's bitrate. Re-encode chunks to mono 16kHz Opus (.ogg) for both
 * smaller size and consistent format.
 *
 * Opus at 24kbps mono ≈ 180KB/min, so 1 hour ≈ 11MB — we can fit huge chunks.
 * We still cap at 10 min/chunk to keep Whisper latency reasonable.
 */
const TARGET_BITRATE_KBPS = 24;
const MAX_CHUNK_SEC = 600;

function chunkSeconds(): number {
  // Bytes per second at target bitrate
  const bytesPerSec = (TARGET_BITRATE_KBPS * 1024) / 8;
  const maxBytes = WHISPER_LIMIT_MB * 1024 * 1024;
  return Math.min(MAX_CHUNK_SEC, Math.floor(maxBytes / bytesPerSec));
}

/**
 * Split an audio file into ≤24MB Opus chunks with small overlap.
 * Returns chunks in order; caller is responsible for cleanup of the temp dir.
 */
export async function splitForWhisper(
  inputPath: string,
): Promise<{ chunks: AudioChunk[]; tempDir: string; durationSec: number }> {
  const durationSec = await probeDuration(inputPath);
  const tempDir = await mkdtemp(join(tmpdir(), "plaud-chunks-"));

  const stride = chunkSeconds() - OVERLAP_SEC;
  const chunks: AudioChunk[] = [];

  let i = 0;
  let cursor = 0;
  while (cursor < durationSec) {
    const startSec = cursor === 0 ? 0 : cursor - OVERLAP_SEC;
    const length = Math.min(chunkSeconds(), durationSec - startSec);
    const endSec = startSec + length;
    const outPath = join(tempDir, `chunk-${String(i).padStart(3, "0")}.ogg`);

    await runFfmpeg([
      "-y",
      "-ss",
      String(startSec),
      "-t",
      String(length),
      "-i",
      inputPath,
      "-vn",
      "-ac",
      "1",
      "-ar",
      "16000",
      "-c:a",
      "libopus",
      "-b:a",
      `${TARGET_BITRATE_KBPS}k`,
      outPath,
    ]);

    const sz = (await stat(outPath)).size;
    if (sz > WHISPER_LIMIT_MB * 1024 * 1024) {
      throw new Error(
        `Chunk ${i} ended up at ${(sz / 1024 / 1024).toFixed(2)}MB — over Whisper limit`,
      );
    }

    chunks.push({ path: outPath, index: i, startSec, endSec });
    i += 1;
    cursor += stride;
  }

  return { chunks, tempDir, durationSec };
}
