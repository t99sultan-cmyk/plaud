/**
 * AssemblyAI client — submit + poll for transcription with speaker labels.
 *
 * Replaces the Whisper + ffmpeg + chunker pipeline. AssemblyAI handles:
 * - Files of any size (we pass a signed URL, they download directly)
 * - Speaker diarization (utterances tagged with A/B/C/...)
 * - Auto language detection (ru/kk/en + 90 more)
 * - Punctuation and formatting
 */

const API_BASE = "https://api.assemblyai.com/v2";

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

/**
 * Submit an audio URL for transcription. Returns the transcript ID — call
 * `getTranscript(id)` until `status === "completed"`.
 */
export async function submitTranscription(audioUrl: string): Promise<string> {
  const body = {
    audio_url: audioUrl,
    speaker_labels: true,
    language_detection: true,
    punctuate: true,
    format_text: true,
    // universal-2: stable multilingual model, supports Russian + Kazakh +
    // English + ~90 langs, with speaker diarization. universal-3-pro is
    // higher accuracy but English-only as of 2026 — won't work for our users.
    speech_models: ["universal-2"],
  };
  const data = await aaiFetch<AAITranscriptResponse>("/transcript", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data.id;
}

export async function getTranscript(id: string): Promise<AAITranscriptResponse> {
  return aaiFetch<AAITranscriptResponse>(`/transcript/${id}`);
}
