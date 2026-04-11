export const PAGE_SIZE = 20;

export type ViewMode = "detailed" | "list";

export const SCORE_FILTERS = [
  { key: "excellent", label: "80 +", min: 80, max: 100 },
  { key: "good", label: "60–79", min: 60, max: 79 },
  { key: "mixed", label: "40–59", min: 40, max: 59 },
  { key: "low", label: "< 40", min: 0, max: 39 },
] as const;

export const RISK_FILTERS = [
  { key: "none", label: "No risk" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
] as const;

export function readInitialParams(): {
  q: string;
  score: Set<string>;
  risk: Set<string>;
  view: ViewMode;
  ea: boolean;
} {
  if (typeof window === "undefined")
    return { q: "", score: new Set(), risk: new Set(), view: "detailed", ea: false };
  const params = new URLSearchParams(window.location.search);
  return {
    q: params.get("q") || "",
    score: new Set(params.get("score")?.split(",").filter(Boolean) || []),
    risk: new Set(params.get("risk")?.split(",").filter(Boolean) || []),
    view: params.get("view") === "list" ? "list" : "detailed",
    ea: params.get("ea") === "1",
  };
}

export function formatPrice(price: number, currencyCode: string | undefined): string {
  const code = currencyCode || "USD";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
    }).format(price);
  } catch {
    return `${code} ${price.toFixed(2)}`;
  }
}

export function formatDate(ts: number): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleString();
  }
}

export function formatDateShort(ts: number): string {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleDateString();
  }
}

export function matchesScoreFilter(score: number | null, filters: Set<string>): boolean {
  if (filters.size === 0) return true;
  if (score === null) return false;
  return SCORE_FILTERS.some((f) => filters.has(f.key) && score >= f.min && score <= f.max);
}

export function matchesRiskFilter(risk: string, filters: Set<string>): boolean {
  if (filters.size === 0) return true;
  return filters.has(risk);
}
