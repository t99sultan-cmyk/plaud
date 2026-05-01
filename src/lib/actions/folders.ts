"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const nameSchema = z.string().min(1).max(80);

export async function createFolder(formData: FormData) {
  const name = nameSchema.parse(formData.get("name"));
  const color = (formData.get("color") as string) || null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthenticated" };

  const { data, error } = await supabase
    .from("folders")
    .insert({ name, color, user_id: user.id })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard", "layout");
  return { id: data.id };
}

export async function renameFolder(id: string, name: string) {
  const validated = nameSchema.parse(name);
  const supabase = await createClient();
  const { error } = await supabase
    .from("folders")
    .update({ name: validated })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function deleteFolder(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("folders").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}
