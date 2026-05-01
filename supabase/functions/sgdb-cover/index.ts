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

const SGDB_BASE = "https://www.steamgriddb.com/api/v2";

interface SearchHit {
  id: number;
  name: string;
}

interface GridItem {
  id: number;
  url: string;
  thumb?: string;
  width: number;
  height: number;
}

async function findGameId(name: string, apiKey: string): Promise<number | null> {
  const url = `${SGDB_BASE}/search/autocomplete/${encodeURIComponent(name)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!res.ok) {
    throw new Error(`SteamGridDB search failed (${res.status})`);
  }
  const data = (await res.json()) as { success: boolean; data: SearchHit[] };
  if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
    return null;
  }
  return data.data[0].id;
}

async function findCoverUrl(gameId: number, apiKey: string): Promise<string | null> {
  const params = new URLSearchParams({
    dimensions: "600x900,660x930,512x512",
    types: "static",
    nsfw: "false",
    humor: "false",
  });
  const url = `${SGDB_BASE}/grids/game/${gameId}?${params.toString()}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!res.ok) {
    throw new Error(`SteamGridDB grids fetch failed (${res.status})`);
  }
  const data = (await res.json()) as { success: boolean; data: GridItem[] };
  if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
    return null;
  }

  const portraitFirst = [...data.data].sort((a, b) => {
    const aPortrait = a.height >= a.width ? 0 : 1;
    const bPortrait = b.height >= b.width ? 0 : 1;
    return aPortrait - bPortrait;
  });
  return portraitFirst[0].url;
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
    const name = body?.name;
    if (!name || typeof name !== "string" || !name.trim()) {
      return jsonResponse({ error: "Missing 'name' in request body" }, 400);
    }

    const apiKey = Deno.env.get("STEAMGRIDDB_API_KEY");
    if (!apiKey) {
      return jsonResponse({ error: "SteamGridDB API key not configured" }, 500);
    }

    const gameId = await findGameId(name.trim(), apiKey);
    if (!gameId) {
      return jsonResponse({ image: null });
    }

    const image = await findCoverUrl(gameId, apiKey);
    return jsonResponse({ image, gameId });
  } catch (err) {
    console.error("sgdb-cover error:", err);
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Internal server error" },
      500,
    );
  }
});
