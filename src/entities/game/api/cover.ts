import { getSupabase } from "@/shared/api/supabase";

export interface CoverResult {
  image: string | null;
}

export async function fetchGameCover(name: string): Promise<CoverResult> {
  const sb = getSupabase();
  const { data, error } = await sb.functions.invoke("sgdb-cover", {
    body: { name },
  });

  if (error) throw error;

  const d = data as { image?: string | null; error?: string };
  if (d?.error) throw new Error(d.error);

  return { image: d?.image ?? null };
}
