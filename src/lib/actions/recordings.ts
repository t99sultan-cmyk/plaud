"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { inngest } from "@/lib/inngest/client";
import { availableMinutes, getUserCredits } from "@/lib/credits";
import { requeueRecording } from "@/lib/recordings/requeue";

const initSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(80),
  sizeBytes: z.number().int().positive().max(500 * 1024 * 1024), // 500MB
  folderId: z.string().uuid().nullable(),
  context: z.string().trim().max(2000).optional(),
  // ISO 639-1 short codes — explicit means AssemblyAI skips auto-detection.
  language: z.enum(["ru", "en", "kk", "auto"]).optional(),
});

export async function initUpload(input: z.infer<typeof initSchema>) {
  const validated = initSchema.parse(input);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthenticated" };

  // Pre-upload: check user has any minutes left
  const credits = await getUserCredits(supabase, user.id);
  const minutes = availableMinutes(credits);
  if (minutes <= 0) {
    return {
      error: "out_of_minutes",
      message:
        "Минуты на счёте закончились. Купи пакет на странице оплаты.",
    };
  }

  const recordingId = randomUUID();
  const ext = validated.filename.split(".").pop() || "audio";
  const storagePath = `${user.id}/${recordingId}.${ext}`;

  const language =
    validated.language && validated.language !== "auto"
      ? validated.language
      : null;
  const context = validated.context ? validated.context.trim() : null;

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

  // Apply per-recording context/language hints in a follow-up update. These are
  // OPTIONAL metadata — saving them must NEVER block the upload. If migration
  // 0007 hasn't been applied, PostgREST returns either "column ... does not
  // exist" or PGRST204 "Could not find the '...' column ... in the schema
  // cache"; on that (or any other error) we just log and proceed, so the
  // recording still uploads and transcribes (language falls back to auto-detect).
  if (context || language) {
    const { error: hintsErr } = await supabase
      .from("recordings")
      .update({ context, language })
      .eq("id", recordingId);
    if (hintsErr) {
      console.warn("recording hints not saved (continuing):", hintsErr.message);
    }
  }

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

  try {
    await inngest.send({
      name: "recording.uploaded",
      data: { recordingId },
    });
  } catch {
    // The file is uploaded and the row is `queued`, but the queue event never
    // left. Mark it `failed` so the user sees the "Повторить" button instead of
    // an endless spinner.
    await supabase
      .from("recordings")
      .update({
        status: "failed",
        error_message:
          "Не удалось поставить запись в очередь обработки. Нажми «Повторить транскрипцию».",
      })
      .eq("id", recordingId);
    revalidatePath("/dashboard", "layout");
    return { error: "queue_failed" };
  }

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

export async function renameRecording(id: string, title: string) {
  const trimmed = title.trim();
  if (trimmed.length < 1 || trimmed.length > 200) {
    return { error: "Длина 1–200 символов" };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("recordings")
    .update({ title: trimmed })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath(`/dashboard/recordings/${id}`);
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function toggleShare(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthenticated" };

  // Read current state
  const { data: rec, error: readErr } = await supabase
    .from("recordings")
    .select("id, share_token, title")
    .eq("id", id)
    .single();
  if (readErr || !rec) return { error: readErr?.message ?? "not_found" };

  let nextToken: string | null;
  if (rec.share_token) {
    nextToken = null; // revoke
  } else {
    nextToken = randomUUID();
  }

  const { error } = await supabase
    .from("recordings")
    .update({ share_token: nextToken })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath(`/dashboard/recordings/${id}`);
  return { ok: true, share_token: nextToken };
}

export async function retryTranscription(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthenticated" };

  // requeueRecording picks the right entry point: re-summarize when a
  // transcript already exists (no re-charge), else full re-transcription.
  const result = await requeueRecording(supabase, id);
  if ("error" in result) return result;

  revalidatePath("/dashboard", "layout");
  revalidatePath(`/dashboard/recordings/${id}`);
  return { ok: true };
}
