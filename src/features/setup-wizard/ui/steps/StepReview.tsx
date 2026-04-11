"use client";

import React from "react";
import type { AIProviderConfig, Game, SetupAnswers } from "@/shared/types";
import {
  FieldGroup,
  SectionTitle,
  SummaryList,
  SummaryItem,
} from "../SetupWizard.styles";

export function StepReview({
  aiConfig,
  importedGames,
  answers,
}: {
  aiConfig: AIProviderConfig;
  importedGames: Game[];
  answers: SetupAnswers;
}) {
  const providerLabel =
    aiConfig.type === "anthropic"
      ? "Anthropic (Claude)"
      : aiConfig.type === "openai"
        ? "OpenAI"
        : aiConfig.type === "google"
          ? "Google (Gemini)"
          : "Custom endpoint";

  return (
    <FieldGroup>
      <SectionTitle>Summary</SectionTitle>
      <SummaryList>
        <SummaryItem>
          <strong>Provider:</strong> {providerLabel} · model {aiConfig.model || "—"}
        </SummaryItem>
        <SummaryItem>
          <strong>Games:</strong> {importedGames.length} imported
        </SummaryItem>
        <SummaryItem>
          <strong>Play style:</strong> {answers.playStyle} · <strong>Difficulty:</strong>{" "}
          {answers.difficultyPreference} · <strong>Length:</strong> {answers.idealLength}
        </SummaryItem>
        <SummaryItem>
          <strong>Pricing context:</strong> {answers.currency} · {answers.region}
        </SummaryItem>
      </SummaryList>
    </FieldGroup>
  );
}
