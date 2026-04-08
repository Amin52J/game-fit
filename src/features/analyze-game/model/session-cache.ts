import type { AnalysisResult } from "@/shared/types";

interface AnalysisSession {
  gameName: string;
  priceRaw: string;
  result: AnalysisResult | null;
  streamedText: string;
  prefillId: number;
}

const EMPTY: AnalysisSession = { gameName: "", priceRaw: "", result: null, streamedText: "", prefillId: 0 };

let _session: AnalysisSession = { ...EMPTY };

export const sessionCache = {
  get: (): AnalysisSession => _session,
  set: (partial: Partial<AnalysisSession>) => { _session = { ..._session, ...partial }; },
  clear: () => { _session = { ...EMPTY }; },
};
