import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { transcribeRecording } from "@/lib/inngest/functions/transcribe";
import { summarizeRecording } from "@/lib/inngest/functions/summarize";
import { reapStuckRecordings } from "@/lib/inngest/functions/reap-stuck";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [transcribeRecording, summarizeRecording, reapStuckRecordings],
});
