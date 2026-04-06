import type { AnalysisResult } from "@/shared/types";

interface AnalysisSession {
  gameName: string;
  priceRaw: string;
  result: AnalysisResult | null;
  streamedText: string;
}

const EMPTY: AnalysisSession = { gameName: "", priceRaw: "", result: null, streamedText: "" };

let _session: AnalysisSession = { ...EMPTY };

export const sessionCache = {
  get: (): AnalysisSession => _session,
  set: (partial: Partial<AnalysisSession>) => { _session = { ..._session, ...partial }; },
  clear: () => { _session = { ...EMPTY }; },
};
