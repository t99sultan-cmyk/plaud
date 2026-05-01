import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db/types";

let cached: SupabaseClient<Database> | null = null;

/**
 * Service-role client for server-side jobs (Inngest functions, route handlers
 * that need to bypass RLS). Never expose this to the browser.
 */
export function createAdminClient(): SupabaseClient<Database> {
  if (cached) return cached;
  cached = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
  return cached;
}
