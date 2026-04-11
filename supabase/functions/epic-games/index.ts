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

const EPIC_CLIENT_ID = "34a02cf8f4414e29b15921876da36f9a";
const EPIC_CLIENT_SECRET = "daafbccc737745039dffe53d94fc76cf";
const EPIC_TOKEN_URL =
  "https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/token";
const EPIC_LIBRARY_URL =
  "https://library-service.live.use1a.on.epicgames.com/library/api/public/items?includeMetadata=true";
const EPIC_CATALOG_URL =
  "https://catalog-public-service-prod06.ol.epicgames.com/catalog/api/shared/namespace";

interface EpicLibraryRecord {
  namespace: string;
  catalogItemId: string;
  appName: string;
}

interface EpicCatalogItem {
  title?: string;
  id: string;
}

async function exchangeCode(
  authCode: string,
): Promise<{ access_token: string; account_id: string }> {
  const basic = btoa(`${EPIC_CLIENT_ID}:${EPIC_CLIENT_SECRET}`);

  const res = await fetch(EPIC_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: authCode,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${text}`);
  }

  return await res.json();
}

async function fetchLibrary(
  accessToken: string,
): Promise<EpicLibraryRecord[]> {
  const res = await fetch(EPIC_LIBRARY_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Library fetch failed (${res.status})`);
  }

  const data = await res.json();
  return data.records ?? [];
}

async function resolveNames(
  accessToken: string,
  records: EpicLibraryRecord[],
): Promise<string[]> {
  const byNamespace = new Map<string, string[]>();
  for (const r of records) {
    const list = byNamespace.get(r.namespace) ?? [];
    list.push(r.catalogItemId);
    byNamespace.set(r.namespace, list);
  }

  const names: string[] = [];

  for (const [ns, ids] of byNamespace) {
    const idParam = ids.join(",");
    const url = `${EPIC_CATALOG_URL}/${ns}/bulk/items?id=${idParam}&country=US&locale=en`;
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) continue;
      const items: Record<string, EpicCatalogItem> = await res.json();
      for (const item of Object.values(items)) {
        if (item.title) names.push(item.title);
      }
    } catch {
      // Skip failed namespace lookups
    }
  }

  // Fallback: use appName for any records we couldn't resolve
  if (names.length === 0) {
    for (const r of records) {
      const readable = r.appName
        .replace(/([A-Z])/g, " $1")
        .replace(/[_-]/g, " ")
        .trim();
      names.push(readable);
    }
  }

  return [...new Set(names)].sort();
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
    const code = body?.code;
    if (!code || typeof code !== "string") {
      return jsonResponse(
        { error: "Missing authorization code in request body" },
        400,
      );
    }

    const tokenData = await exchangeCode(code.trim());
    const records = await fetchLibrary(tokenData.access_token);
    const names = await resolveNames(tokenData.access_token, records);

    return jsonResponse({ games: names, count: names.length });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Internal server error" },
      500,
    );
  }
});
