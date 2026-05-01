"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const feedbackSchema = z.object({
  recordingId: z.string().uuid(),
  rating: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
  comment: z.string().max(2000).optional().nullable(),
});

export async function saveFeedback(input: {
  recordingId: string;
  rating: -1 | 0 | 1;
  comment?: string | null;
}) {
  const validated = feedbackSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthenticated" };

  const { error } = await supabase.from("recording_feedback").upsert({
    recording_id: validated.recordingId,
    user_id: user.id,
    rating: validated.rating,
    comment: validated.comment ?? null,
  });
  if (error) return { error: error.message };

  revalidatePath(`/dashboard/recordings/${validated.recordingId}`);
  return { ok: true };
}

export async function clearFeedback(recordingId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recording_feedback")
    .delete()
    .eq("recording_id", recordingId);
  if (error) return { error: error.message };
  revalidatePath(`/dashboard/recordings/${recordingId}`);
  return { ok: true };
}
