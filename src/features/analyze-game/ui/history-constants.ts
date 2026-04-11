// REMOVE ME — this file is unused dead code
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
