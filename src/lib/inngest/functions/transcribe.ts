import { inngest } from "../client";
import { createAdminClient } from "@/lib/supabase/admin";
import { submitTranscription, getTranscript } from "@/lib/ai/assemblyai";
import {
  cleanupTranscript,
  realignSegments,
} from "@/lib/ai/transcript-cleanup";
import { deductMinutes } from "@/lib/credits";
import type { TranscriptSegment } from "@/types/domain";

const POLL_INTERVAL_SEC = 15;
const MAX_POLLS = 240; // up to 60 minutes — covers ~6h source audio comfortably

export const transcribeRecording = inngest.createFunction(
  {
    id: "transcribe-recording",
    retries: 2,
    triggers: [{ event: "recording.uploaded" }],
    // When all retries are exhausted, mark the recording as failed so the UI
    // stops showing an endless spinner and surfaces the "Повторить" button.
    // Without this the row stays stuck in `transcribing`/`queued` forever.
    onFailure: async ({ event, error }) => {
      // The original triggering event is nested under `event.data.event`,
      // NOT `event.data` — this is the Inngest failure-event payload shape.
      const original = event.data.event as unknown as {
        data?: { recordingId?: string };
      };
      const recordingId = original?.data?.recordingId;
      if (!recordingId) return;
      const supa = createAdminClient();
      await supa
        .from("recordings")
        .update({
          status: "failed",
          error_message: `Транскрипция не удалась: ${error.message}`.slice(0, 500),
        })
        .eq("id", recordingId)
        // Don't clobber a row that was already retried / finished / deleted.
        .in("status", ["queued", "transcribing", "summarizing"]);
    },
  },
  async ({ event, step }) => {
    const { recordingId } = event.data as { recordingId: string };
    const supa = createAdminClient();

    // 1. Load + mark transcribing
    const recording = await step.run("load-recording", async () => {
      // `select("*")` so the function still runs on databases that haven't
      // yet applied 0007_recording_context — missing columns just come back
      // undefined instead of erroring out.
      const { data, error } = await supa
        .from("recordings")
        .select("*")
        .eq("id", recordingId)
        .single();
      if (error || !data) throw new Error(`Recording not found: ${recordingId}`);
      await supa
        .from("recordings")
        .update({ status: "transcribing", error_message: null })
        .eq("id", recordingId);
      const row = data as Record<string, unknown>;
      return {
        id: row.id as string,
        user_id: row.user_id as string,
        storage_path: row.storage_path as string,
        context: (row.context as string | null | undefined) ?? null,
        language: (row.language as string | null | undefined) ?? null,
      };
    });

    // 2. Create signed URL for AssemblyAI to download the audio
    const audioUrl = await step.run("create-signed-url", async () => {
      // 6 hours — plenty of time for AAI to fetch and process
      const { data, error } = await supa.storage
        .from("recordings")
        .createSignedUrl(recording.storage_path, 60 * 60 * 6);
      if (error || !data?.signedUrl)
        throw new Error(`Signed URL failed: ${error?.message ?? "unknown"}`);
      return data.signedUrl;
    });

    // 3. Submit to AssemblyAI with optional language + word_boost from context
    const transcriptId = await step.run("submit-aai", async () => {
      return await submitTranscription(audioUrl, {
        language: recording.language,
        context: recording.context,
      });
    });

    // 4. Poll until completed
    let final: Awaited<ReturnType<typeof getTranscript>> | null = null;
    for (let i = 0; i < MAX_POLLS; i++) {
      const status = await step.run(`poll-${i}`, async () => {
        return await getTranscript(transcriptId);
      });
      if (status.status === "completed") {
        final = status;
        break;
      }
      if (status.status === "error") {
        throw new Error(`AssemblyAI failed: ${status.error ?? "unknown"}`);
      }
      // queued | processing → wait then retry
      await step.sleep(`wait-${i}`, `${POLL_INTERVAL_SEC}s`);
    }
    if (!final) {
      throw new Error(`Transcription timed out after ${MAX_POLLS * POLL_INTERVAL_SEC / 60}m`);
    }

    // 5. Build segments and raw full text from AAI utterances
    const rawSegments: TranscriptSegment[] = (final.utterances ?? []).map(
      (u, idx) => ({
        id: idx,
        start: u.start / 1000, // ms → seconds
        end: u.end / 1000,
        text: u.text.trim(),
        speaker: u.speaker,
      }),
    );

    if (rawSegments.length === 0 && final.text) {
      rawSegments.push({
        id: 0,
        start: 0,
        end: final.audio_duration ?? 0,
        text: final.text,
        speaker: null,
      });
    }

    const rawFullText =
      final.text ??
      rawSegments
        .map((s) => (s.speaker ? `Спикер ${s.speaker}: ${s.text}` : s.text))
        .join("\n");

    // Helpful representation for the cleanup model: speaker prefixes on every
    // line so it never collapses utterances together.
    const labelledFullText = rawSegments
      .map((s) => (s.speaker ? `Спикер ${s.speaker}: ${s.text}` : s.text))
      .join("\n");

    // 6. Run Claude post-processing to fix recognition errors. Never block:
    //    cleanup falls back to the raw transcript on any failure.
    const cleanedFullText = await step.run("cleanup-claude", async () => {
      return await cleanupTranscript({
        fullText: labelledFullText || rawFullText,
        context: recording.context,
        language: recording.language ?? final!.language_code ?? null,
      });
    });

    // 7. Save transcript (cleaned) + segments (realigned when possible)
    await step.run("save-transcript", async () => {
      const segments = realignSegments(rawSegments, cleanedFullText);

      await supa
        .from("recordings")
        .update({
          duration_sec: final!.audio_duration ?? null,
          status: "summarizing",
        })
        .eq("id", recordingId);

      await supa.from("transcripts").upsert({
        recording_id: recordingId,
        user_id: recording.user_id,
        language: final!.language_code ?? recording.language ?? null,
        full_text: cleanedFullText,
        segments: segments as unknown as never,
      });
    });

    // 8. Deduct minutes from user's balance
    await step.run("deduct-minutes", async () => {
      const seconds = final!.audio_duration ?? 0;
      if (seconds > 0) {
        await deductMinutes(supa, recording.user_id, seconds);
      }
    });

    // 9. Trigger summarize step
    await step.sendEvent("trigger-summarize", {
      name: "transcript.ready",
      data: { recordingId },
    });

    return { recordingId, transcriptId };
  },
);
