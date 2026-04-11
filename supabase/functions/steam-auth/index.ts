import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function verifySteamLogin(
  params: Record<string, string>,
): Promise<boolean> {
  const verifyParams = new URLSearchParams(params);
  verifyParams.set("openid.mode", "check_authentication");

  const res = await fetch("https://steamcommunity.com/openid/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: verifyParams.toString(),
  });

  const text = await res.text();
  return text.includes("is_valid:true");
}

function extractSteamId(claimedId: string): string | null {
  const match = claimedId.match(
    /^https:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/,
  );
  return match ? match[1] : null;
}

async function fetchPersonaName(steamId: string): Promise<string> {
  const apiKey = Deno.env.get("STEAM_API_KEY");
  const url =
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`;

  const res = await fetch(url);
  if (!res.ok) return `Steam User ${steamId}`;

  const data = await res.json();
  const players = data?.response?.players;
  return players?.[0]?.personaname ?? `Steam User ${steamId}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const { params } = await req.json();
    if (!params || typeof params !== "object") {
      return jsonResponse({ error: "Missing params object in request body" }, 400);
    }

    const isValid = await verifySteamLogin(params);
    if (!isValid) {
      return jsonResponse({ error: "Steam OpenID verification failed" }, 401);
    }

    const claimedId = params["openid.claimed_id"];
    if (!claimedId) {
      return jsonResponse({ error: "Missing openid.claimed_id" }, 400);
    }

    const steamId = extractSteamId(claimedId);
    if (!steamId) {
      return jsonResponse({ error: "Invalid Steam claimed_id format" }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const personaName = await fetchPersonaName(steamId);

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("steam_id", steamId)
      .maybeSingle();

    if (existingProfile) {
      const { data: userData } = await supabase.auth.admin.getUserById(
        existingProfile.id,
      );
      const userEmail = userData?.user?.email;
      if (!userEmail) {
        return jsonResponse({ error: "Could not resolve user email" }, 500);
      }

      const { data: linkData, error: linkError } =
        await supabase.auth.admin.generateLink({
          type: "magiclink",
          email: userEmail,
        });

      if (linkError || !linkData) {
        return jsonResponse({ error: "Failed to generate login link" }, 500);
      }

      const tokenHash = linkData.properties?.hashed_token;

      return jsonResponse({
        token_hash: tokenHash,
        email: userEmail,
        steam_id: steamId,
      });
    }

    // New user flow
    const email = `steam_${steamId}@gamefit.steam`;

    const { data: newUser, error: createError } =
      await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: personaName, steam_id: steamId },
      });

    if (createError || !newUser.user) {
      return jsonResponse({ error: "Failed to create user" }, 500);
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ steam_id: steamId })
      .eq("id", newUser.user.id);

    if (updateError) {
      return jsonResponse({ error: "Failed to update profile with steam_id" }, 500);
    }

    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email,
      });

    if (linkError || !linkData) {
      return jsonResponse({ error: "Failed to generate login link for new user" }, 500);
    }

    const tokenHash = linkData.properties?.hashed_token;

    return jsonResponse({
      token_hash: tokenHash,
      email,
      steam_id: steamId,
      is_new: true,
    });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Internal server error" },
      500,
    );
  }
});
