"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { addPaidMinutes } from "@/lib/credits";

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

const createSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[A-Z0-9_-]+$/, "Только латинские буквы, цифры, _ и -"),
  description: z.string().max(200).optional(),
  type: z.enum(["free_minutes", "discount_percent", "free_package"]),
  free_minutes: z.number().int().min(1).max(100000).optional(),
  discount_percent: z.number().int().min(1).max(100).optional(),
  package_id: z.string().optional(),
  max_uses: z.number().int().min(1).optional(),
  expires_at: z.string().datetime().optional(),
});

export async function createPromocode(input: unknown) {
  const admin = await requireAdmin();
  const parsed = createSchema.parse(input);
  const supa = createAdminClient();
  const { data, error } = await supa
    .from("promocodes")
    .insert({
      code: parsed.code.toUpperCase(),
      description: parsed.description ?? null,
      type: parsed.type,
      free_minutes: parsed.free_minutes ?? null,
      discount_percent: parsed.discount_percent ?? null,
      package_id: parsed.package_id ?? null,
      max_uses: parsed.max_uses ?? null,
      expires_at: parsed.expires_at ?? null,
      created_by: admin.id,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };
  revalidatePath("/admin/promocodes");
  return { id: data.id };
}

export async function deactivatePromocode(id: string) {
  await requireAdmin();
  const supa = createAdminClient();
  const { data: row } = await supa
    .from("promocodes")
    .select("max_uses, used_count")
    .eq("id", id)
    .single();
  if (!row) return { error: "not_found" };
  // Set max_uses to current used_count → effectively dead
  const { error } = await supa
    .from("promocodes")
    .update({ max_uses: row.used_count })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/promocodes");
  return { ok: true };
}

const redeemSchema = z.object({ code: z.string().min(1).max(40) });

export async function redeemPromocode(input: unknown) {
  const { code } = redeemSchema.parse(input);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthenticated" };

  const supa = createAdminClient();
  const { data: promo } = await supa
    .from("promocodes")
    .select("*")
    .eq("code", code.toUpperCase())
    .single();
  if (!promo) return { error: "Код не найден" };

  // Validate
  if (promo.max_uses !== null && promo.used_count >= promo.max_uses) {
    return { error: "Лимит использований исчерпан" };
  }
  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return { error: "Срок действия истёк" };
  }
  // Check duplicate redemption
  const { data: existing } = await supa
    .from("promocode_redemptions")
    .select("id")
    .eq("promocode_id", promo.id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) return { error: "Этот код вы уже применяли" };

  // Apply
  const granted = promo.type === "free_minutes" ? (promo.free_minutes ?? 0) : 0;

  const { error: insertErr } = await supa
    .from("promocode_redemptions")
    .insert({
      promocode_id: promo.id,
      user_id: user.id,
      granted_minutes: granted,
    });
  if (insertErr) return { error: insertErr.message };

  // Add minutes to user balance with 30-day expiry
  if (granted > 0) {
    await addPaidMinutes(supa, user.id, granted);
  }

  await supa
    .from("promocodes")
    .update({ used_count: promo.used_count + 1 })
    .eq("id", promo.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/billing");
  return {
    ok: true,
    type: promo.type,
    granted_minutes: granted,
    description: promo.description,
  };
}
