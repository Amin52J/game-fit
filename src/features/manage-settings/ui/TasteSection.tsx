"use client";

import React from "react";
import { Button, SectionCard, SectionTitle, SectionDesc } from "@/shared/ui";
import { StepPreferences } from "@/features/setup-wizard/ui/SetupWizard";
import type { SetupAnswers } from "@/shared/types";
import { MarginedButtonRow } from "./SettingsPage.styles";

export function TasteSection({
  tasteAnswers,
  setTasteAnswers,
  onSave,
}: {
  tasteAnswers: SetupAnswers;
  setTasteAnswers: React.Dispatch<React.SetStateAction<SetupAnswers>>;
  onSave: () => void;
}) {
  return (
    <SectionCard>
      <SectionTitle>Game Taste</SectionTitle>
      <SectionDesc>
        Your gaming preferences, priorities, and dealbreakers. Changes will regenerate the AI
        instructions automatically.
      </SectionDesc>
      <StepPreferences answers={tasteAnswers} setAnswers={setTasteAnswers} />
      <MarginedButtonRow>
        <Button variant="primary" onClick={onSave}>Save Preferences</Button>
      </MarginedButtonRow>
    </SectionCard>
  );
}
