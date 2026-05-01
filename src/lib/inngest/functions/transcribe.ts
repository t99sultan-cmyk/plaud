import { inngest } from "../client";
import { createAdminClient } from "@/lib/supabase/admin";
import { submitTranscription, getTranscript } from "@/lib/ai/assemblyai";
import { deductMinutes } from "@/lib/credits";
import type { TranscriptSegment } from "@/types/domain";

const POLL_INTERVAL_SEC = 15;
const MAX_POLLS = 240; // up to 60 minutes — covers ~6h source audio comfortably

export const transcribeRecording = inngest.createFunction(
  {
    id: "transcribe-recording",
    retries: 2,
    triggers: [{ event: "recording.uploaded" }],
  },
  async ({ event, step }) => {
    const { recordingId } = event.data as { recordingId: string };
    const supa = createAdminClient();

    // 1. Load + mark transcribing
    const recording = await step.run("load-recording", async () => {
      const { data, error } = await supa
        .from("recordings")
        .select("id, user_id, storage_path")
        .eq("id", recordingId)
        .single();
      if (error || !data) throw new Error(`Recording not found: ${recordingId}`);
      await supa
        .from("recordings")
        .update({ status: "transcribing", error_message: null })
        .eq("id", recordingId);
      return data;
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

    // 3. Submit to AssemblyAI
    const transcriptId = await step.run("submit-aai", async () => {
      return await submitTranscription(audioUrl);
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

    // 5. Convert utterances → our segment format and persist
    await step.run("save-transcript", async () => {
      const segments: TranscriptSegment[] = (final!.utterances ?? []).map(
        (u, idx) => ({
          id: idx,
          start: u.start / 1000, // ms → seconds
          end: u.end / 1000,
          text: u.text.trim(),
          speaker: u.speaker,
        }),
      );

      // Fallback: if utterances missing (very short clip, single speaker not detected),
      // treat the whole text as one segment.
      if (segments.length === 0 && final!.text) {
        segments.push({
          id: 0,
          start: 0,
          end: final!.audio_duration ?? 0,
          text: final!.text,
          speaker: null,
        });
      }

      const fullText =
        final!.text ??
        segments
          .map((s) => (s.speaker ? `Спикер ${s.speaker}: ${s.text}` : s.text))
          .join("\n");

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
        language: final!.language_code ?? null,
        full_text: fullText,
        segments: segments as unknown as never,
      });
    });

    // 6. Deduct minutes from user's balance
    await step.run("deduct-minutes", async () => {
      const seconds = final!.audio_duration ?? 0;
      if (seconds > 0) {
        await deductMinutes(supa, recording.user_id, seconds);
      }
    });

    // 7. Trigger summarize step
    await step.sendEvent("trigger-summarize", {
      name: "transcript.ready",
      data: { recordingId },
    });

    return { recordingId, transcriptId };
  },
);
