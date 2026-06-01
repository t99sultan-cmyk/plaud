import { inngest } from "../client";
import { createAdminClient } from "@/lib/supabase/admin";

// Legit max processing time = MAX_POLLS * POLL_INTERVAL = 240 * 15s = 60 min
// (see transcribe.ts). The threshold must comfortably exceed that so we never
// reap a recording that is still legitimately transcribing a long file.
const STUCK_THRESHOLD_MIN = 75;

/**
 * Safety net for recordings that get wedged in a processing state with no way
 * out — e.g. the queue event was never delivered, or a deploy killed a run
 * mid-flight so the function's `onFailure` never fired. Runs every 10 minutes
 * and flips anything stuck past the threshold to `failed`, which surfaces the
 * "Повторить транскрипцию" button in the UI.
 */
export const reapStuckRecordings = inngest.createFunction(
  {
    id: "reap-stuck-recordings",
    triggers: [{ cron: "*/10 * * * *" }],
  },
  async ({ step }) => {
    return await step.run("flip-stuck", async () => {
      const supa = createAdminClient();
      const cutoff = new Date(
        Date.now() - STUCK_THRESHOLD_MIN * 60_000,
      ).toISOString();

      const { data, error } = await supa
        .from("recordings")
        .update({
          status: "failed",
          error_message:
            "Обработка прервалась и не завершилась. Нажми «Повторить транскрипцию».",
        })
        // `updated_at` is bumped on every status change by a DB trigger, so an
        // actively-processing recording keeps a fresh timestamp and is skipped.
        .in("status", ["uploading", "queued", "transcribing", "summarizing"])
        .lt("updated_at", cutoff)
        .select("id");

      if (error) throw new Error(`reaper: ${error.message}`);
      return { reaped: data?.length ?? 0, cutoff };
    });
  },
);
