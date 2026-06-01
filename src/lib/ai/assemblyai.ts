/**
 * AssemblyAI client — submit + poll for transcription with speaker labels.
 *
 * Replaces the Whisper + ffmpeg + chunker pipeline. AssemblyAI handles:
 * - Files of any size (we pass a signed URL, they download directly)
 * - Speaker diarization (utterances tagged with A/B/C/...)
 * - Auto language detection (ru/kk/en + 90 more) — OR explicit language_code
 * - Punctuation and formatting
 * - word_boost for proper nouns / domain terms supplied by the user
 */

const API_BASE = "https://api.assemblyai.com/v2";

// AssemblyAI's word_boost takes individual tokens — caps at 1000 and rejects
// tokens with non-word chars. Strip punctuation and split into words.
const WORD_BOOST_MAX = 1000;

function key() {
  const k = process.env.ASSEMBLYAI_API_KEY;
  if (!k) throw new Error("ASSEMBLYAI_API_KEY not set");
  return k;
}

async function aaiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      authorization: key(),
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AssemblyAI ${path} HTTP ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export interface AAIUtterance {
  speaker: string; // "A", "B", "C", ...
  text: string;
  start: number; // ms
  end: number; // ms
  confidence: number;
}

export interface AAITranscriptResponse {
  id: string;
  status: "queued" | "processing" | "completed" | "error";
  text?: string;
  language_code?: string;
  audio_duration?: number; // seconds
  utterances?: AAIUtterance[] | null;
  error?: string;
}

export interface SubmitOptions {
  /** ISO language code ("ru", "en", "kk"). When null/undefined → auto-detect. */
  language?: string | null;
  /** Free-form context — tokenised into word_boost terms. */
  context?: string | null;
}

/** Extract distinct word tokens from a free-form context string. */
function buildWordBoost(context: string | null | undefined): string[] {
  if (!context) return [];
  // AssemblyAI accepts \w+ tokens; treat Cyrillic + Latin equally.
  const tokens = context
    .normalize("NFC")
    .replace(/[«»"'`„“”\-—–]/g, " ")
    .split(/[\s.,;:!?()\[\]{}<>/\\|]+/u)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && t.length <= 40);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of tokens) {
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
    if (out.length >= WORD_BOOST_MAX) break;
  }
  return out;
}

/**
 * Submit an audio URL for transcription. Returns the transcript ID — call
 * `getTranscript(id)` until `status === "completed"`.
 */
export async function submitTranscription(
  audioUrl: string,
  options: SubmitOptions = {},
): Promise<string> {
  const wordBoost = buildWordBoost(options.context);
  const hasLanguage = options.language && options.language !== "auto";

  const body: Record<string, unknown> = {
    audio_url: audioUrl,
    speaker_labels: true,
    punctuate: true,
    format_text: true,
    // universal-2: stable multilingual model — supports Russian + Kazakh +
    // English + ~90 langs with speaker diarization. universal-3-pro is more
    // accurate but English-only as of 2026.
    speech_model: "universal-2",
  };

  if (hasLanguage) {
    body.language_code = options.language;
  } else {
    body.language_detection = true;
  }

  if (wordBoost.length > 0) {
    body.word_boost = wordBoost;
    body.boost_param = "high"; // weight: low/default/high
  }

  const data = await aaiFetch<AAITranscriptResponse>("/transcript", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data.id;
}

export async function getTranscript(id: string): Promise<AAITranscriptResponse> {
  return aaiFetch<AAITranscriptResponse>(`/transcript/${id}`);
}
