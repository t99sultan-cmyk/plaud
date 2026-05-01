import { rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createReadStream } from "node:fs";
import { inngest } from "../client";
import { createAdminClient } from "@/lib/supabase/admin";
import { splitForWhisper } from "@/lib/audio/chunker";
import { stitch } from "@/lib/audio/stitch";
import { transcribeFile } from "@/lib/ai/whisper";

export const transcribeRecording = inngest.createFunction(
  {
    id: "transcribe-recording",
    retries: 2,
    triggers: [{ event: "recording.uploaded" }],
  },
  async ({ event, step }) => {
    const { recordingId } = event.data as { recordingId: string };
    const supa = createAdminClient();

    // 1. Mark transcribing + load row
    const recording = await step.run("load-recording", async () => {
      const { data, error } = await supa
        .from("recordings")
        .select("*")
        .eq("id", recordingId)
        .single();
      if (error || !data) throw new Error(`Recording not found: ${recordingId}`);
      await supa
        .from("recordings")
        .update({ status: "transcribing" })
        .eq("id", recordingId);
      return data;
    });

    // 2. Download audio to /tmp
    const localPath = await step.run("download-audio", async () => {
      const { data, error } = await supa.storage
        .from("recordings")
        .download(recording.storage_path);
      if (error || !data) throw new Error(`Storage download failed: ${error?.message}`);
      const buffer = Buffer.from(await data.arrayBuffer());
      const ext = recording.storage_path.split(".").pop() || "audio";
      const path = join(tmpdir(), `plaud-${recordingId}.${ext}`);
      await writeFile(path, buffer);
      return path;
    });

    // 3. Chunk + 4. Transcribe (parallel) + 5. Stitch
    const transcript = await step.run("chunk-transcribe-stitch", async () => {
      const { chunks, tempDir, durationSec } = await splitForWhisper(localPath);

      const results = await Promise.all(
        chunks.map(async (chunk) => {
          const r = await transcribeFile(chunk.path);
          return {
            startSec: chunk.startSec,
            endSec: chunk.endSec,
            segments: r.segments,
            language: r.language,
          };
        }),
      );

      const { segments, fullText } = stitch(results);
      const language = results[0]?.language ?? null;

      // Clean up chunks + source
      await rm(tempDir, { recursive: true, force: true });
      await rm(localPath, { force: true });

      return { segments, fullText, language, durationSec };
    });

    // 6. Persist transcript + bump status
    await step.run("save-transcript", async () => {
      await supa
        .from("recordings")
        .update({ duration_sec: transcript.durationSec, status: "summarizing" })
        .eq("id", recordingId);

      await supa.from("transcripts").upsert({
        recording_id: recordingId,
        user_id: recording.user_id,
        language: transcript.language,
        full_text: transcript.fullText,
        segments: transcript.segments,
      });
    });

    // 7. Trigger summarize step
    await step.sendEvent("trigger-summarize", {
      name: "transcript.ready",
      data: { recordingId },
    });

    return { recordingId, segments: transcript.segments.length };
  },
);

// Use createReadStream import to avoid tree-shaking it (Whisper SDK needs it)
void createReadStream;
