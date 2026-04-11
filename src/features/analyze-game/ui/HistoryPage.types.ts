import type { AnalysisResult } from "@/shared/types";
import type { ParsedSection, ExtractedMetrics } from "@/features/analyze-game/lib/response-parser";

export interface EnrichedResult {
  item: AnalysisResult;
  sections: ParsedSection[];
  metrics: ExtractedMetrics;
}
