export interface Game {
  id: string;
  name: string;
  sortingName?: string;
  score: number | null;
}

export type AIProviderType = "anthropic" | "openai" | "google" | "custom";

export interface AIProviderConfig {
  type: AIProviderType;
  apiKey: string;
  model: string;
  baseUrl?: string;
  extendedThinking?: boolean;
}

export const DEFAULT_MODELS: Record<AIProviderType, string[]> = {
  anthropic: [
    "claude-sonnet-4-6",
    "claude-opus-4-6",
    "claude-haiku-4-5",
    "claude-sonnet-4-5",
    "claude-opus-4-5",
    "claude-sonnet-4-0",
    "claude-opus-4-0",
  ],
  openai: [
    "gpt-5.4",
    "gpt-5.4-mini",
    "gpt-5.4-nano",
    "gpt-5-mini",
    "gpt-5-nano",
    "gpt-5",
    "gpt-5.2",
    "gpt-5.1",
    "gpt-4.1",
    "gpt-4.1-mini",
    "gpt-4.1-nano",
    "o3",
    "o4-mini",
  ],
  google: [
    "gemini-3.1-pro",
    "gemini-3-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-pro",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
  ],
  custom: [],
};

export interface SetupAnswers {
  playStyle: "singleplayer" | "multiplayer" | "both";
  storyImportance: number;
  gameplayImportance: number;
  explorationImportance: number;
  combatImportance: number;
  puzzleImportance: number;
  strategyImportance: number;
  dealbreakers: string[];
  customDealbreakers: string[];
  voiceActingPreference: "essential" | "preferred" | "indifferent" | "fine_with_text";
  difficultyPreference: "easy" | "moderate" | "challenging" | "soulslike";
  idealLength: "short" | "medium" | "long" | "any";
  currency: string;
  region: string;
  additionalNotes: string;
}

export const DEALBREAKER_OPTIONS = [
  { id: "grind", label: "Repetitive grind / busywork" },
  { id: "always_online", label: "Always-online requirement for SP" },
  { id: "heavy_reading", label: "Heavy reading / text-only dialogue" },
  { id: "bad_controls", label: "Clunky controls / movement" },
  { id: "religious_themes", label: "Heavy religious themes" },
  { id: "slow_start", label: "Slow starts / long tutorials" },
  { id: "microtransactions", label: "Aggressive microtransactions" },
  { id: "shallow_crafting", label: "Shallow collecting / crafting" },
  { id: "bad_story", label: "Weak or absent story" },
  { id: "wayfinding", label: "Poor navigation / getting lost" },
  { id: "short_campaign", label: "Very short campaigns at full price" },
  { id: "gaas", label: "Games-as-a-service / live-service focus" },
] as const;

export interface AnalysisRequest {
  gameName: string;
  price: number;
}

export interface AnalysisResult {
  id: string;
  gameName: string;
  price: number;
  response: string;
  timestamp: number;
}

export interface AppState {
  isSetupComplete: boolean;
  aiProvider: AIProviderConfig | null;
  games: Game[];
  instructions: string;
  setupAnswers: SetupAnswers | null;
  analysisHistory: AnalysisResult[];
}

export const INITIAL_STATE: AppState = {
  isSetupComplete: false,
  aiProvider: null,
  games: [],
  instructions: "",
  setupAnswers: null,
  analysisHistory: [],
};
