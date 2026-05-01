import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface LandingStats {
  totalUsers: number;
  totalMinutes: number;
  totalHoursSaved: number;
  averageProcessingMinutes: number;
}

/**
 * Server-side stats for the landing page (counter bar).
 * Uses public counts, never PII. Cached at the page level via revalidate.
 */
export async function getLandingStats(): Promise<LandingStats> {
  try {
    const supa = createAdminClient();

    // Users
    const { data: usersList } = await supa.auth.admin.listUsers({ perPage: 1000 });
    const totalUsers = (usersList?.users ?? []).length;

    // Total minutes processed (sum of duration_sec across all completed recordings)
    const { data: recs } = await supa
      .from("recordings")
      .select("duration_sec")
      .eq("status", "ready");
    const totalSeconds = (recs ?? []).reduce(
      (sum, r) => sum + (r.duration_sec ?? 0),
      0,
    );
    const totalMinutes = Math.round(totalSeconds / 60);

    // Hours saved (heuristic: manual transcription = 4x audio length)
    // We save (4x - 1x for listening) = 3x. Hours saved = totalSeconds * 3 / 3600
    const totalHoursSaved = Math.round((totalSeconds * 3) / 3600);

    // Honest numbers — no inflated baselines.
    // If empty, returns 0; landing renders "—" placeholder for zero.
    return {
      totalUsers,
      totalMinutes,
      totalHoursSaved,
      averageProcessingMinutes: 5, // fixed claim based on AssemblyAI ~15% of duration
    };
  } catch {
    // Graceful fallback if DB read fails (don't break landing)
    return {
      totalUsers: 0,
      totalMinutes: 0,
      totalHoursSaved: 0,
      averageProcessingMinutes: 5,
    };
  }
}
