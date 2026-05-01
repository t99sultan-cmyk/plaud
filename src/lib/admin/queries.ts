/**
 * Service-role admin queries — bypass RLS to give the admin a god-view.
 * NEVER use these in user-facing routes; only inside `/admin/*` after
 * the admin email gate has been checked.
 */
import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Recording, RecordingStatus } from "@/types/domain";

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  provider: string | null;
}

export interface UserStats {
  user_id: string;
  email: string;
  recording_count: number;
  total_seconds: number;
  last_recording_at: string | null;
}

export interface DailyPoint {
  date: string; // YYYY-MM-DD
  count: number;
}

const ASSEMBLY_PER_HOUR_USD = 0.37;
const CLAUDE_PER_HOUR_USD = 0.06; // summary + ~10 cached chat questions average

/** Estimated cost for given seconds of audio. */
export function estimateCost(seconds: number): number {
  const hours = seconds / 3600;
  return hours * (ASSEMBLY_PER_HOUR_USD + CLAUDE_PER_HOUR_USD);
}

/** Fetch all auth users via admin API. */
export async function listUsers(): Promise<AdminUser[]> {
  const supa = createAdminClient();
  const { data, error } = await supa.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw new Error(`listUsers: ${error.message}`);
  return data.users.map((u) => ({
    id: u.id,
    email: u.email ?? "",
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    provider:
      (u.app_metadata?.provider as string | undefined) ??
      (u.identities?.[0]?.provider ?? null),
  }));
}

export async function getUser(id: string): Promise<AdminUser | null> {
  const supa = createAdminClient();
  const { data, error } = await supa.auth.admin.getUserById(id);
  if (error || !data.user) return null;
  const u = data.user;
  return {
    id: u.id,
    email: u.email ?? "",
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    provider:
      (u.app_metadata?.provider as string | undefined) ??
      (u.identities?.[0]?.provider ?? null),
  };
}

/** Per-user stats joined with auth emails. */
export async function listUserStats(): Promise<UserStats[]> {
  const supa = createAdminClient();

  // Pull recordings (limit big enough for MVP — 100 users × dozens of recs)
  const { data: recs } = await supa
    .from("recordings")
    .select("user_id, duration_sec, created_at")
    .order("created_at", { ascending: false })
    .limit(10000);

  const users = await listUsers();
  const emailById = new Map(users.map((u) => [u.id, u.email] as const));

  const map = new Map<string, UserStats>();
  for (const r of recs ?? []) {
    const cur =
      map.get(r.user_id) ??
      ({
        user_id: r.user_id,
        email: emailById.get(r.user_id) ?? "",
        recording_count: 0,
        total_seconds: 0,
        last_recording_at: null,
      } as UserStats);
    cur.recording_count += 1;
    cur.total_seconds += r.duration_sec ?? 0;
    if (
      !cur.last_recording_at ||
      new Date(r.created_at) > new Date(cur.last_recording_at)
    ) {
      cur.last_recording_at = r.created_at;
    }
    map.set(r.user_id, cur);
  }

  // Include users who registered but haven't uploaded yet
  for (const u of users) {
    if (!map.has(u.id)) {
      map.set(u.id, {
        user_id: u.id,
        email: u.email,
        recording_count: 0,
        total_seconds: 0,
        last_recording_at: null,
      });
    }
  }

  return [...map.values()].sort((a, b) => b.total_seconds - a.total_seconds);
}

/** Listing helpers */
export async function listAllRecordings(opts: {
  status?: RecordingStatus | null;
  limit?: number;
} = {}): Promise<(Recording & { user_email: string })[]> {
  const supa = createAdminClient();
  let q = supa
    .from("recordings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 200);
  if (opts.status) q = q.eq("status", opts.status);
  const { data: recs } = await q;

  const users = await listUsers();
  const emailById = new Map(users.map((u) => [u.id, u.email] as const));

  return ((recs ?? []) as Recording[]).map((r) => ({
    ...r,
    user_email: emailById.get(r.user_id) ?? "",
  }));
}

export async function listUserRecordings(
  userId: string,
): Promise<Recording[]> {
  const supa = createAdminClient();
  const { data } = await supa
    .from("recordings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as Recording[];
}

/** Aggregate metrics for the dashboard. */
export interface AdminMetrics {
  totalUsers: number;
  totalRecordings: number;
  totalMinutes: number;
  totalCostUsd: number;
  recordingsByStatus: Record<RecordingStatus, number>;
  recordingsByDay: DailyPoint[];
  signupsByDay: DailyPoint[];
}

const ALL_STATUSES: RecordingStatus[] = [
  "uploading",
  "queued",
  "transcribing",
  "summarizing",
  "ready",
  "failed",
];

export async function getMetrics(): Promise<AdminMetrics> {
  const supa = createAdminClient();
  const users = await listUsers();

  const { data: recs } = await supa
    .from("recordings")
    .select("status, duration_sec, created_at");

  const recordings = recs ?? [];
  const totalRecordings = recordings.length;
  const totalSeconds = recordings.reduce(
    (s, r) => s + (r.duration_sec ?? 0),
    0,
  );

  const byStatus = Object.fromEntries(
    ALL_STATUSES.map((s) => [s, 0]),
  ) as Record<RecordingStatus, number>;
  for (const r of recordings) {
    byStatus[r.status as RecordingStatus] =
      (byStatus[r.status as RecordingStatus] ?? 0) + 1;
  }

  // 30-day rolling buckets
  const days = lastNDays(30);
  const recByDay = bucketByDay(
    days,
    recordings.map((r) => r.created_at),
  );
  const signupByDay = bucketByDay(
    days,
    users.map((u) => u.created_at),
  );

  return {
    totalUsers: users.length,
    totalRecordings,
    totalMinutes: Math.round(totalSeconds / 60),
    totalCostUsd: Math.round(estimateCost(totalSeconds) * 100) / 100,
    recordingsByStatus: byStatus,
    recordingsByDay: recByDay,
    signupsByDay: signupByDay,
  };
}

function lastNDays(n: number): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function bucketByDay(days: string[], isoDates: string[]): DailyPoint[] {
  const map = new Map<string, number>(days.map((d) => [d, 0]));
  for (const iso of isoDates) {
    const day = iso.slice(0, 10);
    if (map.has(day)) map.set(day, (map.get(day) ?? 0) + 1);
  }
  return days.map((date) => ({ date, count: map.get(date) ?? 0 }));
}
