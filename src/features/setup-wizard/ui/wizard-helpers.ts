// REMOVE ME — this file is unused dead code
import type { Game } from "@/shared/types";

/**
 * Merge two game lists by title. When `bPriority` is true, entries from `b`
 * overwrite duplicates in `a` (unless `a` has a score and `b` doesn't).
 * Default behaviour (bPriority=false): `a` always wins on duplicates unless
 * `b` has a strictly higher score.
 */
export function mergeGameLists(a: Game[], b: Game[], bPriority = false): Game[] {
  const map = new Map<string, Game>();
  const keyOf = (name: string) => name.trim().toLowerCase();
  for (const g of a) {
    map.set(keyOf(g.name), g);
  }
  for (const g of b) {
    const k = keyOf(g.name);
    const prev = map.get(k);
    if (!prev) {
      map.set(k, g);
      continue;
    }
    if (bPriority) {
      map.set(k, prev.score !== null && g.score === null ? prev : { ...g, id: prev.id });
    } else {
      const ps = prev.score ?? -Infinity;
      const gs = g.score ?? -Infinity;
      map.set(k, gs > ps ? { ...g, id: prev.id } : prev);
    }
  }
  return Array.from(map.values());
}

export function computeScoreBuckets(games: Game[]) {
  const buckets = {
    b0_25: 0,
    b26_50: 0,
    b51_75: 0,
    b76_100: 0,
    unscored: 0,
  };
  for (const g of games) {
    if (g.score === null || g.score === undefined || Number.isNaN(g.score)) {
      buckets.unscored += 1;
      continue;
    }
    const s = g.score;
    if (s <= 25) buckets.b0_25 += 1;
    else if (s <= 50) buckets.b26_50 += 1;
    else if (s <= 75) buckets.b51_75 += 1;
    else buckets.b76_100 += 1;
  }
  return buckets;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}
