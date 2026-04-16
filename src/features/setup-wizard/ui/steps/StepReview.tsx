"use client";

import React from "react";
import type { AIProviderConfig, Game, SetupAnswers } from "@/shared/types";
import { DEALBREAKER_OPTIONS, FREE_ANALYSIS_LIMIT } from "@/shared/types";
import {
  FieldGroup,
  SectionTitle,
  SummaryList,
  SummaryItem,
} from "../SetupWizard.styles";

const PLAY_STYLE_LABELS: Record<string, string> = {
  singleplayer: "Single-player",
  multiplayer: "Multiplayer",
  both: "Both (SP & MP)",
};

const VOICE_LABELS: Record<string, string> = {
  essential: "Essential",
  preferred: "Preferred",
  indifferent: "Indifferent",
  fine_with_text: "Fine with text",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  challenging: "Challenging",
  soulslike: "Souls-like",
};

const LENGTH_LABELS: Record<string, string> = {
  short: "Short (<10h)",
  medium: "Medium (10–25h)",
  long: "Long (25h+)",
  any: "Any",
};

const IMPORTANCE_SLIDERS: [keyof SetupAnswers, string][] = [
  ["storyImportance", "Story"],
  ["gameplayImportance", "Gameplay"],
  ["explorationImportance", "Exploration"],
  ["combatImportance", "Combat"],
  ["puzzleImportance", "Puzzles"],
  ["strategyImportance", "Strategy"],
];

const dealbreakerLabelMap = Object.fromEntries(
  DEALBREAKER_OPTIONS.map((o) => [o.id, o.label]),
);

function formatImportanceBar(answers: SetupAnswers): string {
  return IMPORTANCE_SLIDERS.map(
    ([key, label]) => `${label} ${answers[key] as number}/5`,
  ).join(" · ");
}

export function StepReview({
  aiConfig,
  importedGames,
  answers,
  trialMode,
}: {
  aiConfig: AIProviderConfig;
  importedGames: Game[];
  answers: SetupAnswers;
  trialMode?: boolean;
}) {
  const providerLabel = trialMode
    ? `${FREE_ANALYSIS_LIMIT} starter analyses (our key)`
    : aiConfig.type === "anthropic"
      ? "Anthropic (Claude)"
      : aiConfig.type === "openai"
        ? "OpenAI"
        : aiConfig.type === "google"
          ? "Google (Gemini)"
          : "Custom endpoint";

  const allDealbreakers = [
    ...answers.dealbreakers.map((id) => dealbreakerLabelMap[id] ?? id),
    ...answers.customDealbreakers,
  ];

  return (
    <FieldGroup>
      <SectionTitle>Summary</SectionTitle>
      <SummaryList>
        <SummaryItem>
          <strong>Provider:</strong> {providerLabel}
          {!trialMode && <> · model {aiConfig.model || "—"}</>}
        </SummaryItem>
        <SummaryItem>
          <strong>Games imported:</strong> {importedGames.length}
        </SummaryItem>
        <SummaryItem>
          <strong>Play style:</strong> {PLAY_STYLE_LABELS[answers.playStyle] ?? answers.playStyle}
        </SummaryItem>
        <SummaryItem>
          <strong>Importance ratings:</strong> {formatImportanceBar(answers)}
        </SummaryItem>
        <SummaryItem>
          <strong>Dealbreakers:</strong>{" "}
          {allDealbreakers.length > 0 ? allDealbreakers.join(", ") : "None"}
        </SummaryItem>
        <SummaryItem>
          <strong>Voice acting:</strong> {VOICE_LABELS[answers.voiceActingPreference] ?? answers.voiceActingPreference}
        </SummaryItem>
        <SummaryItem>
          <strong>Difficulty:</strong> {DIFFICULTY_LABELS[answers.difficultyPreference] ?? answers.difficultyPreference}
        </SummaryItem>
        <SummaryItem>
          <strong>Ideal length:</strong> {LENGTH_LABELS[answers.idealLength] ?? answers.idealLength}
        </SummaryItem>
        <SummaryItem>
          <strong>Pricing:</strong> {answers.currency} · {answers.region}
        </SummaryItem>
        {answers.additionalNotes.trim() && (
          <SummaryItem>
            <strong>Notes:</strong> {answers.additionalNotes}
          </SummaryItem>
        )}
      </SummaryList>
    </FieldGroup>
  );
}
