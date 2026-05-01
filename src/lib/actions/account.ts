"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const passwordSchema = z.object({
  password: z.string().min(8).max(120),
});

export async function changePassword(formData: FormData) {
  const parsed = passwordSchema.parse({
    password: formData.get("password"),
  });

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.password,
  });
  if (error) return { error: error.message };
  return { ok: true };
}

const emailSchema = z.object({
  email: z.string().email().max(120),
});

export async function changeEmail(formData: FormData) {
  const parsed = emailSchema.parse({ email: formData.get("email") });

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email: parsed.email });
  if (error) return { error: error.message };
  return { ok: true };
}

/**
 * Delete the current user's account along with all data
 * (recordings, transcripts, summaries, chats — cascade via FK).
 */
export async function deleteAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthenticated" };

  const admin = createAdminClient();

  // 1. Delete all storage files for this user (folder = user_id)
  try {
    const { data: files } = await admin.storage
      .from("recordings")
      .list(user.id, { limit: 1000 });
    if (files && files.length > 0) {
      const paths = files.map((f) => `${user.id}/${f.name}`);
      await admin.storage.from("recordings").remove(paths);
    }
  } catch {
    // Continue even if storage cleanup fails
  }

  // 2. Delete the auth user (cascades all DB rows via FK on delete cascade)
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/");
}
