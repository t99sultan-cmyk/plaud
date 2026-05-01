"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { inngest } from "@/lib/inngest/client";

const initSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(80),
  sizeBytes: z.number().int().positive().max(500 * 1024 * 1024), // 500MB
  folderId: z.string().uuid().nullable(),
});

export async function initUpload(input: z.infer<typeof initSchema>) {
  const validated = initSchema.parse(input);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthenticated" };

  const recordingId = randomUUID();
  const ext = validated.filename.split(".").pop() || "audio";
  const storagePath = `${user.id}/${recordingId}.${ext}`;

  const { error: insertErr } = await supabase.from("recordings").insert({
    id: recordingId,
    user_id: user.id,
    folder_id: validated.folderId,
    title: validated.filename.replace(/\.[^.]+$/, ""),
    storage_path: storagePath,
    mime_type: validated.mimeType,
    size_bytes: validated.sizeBytes,
    status: "uploading",
  });
  if (insertErr) return { error: insertErr.message };

  const { data: signed, error: urlErr } = await supabase.storage
    .from("recordings")
    .createSignedUploadUrl(storagePath);
  if (urlErr || !signed) return { error: urlErr?.message ?? "no_url" };

  return {
    recordingId,
    storagePath,
    signedUrl: signed.signedUrl,
    token: signed.token,
  };
}

export async function finalizeUpload(recordingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthenticated" };

  // Confirm row exists & belongs to user (RLS does this implicitly)
  const { data: rec, error } = await supabase
    .from("recordings")
    .update({ status: "queued" })
    .eq("id", recordingId)
    .select("id")
    .single();
  if (error || !rec) return { error: error?.message ?? "not_found" };

  await inngest.send({
    name: "recording.uploaded",
    data: { recordingId },
  });

  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function deleteRecording(id: string) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: rec, error } = await supabase
    .from("recordings")
    .select("id, storage_path")
    .eq("id", id)
    .single();
  if (error || !rec) return { error: error?.message ?? "not_found" };

  await admin.storage.from("recordings").remove([rec.storage_path]);
  await supabase.from("recordings").delete().eq("id", id);

  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function moveRecording(id: string, folderId: string | null) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recordings")
    .update({ folder_id: folderId })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function retryTranscription(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recordings")
    .update({ status: "queued", error_message: null })
    .eq("id", id);
  if (error) return { error: error.message };

  await inngest.send({
    name: "recording.uploaded",
    data: { recordingId: id },
  });
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}
