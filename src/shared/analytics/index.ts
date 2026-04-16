import type { User } from "@supabase/supabase-js";
import { getSupabase, isTauri } from "@/shared/api/supabase";

function apiUrl(path: string): string {
  if (typeof window === "undefined") return path;
  if (isTauri() && process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}${path}`;
  }
  return path;
}

async function postTrack(
  event: string,
  properties: Record<string, unknown> | undefined,
  insertId: string,
): Promise<void> {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return;

  await fetch(apiUrl("/api/analytics/track"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      event,
      properties: properties ?? {},
      insert_id: insertId,
    }),
  });
}

/** Server-side Mixpanel via Next.js API (same-origin; avoids ad blockers). */
export async function trackSignup(user: User, properties?: Record<string, unknown>): Promise<void> {
  await postTrack("signup", properties, `${user.id}-signup`);
}

export async function trackStarterAnalysis(
  user: User,
  gameName: string,
  analysisNumber: number,
): Promise<void> {
  // Mixpanel dedupes on $insert_id. Slot number alone can repeat if the DB read is stale
  // or the user retries the same slot — use a unique id per completed run.
  const insertId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `starter-${crypto.randomUUID()}`
      : `starter-${user.id}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

  await postTrack(
    "starter_analysis",
    { game_name: gameName, analysis_number: analysisNumber },
    insertId,
  );
}
