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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await req.json();
    const steamId = body?.steamId;
    if (!steamId || typeof steamId !== "string") {
      return jsonResponse({ error: "Missing steamId in request body" }, 400);
    }

    const apiKey = Deno.env.get("STEAM_API_KEY");
    if (!apiKey) {
      return jsonResponse({ error: "Steam API key not configured" }, 500);
    }

    const steamUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json`;

    const steamRes = await fetch(steamUrl);
    if (!steamRes.ok) {
      const errBody = await steamRes.text().catch(() => "");
      console.error(`Steam API error: status=${steamRes.status} body=${errBody}`);
      return jsonResponse(
        { error: `Failed to fetch games from Steam (status ${steamRes.status})` },
        502,
      );
    }

    const steamData = await steamRes.json();
    const rawGames = steamData?.response?.games ?? [];

    const games = rawGames.map((g: { name: string; playtime_forever: number }) => ({
      name: g.name,
      playtimeHours: Math.round((g.playtime_forever / 60) * 10) / 10,
    }));

    return jsonResponse({ games, count: games.length });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Internal server error" },
      500,
    );
  }
});
