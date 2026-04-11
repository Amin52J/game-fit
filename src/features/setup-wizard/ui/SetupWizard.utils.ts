import type { AIProviderConfig, Game, SetupAnswers } from "@/shared/types";
import { DEFAULT_MODELS } from "@/shared/types";

export const STEPS = [
  { id: 1, label: "AI Provider" },
  { id: 2, label: "Preferences" },
  { id: 3, label: "Library" },
  { id: 4, label: "Review" },
] as const;

export const CURRENCIES = [
  { code: "EUR", label: "EUR – Euro" },
  { code: "USD", label: "USD – US Dollar" },
  { code: "GBP", label: "GBP – British Pound" },
  { code: "CAD", label: "CAD – Canadian Dollar" },
  { code: "AUD", label: "AUD – Australian Dollar" },
  { code: "JPY", label: "JPY – Japanese Yen" },
  { code: "CHF", label: "CHF – Swiss Franc" },
  { code: "CNY", label: "CNY – Chinese Yuan" },
  { code: "SEK", label: "SEK – Swedish Krona" },
  { code: "NOK", label: "NOK – Norwegian Krone" },
  { code: "DKK", label: "DKK – Danish Krone" },
  { code: "PLN", label: "PLN – Polish Złoty" },
  { code: "CZK", label: "CZK – Czech Koruna" },
  { code: "HUF", label: "HUF – Hungarian Forint" },
  { code: "RON", label: "RON – Romanian Leu" },
  { code: "BGN", label: "BGN – Bulgarian Lev" },
  { code: "HRK", label: "HRK – Croatian Kuna" },
  { code: "TRY", label: "TRY – Turkish Lira" },
  { code: "RUB", label: "RUB – Russian Ruble" },
  { code: "UAH", label: "UAH – Ukrainian Hryvnia" },
  { code: "BRL", label: "BRL – Brazilian Real" },
  { code: "MXN", label: "MXN – Mexican Peso" },
  { code: "ARS", label: "ARS – Argentine Peso" },
  { code: "CLP", label: "CLP – Chilean Peso" },
  { code: "COP", label: "COP – Colombian Peso" },
  { code: "PEN", label: "PEN – Peruvian Sol" },
  { code: "INR", label: "INR – Indian Rupee" },
  { code: "KRW", label: "KRW – South Korean Won" },
  { code: "TWD", label: "TWD – Taiwan Dollar" },
  { code: "THB", label: "THB – Thai Baht" },
  { code: "SGD", label: "SGD – Singapore Dollar" },
  { code: "MYR", label: "MYR – Malaysian Ringgit" },
  { code: "IDR", label: "IDR – Indonesian Rupiah" },
  { code: "PHP", label: "PHP – Philippine Peso" },
  { code: "VND", label: "VND – Vietnamese Dong" },
  { code: "NZD", label: "NZD – New Zealand Dollar" },
  { code: "ZAR", label: "ZAR – South African Rand" },
  { code: "ILS", label: "ILS – Israeli Shekel" },
  { code: "SAR", label: "SAR – Saudi Riyal" },
  { code: "AED", label: "AED – UAE Dirham" },
  { code: "QAR", label: "QAR – Qatari Riyal" },
  { code: "KWD", label: "KWD – Kuwaiti Dinar" },
  { code: "EGP", label: "EGP – Egyptian Pound" },
  { code: "NGN", label: "NGN – Nigerian Naira" },
  { code: "KES", label: "KES – Kenyan Shilling" },
  { code: "PKR", label: "PKR – Pakistani Rupee" },
  { code: "BDT", label: "BDT – Bangladeshi Taka" },
  { code: "HKD", label: "HKD – Hong Kong Dollar" },
] as const;

export function defaultSetupAnswers(): SetupAnswers {
  return {
    playStyle: "singleplayer",
    storyImportance: 3,
    gameplayImportance: 3,
    explorationImportance: 3,
    combatImportance: 3,
    puzzleImportance: 3,
    strategyImportance: 3,
    dealbreakers: [],
    customDealbreakers: [],
    voiceActingPreference: "preferred",
    difficultyPreference: "moderate",
    idealLength: "medium",
    currency: "EUR",
    region: "Germany",
    additionalNotes: "",
  };
}

export function defaultAiConfig(): AIProviderConfig {
  return {
    type: "anthropic",
    apiKey: "",
    model: DEFAULT_MODELS.anthropic[0] ?? "",
    baseUrl: "",
  };
}

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
