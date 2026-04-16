// REMOVE ME: Mixpanel is handled by Next.js /api/analytics/track instead.

/** Server-side Mixpanel track (bypasses browser ad blockers). */

export async function mixpanelTrack(
  event: string,
  distinctId: string,
  properties: Record<string, unknown> = {},
  insertId?: string,
): Promise<void> {
  const token = Deno.env.get("MIXPANEL_TOKEN");
  if (!token) {
    console.warn("MIXPANEL_TOKEN not set; skipping Mixpanel");
    return;
  }

  const baseUrl = Deno.env.get("MIXPANEL_API_HOST") ?? "https://api.mixpanel.com";
  const payload = [
    {
      event,
      properties: {
        token,
        distinct_id: distinctId,
        time: Math.floor(Date.now() / 1000),
        ...(insertId ? { $insert_id: insertId } : {}),
        ...properties,
      },
    },
  ];

  const res = await fetch(`${baseUrl}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ data: JSON.stringify(payload) }),
  });

  if (!res.ok) {
    console.error("Mixpanel track failed:", res.status, await res.text());
  }
}
