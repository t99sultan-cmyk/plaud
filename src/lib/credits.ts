import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db/types";
import type { UserCredits } from "@/types/domain";

const PAID_EXPIRY_DAYS = 30;

/** Total available minutes (free + non-expired paid). */
export function availableMinutes(credits: UserCredits | null): number {
  if (!credits) return 0;
  let total = credits.free_minutes_remaining;
  if (credits.paid_minutes_remaining > 0) {
    const notExpired =
      !credits.paid_minutes_expires_at ||
      new Date(credits.paid_minutes_expires_at) > new Date();
    if (notExpired) total += credits.paid_minutes_remaining;
  }
  return total;
}

/** Read user credits; returns null if row missing (shouldn't happen post-migration). */
export async function getUserCredits(
  supa: SupabaseClient<Database>,
  userId: string,
): Promise<UserCredits | null> {
  const { data } = await supa
    .from("user_credits")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as UserCredits | null) ?? null;
}

/**
 * Add paid minutes to a user (e.g., from promocode redemption).
 * Extends `paid_minutes_expires_at` to (now + 30d), or keeps current if it's
 * already further in the future.
 *
 * Server-side only — uses admin client.
 */
export async function addPaidMinutes(
  supa: SupabaseClient<Database>,
  userId: string,
  minutes: number,
): Promise<void> {
  const cur = await getUserCredits(supa, userId);
  const newExpiry = new Date();
  newExpiry.setDate(newExpiry.getDate() + PAID_EXPIRY_DAYS);

  // If existing expiry is later than new, keep it (don't shorten user's window)
  let expiresAt = newExpiry.toISOString();
  if (
    cur?.paid_minutes_expires_at &&
    new Date(cur.paid_minutes_expires_at) > newExpiry
  ) {
    expiresAt = cur.paid_minutes_expires_at;
  }

  // If existing paid minutes already expired, reset rather than add
  const existingPaid =
    cur?.paid_minutes_expires_at &&
    new Date(cur.paid_minutes_expires_at) < new Date()
      ? 0
      : cur?.paid_minutes_remaining ?? 0;

  await supa
    .from("user_credits")
    .upsert(
      {
        user_id: userId,
        free_minutes_remaining: cur?.free_minutes_remaining ?? 0,
        paid_minutes_remaining: existingPaid + minutes,
        paid_minutes_expires_at: expiresAt,
        total_minutes_used: cur?.total_minutes_used ?? 0,
      },
      { onConflict: "user_id" },
    );
}

/**
 * Deduct used minutes after successful transcription.
 * Spends free minutes first, then paid. Updates total_minutes_used.
 * No-op if user has no credits row.
 */
export async function deductMinutes(
  supa: SupabaseClient<Database>,
  userId: string,
  seconds: number,
): Promise<{ deducted: number }> {
  const minutes = Math.ceil(seconds / 60);
  if (minutes <= 0) return { deducted: 0 };

  const cur = await getUserCredits(supa, userId);
  if (!cur) return { deducted: 0 };

  let remaining = minutes;
  let newFree = cur.free_minutes_remaining;
  let newPaid = cur.paid_minutes_remaining;

  // Spend free first
  if (newFree > 0) {
    const fromFree = Math.min(newFree, remaining);
    newFree -= fromFree;
    remaining -= fromFree;
  }

  // Then paid (if not expired)
  const paidValid =
    !cur.paid_minutes_expires_at ||
    new Date(cur.paid_minutes_expires_at) > new Date();
  if (remaining > 0 && newPaid > 0 && paidValid) {
    const fromPaid = Math.min(newPaid, remaining);
    newPaid -= fromPaid;
    remaining -= fromPaid;
  }

  await supa
    .from("user_credits")
    .update({
      free_minutes_remaining: newFree,
      paid_minutes_remaining: newPaid,
      total_minutes_used: cur.total_minutes_used + minutes,
    })
    .eq("user_id", userId);

  return { deducted: minutes };
}
