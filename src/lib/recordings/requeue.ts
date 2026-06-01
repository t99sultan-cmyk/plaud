import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db/types";
import { inngest } from "@/lib/inngest/client";

/**
 * Re-queue a stuck/failed recording for processing.
 *
 * If a transcript already exists we only re-run summarization (re-send
 * `transcript.ready`) — this avoids paying for a full re-transcription and,
 * importantly, avoids deducting the user's minutes a second time. Otherwise
 * the whole pipeline restarts from `recording.uploaded`.
 *
 * The caller passes the Supabase client whose RLS scope is appropriate: the
 * user-scoped server client for self-service retry, or the admin client for
 * admin-initiated recovery of another user's recording.
 */
export async function requeueRecording(
  supa: SupabaseClient<Database>,
  recordingId: string,
): Promise<{ ok: true } | { error: string }> {
  const { data: transcript } = await supa
    .from("transcripts")
    .select("recording_id")
    .eq("recording_id", recordingId)
    .maybeSingle();
  const hasTranscript = !!transcript;

  const { error: updErr } = await supa
    .from("recordings")
    .update({
      status: hasTranscript ? "summarizing" : "queued",
      error_message: null,
    })
    .eq("id", recordingId);
  if (updErr) return { error: updErr.message };

  try {
    await inngest.send({
      name: hasTranscript ? "transcript.ready" : "recording.uploaded",
      data: { recordingId },
    });
  } catch {
    // The status update above succeeded but the event never left — flip to
    // `failed` so the recording doesn't silently sit in a processing state.
    await supa
      .from("recordings")
      .update({
        status: "failed",
        error_message:
          "Не удалось переотправить запись в очередь обработки. Попробуй ещё раз.",
      })
      .eq("id", recordingId);
    return { error: "queue_failed" };
  }

  return { ok: true };
}
