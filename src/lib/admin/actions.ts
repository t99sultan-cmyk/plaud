"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requeueRecording } from "@/lib/recordings/requeue";

const ADMIN_EMAILS = ["t99.sultan@gmail.com"];

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    throw new Error("forbidden");
  }
  return user;
}

/**
 * Admin-initiated retry of any user's recording. Uses the service-role client
 * so it bypasses RLS (the user-scoped `retryTranscription` silently matches 0
 * rows for a recording owned by someone else).
 */
export async function adminRetryTranscription(recordingId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const result = await requeueRecording(admin, recordingId);
  if ("error" in result) return result;

  revalidatePath(`/admin/recordings/${recordingId}`);
  revalidatePath("/admin/recordings");
  return { ok: true };
}
