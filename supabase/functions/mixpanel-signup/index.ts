// REMOVE ME: Mixpanel is handled by Next.js /api/analytics/track instead.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { mixpanelTrack } from "../_shared/mixpanel.ts";

interface WebhookPayload {
  type: string;
  table: string;
  record: { id: string; display_name: string | null; steam_id?: string | null };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = (await req.json()) as WebhookPayload;
    if (payload.type !== "INSERT" || payload.table !== "profiles") {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { id, display_name } = payload.record;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: { user }, error } = await supabase.auth.admin.getUserById(id);
    if (error) console.error("getUserById:", error.message);

    const email = user?.email;
    const provider = user?.app_metadata?.provider ?? user?.identities?.[0]?.provider;

    await mixpanelTrack(
      "signup",
      id,
      {
        ...(email ? { $email: email } : {}),
        ...(display_name ? { display_name } : {}),
        ...(provider ? { auth_provider: provider } : {}),
      },
      `${id}-signup`,
    );

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("mixpanel-signup:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
