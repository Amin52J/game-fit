import { getSupabase } from "@/shared/api/supabase";

const EPIC_CLIENT_ID = "34a02cf8f4414e29b15921876da36f9a";

const EPIC_LOGIN_URL =
  `https://www.epicgames.com/id/login?redirectUrl=${encodeURIComponent(
    `https://www.epicgames.com/id/api/redirect?clientId=${EPIC_CLIENT_ID}&responseType=code`,
  )}`;

export function openEpicLoginTab(): void {
  window.open(EPIC_LOGIN_URL, "_blank", "noopener");
}

export async function fetchEpicGames(
  authCode: string,
): Promise<string[]> {
  const sb = getSupabase();
  const { data, error } = await sb.functions.invoke("epic-games", {
    body: { code: authCode },
  });

  if (error) throw error;

  const d = data as Record<string, unknown>;
  if (d.error) throw new Error(String(d.error));

  return d.games as string[];
}
