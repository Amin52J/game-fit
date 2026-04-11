import type React from "react";
import type { AIProviderConfig, Game, SetupAnswers } from "@/shared/types";

export type TestStatus = "idle" | "ok" | "err";

export interface StepProviderProps {
  config: AIProviderConfig;
  setConfig: React.Dispatch<React.SetStateAction<AIProviderConfig>>;
  showKey: boolean;
  setShowKey: (v: boolean) => void;
  testStatus: TestStatus;
  testLoading: boolean;
  onTest: () => void;
}

export interface StepPreferencesProps {
  answers: SetupAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<SetupAnswers>>;
}

export interface StepLibraryProps {
  importedGames: Game[];
  setImportedGames: React.Dispatch<React.SetStateAction<Game[]>>;
  pasteText: string;
  setPasteText: (v: string) => void;
  parseError: string | null;
  setParseError: (v: string | null) => void;
  steamAutoImportCount: number | null;
}

export interface StepReviewProps {
  aiConfig: AIProviderConfig;
  importedGames: Game[];
  answers: SetupAnswers;
}
