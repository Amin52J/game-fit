// REMOVE ME — this file is unused dead code
import { SCORE_FILTERS } from "./history-constants";
import type { ViewMode } from "./history-constants";

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
