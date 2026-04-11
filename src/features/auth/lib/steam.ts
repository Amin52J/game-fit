import { getSupabase } from "@/shared/api/supabase";

const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";

export function buildSteamOpenIdUrl(returnTo: string): string {
  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnTo,
    "openid.realm": window.location.origin,
    "openid.identity":
      "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id":
      "http://specs.openid.net/auth/2.0/identifier_select",
  });

  return `${STEAM_OPENID_URL}?${params.toString()}`;
}

export function parseSteamCallbackParams(
  url: string,
): Record<string, string> {
  const searchParams = new URL(url).searchParams;
  const result: Record<string, string> = {};

  for (const [key, value] of searchParams) {
    if (key.startsWith("openid.")) {
      result[key] = value;
    }
  }

  return result;
}

export function openSteamLoginPopup(): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    const returnUrl = `${window.location.origin}/steam-callback.html`;
    const loginUrl = buildSteamOpenIdUrl(returnUrl);

    const width = 800;
    const height = 600;
    const left = Math.round(screen.width / 2 - width / 2);
    const top = Math.round(screen.height / 2 - height / 2);

    const popup = window.open(
      loginUrl,
      "steam_login",
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    if (!popup) {
      reject(new Error("Failed to open Steam login popup"));
      return;
    }

    const interval = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(interval);
          reject(new Error("Steam login popup was closed"));
          return;
        }

        if (popup.location.href.includes("/steam-callback")) {
          const params = parseSteamCallbackParams(popup.location.href);
          clearInterval(interval);
          popup.close();
          resolve(params);
        }
      } catch {
        // Cross-origin access throws — ignore until popup navigates back
      }
    }, 500);
  });
}

export async function verifySteamLogin(
  params: Record<string, string>,
): Promise<{
  tokenHash: string;
  email: string;
  steamId: string;
  isNew: boolean;
}> {
  const sb = getSupabase();
  const { data, error } = await sb.functions.invoke("steam-auth", {
    body: { params },
  });

  if (error) throw error;

  const d = data as Record<string, unknown>;
  if (d.error) throw new Error(String(d.error));

  return {
    tokenHash: String(d.token_hash),
    email: String(d.email),
    steamId: String(d.steam_id),
    isNew: Boolean(d.is_new),
  };
}

export async function fetchSteamGames(
  steamId: string,
): Promise<{ name: string; playtimeHours: number }[]> {
  const sb = getSupabase();
  const { data, error } = await sb.functions.invoke("steam-games", {
    body: { steamId },
  });

  if (error) throw error;

  return data.games as { name: string; playtimeHours: number }[];
}

export function extractSteamIdFromParams(
  params: Record<string, string>,
): string | null {
  const claimedId = params["openid.claimed_id"];
  if (!claimedId) return null;

  const match = claimedId.match(
    /^https:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/,
  );

  return match ? match[1] : null;
}
