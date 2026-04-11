export const PAGE_SIZE = 50;

export const SCORE_RANGES = [
  { key: "90-100", label: "90–100", min: 90, max: 100 },
  { key: "75-89", label: "75–89", min: 75, max: 89 },
  { key: "50-74", label: "50–74", min: 50, max: 74 },
  { key: "25-49", label: "25–49", min: 25, max: 49 },
  { key: "0-24", label: "0–24", min: 0, max: 24 },
  { key: "unscored", label: "Unscored", min: -1, max: -1 },
] as const;
