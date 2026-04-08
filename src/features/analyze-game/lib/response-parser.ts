export interface ParsedSection {
  heading: string;
  content: string;
  key: string;
}

export type RiskLevel = "none" | "medium" | "high" | "unknown";

export interface ExtractedMetrics {
  score: number | null;
  confidence: string | null;
  riskLevel: RiskLevel;
  targetPrice: string | null;
  refundRecommended: boolean;
}

function normalizeKey(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseResponseSections(text: string): ParsedSection[] {
  const parts = text.split(/^## /m);
  const sections: ParsedSection[] = [];

  if (parts[0]?.trim()) {
    sections.push({ heading: "", content: parts[0].trim(), key: "preamble" });
  }

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const newlineIdx = part.indexOf("\n");
    if (newlineIdx === -1) {
      sections.push({ heading: part.trim(), content: "", key: normalizeKey(part.trim()) });
    } else {
      const heading = part.slice(0, newlineIdx).trim();
      const content = part
        .slice(newlineIdx + 1)
        .replace(/(\n|^)---+\s*$/g, "")
        .trim();
      sections.push({ heading, content, key: normalizeKey(heading) });
    }
  }

  return sections;
}

export function extractMetrics(sections: ParsedSection[]): ExtractedMetrics {
  const metrics: ExtractedMetrics = {
    score: null,
    confidence: null,
    riskLevel: "unknown",
    targetPrice: null,
    refundRecommended: false,
  };

  for (const s of sections) {
    if (s.key.includes("enjoyment-score")) {
      const scoreMatch = s.content.match(/(\d{1,3})\s*(?:\/\s*100|%)/);
      if (scoreMatch) metrics.score = parseInt(scoreMatch[1], 10);

      const confMatch = s.content.match(
        /(?:confidence|level)[:\s—–-]*(Very High|High|Medium|Low|Very Low)/i,
      );
      if (confMatch) metrics.confidence = confMatch[1];
      if (!confMatch) {
        const altMatch = s.content.match(/\b(Very High|Very Low)\b/i);
        if (altMatch) metrics.confidence = altMatch[1];
        else {
          const simpleMatch = s.content.match(/\b(High|Medium|Low)\b/);
          if (simpleMatch) metrics.confidence = simpleMatch[1];
        }
      }
    }

    if (s.key.includes("red-line-risk")) {
      if (/\bHigh\b/.test(s.content)) metrics.riskLevel = "high";
      else if (/\bMedium\b/.test(s.content)) metrics.riskLevel = "medium";
      else if (/\bNone\b/.test(s.content)) metrics.riskLevel = "none";
    }

    if (s.key.includes("refund-guard")) {
      metrics.refundRecommended = /\brecommended\b/i.test(s.content)
        && !/\bnot required\b/i.test(s.content);
    }

    if (s.key.includes("target-price")) {
      const raw = s.content
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .filter((l) => !/^-{3,}$/.test(l))
        .join(" ")
        .replace(/\*{1,2}/g, "")
        .trim();
      if (raw) metrics.targetPrice = raw;
    }
  }

  return metrics;
}

/**
 * Deterministic client-side target price computation.
 * Uses a concave curve (fraction^1.3) over a wide range [40, 92]
 * so mid-range scores produce conservative prices.
 */
export function computeTargetPrice(
  score: number,
  riskLevel: RiskLevel,
  confidence: string | null,
  fullPrice: number,
  refundRecommended: boolean,
): { value: number | null; label: string } {
  let A = score;
  if (riskLevel === "medium") A -= 5;
  else if (riskLevel === "high") A -= 10;

  const conf = confidence?.toLowerCase() ?? "";
  if ((conf === "low" || conf === "very low") && riskLevel !== "none") A -= 5;

  if (refundRecommended && A < score) {
    A += (score - A) * 0.3;
  }

  A = Math.max(0, A);

  if (A < 40) return { value: null, label: "Don't buy" };
  if (A >= 92) return { value: fullPrice, label: formatPriceValue(fullPrice) };

  const fraction = (A - 40) / 52;
  const price = Math.round(fullPrice * (0.10 + 0.90 * Math.pow(fraction, 1.3)));
  return { value: price, label: formatPriceValue(price) };
}

function formatPriceValue(price: number): string {
  return `${price}`;
}

const KNOWN_SECTION_KEYS = new Set([
  "target-price",
  "refund-guard",
  "enjoyment-score",
  "score-summary",
  "summary",
  "what-the-game-is",
  "public-sentiment",
  "library-signals",
  "positive-alignment",
  "negative-factors",
  "red-line-risk",
]);

export function getSectionType(
  key: string,
): "score" | "price" | "refund" | "positive" | "negative" | "risk" | "sentiment" | "signals" | "default" {
  if (key.includes("enjoyment-score") || key.includes("score-summary")) return "score";
  if (key.includes("target-price")) return "price";
  if (key.includes("refund-guard")) return "refund";
  if (key.includes("positive-alignment")) return "positive";
  if (key.includes("negative-factors")) return "negative";
  if (key.includes("red-line-risk")) return "risk";
  if (key.includes("public-sentiment")) return "sentiment";
  if (key.includes("library-signals")) return "signals";
  return "default";
}

export function isKnownSection(key: string): boolean {
  for (const k of KNOWN_SECTION_KEYS) {
    if (key.includes(k)) return true;
  }
  return false;
}

const INTERNAL_PATTERNS = [
  "scoring-procedure",
  "internal-calculation",
  "methodology",
  "calculation",
  "step-by-step",
  "anchor-games",
  "penalty-checklist",
  "base-score",
];

export function isInternalSection(key: string): boolean {
  return INTERNAL_PATTERNS.some((p) => key.includes(p));
}
