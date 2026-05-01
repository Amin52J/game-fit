const CACHE_PREFIX = "sgdb:cover:";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface CachedCover {
  image: string | null;
  fetchedAt: number;
}

export function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function cacheKey(name: string): string {
  return `${CACHE_PREFIX}${normalizeName(name)}`;
}

export function readCoverCache(name: string): CachedCover | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(name));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedCover;
    if (typeof parsed.fetchedAt !== "number") return null;
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) {
      window.localStorage.removeItem(cacheKey(name));
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeCoverCache(name: string, image: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const value: CachedCover = { image, fetchedAt: Date.now() };
    window.localStorage.setItem(cacheKey(name), JSON.stringify(value));
  } catch {
    // localStorage quota or access denied — silently ignore
  }
}

export function clearCoverCache(): void {
  if (typeof window === "undefined") return;
  const toRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith(CACHE_PREFIX)) toRemove.push(key);
  }
  for (const key of toRemove) window.localStorage.removeItem(key);
}
