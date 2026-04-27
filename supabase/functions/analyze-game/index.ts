import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "Missing authorization" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!anthropicKey) {
    return jsonResponse({ error: "Trial analysis not configured" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Verify the user's JWT
  const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
    error: authError,
  } = await anonClient.auth.getUser();
  if (authError || !user) {
    return jsonResponse({ error: "Invalid token" }, 401);
  }

  // Atomically claim a starter analysis slot
  const { data: claimed, error: claimError } = await supabase.rpc("claim_free_analysis", {
    user_id: user.id,
  });
  if (claimError || !claimed) {
    return jsonResponse(
      {
        error: "FREE_TRIAL_EXHAUSTED",
        message: "You've used all 5 starter analyses. Set up your own API key to continue.",
      },
      403,
    );
  }

  let body: { system: string; user: string; gameName?: string };
  try {
    body = await req.json();
    if (!body.system || !body.user) {
      return jsonResponse({ error: "Missing system or user prompt" }, 400);
    }
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  // Proxy to Anthropic with streaming
  const anthropicBody = {
    model: ANTHROPIC_MODEL,
    system: [{ type: "text", text: body.system, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: body.user }],
    tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 2 }],
    max_tokens: 4096,
    temperature: 0,
    stream: true,
  };

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(anthropicBody),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error("Anthropic error:", anthropicRes.status, errText);
      return jsonResponse({ error: `AI provider error (${anthropicRes.status})` }, 502);
    }

    // Pipe the SSE stream directly to the client
    return new Response(anthropicRes.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Internal server error" },
      500,
    );
  }
});
