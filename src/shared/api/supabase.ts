import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI__" in window;
}

function createTauriStorage() {
  let storePromise: Promise<import("@tauri-apps/plugin-store").LazyStore> | null = null;

  function getStore() {
    if (!storePromise) {
      storePromise = import("@tauri-apps/plugin-store").then(
        ({ LazyStore }) => new LazyStore("supabase-auth.json", { defaults: {}, autoSave: true }),
      );
    }
    return storePromise;
  }

  return {
    async getItem(key: string): Promise<string | null> {
      const store = await getStore();
      return (await store.get<string>(key)) ?? null;
    },
    async setItem(key: string, value: string): Promise<void> {
      const store = await getStore();
      await store.set(key, value);
    },
    async removeItem(key: string): Promise<void> {
      const store = await getStore();
      await store.delete(key);
    },
  };
}

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase env vars not set (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)");
  }
  _client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      ...(isTauri() ? { storage: createTauriStorage() } : {}),
    },
  });
  return _client;
}
