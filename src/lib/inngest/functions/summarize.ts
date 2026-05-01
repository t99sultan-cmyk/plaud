import { inngest } from "../client";
import { createAdminClient } from "@/lib/supabase/admin";
import { summarize } from "@/lib/ai/summarize";
import { CLAUDE_MODEL } from "@/lib/ai/claude";

export const summarizeRecording = inngest.createFunction(
  {
    id: "summarize-recording",
    retries: 2,
    triggers: [{ event: "transcript.ready" }],
  },
  async ({ event, step }) => {
    const { recordingId } = event.data as { recordingId: string };
    const supa = createAdminClient();

    const transcript = await step.run("load-transcript", async () => {
      const { data, error } = await supa
        .from("transcripts")
        .select("user_id, full_text")
        .eq("recording_id", recordingId)
        .single();
      if (error || !data) throw new Error(`Transcript missing: ${recordingId}`);
      return data;
    });

    const summary = await step.run("call-claude", async () => {
      return await summarize(transcript.full_text);
    });

    await step.run("save-summary", async () => {
      await supa.from("summaries").upsert({
        recording_id: recordingId,
        user_id: transcript.user_id,
        tldr: summary.tldr,
        bullets: summary.bullets,
        takeaways: summary.takeaways,
        topics: summary.topics,
        model: CLAUDE_MODEL,
      });
      await supa
        .from("recordings")
        .update({ status: "ready" })
        .eq("id", recordingId);
    });

    return { recordingId };
  },
);
