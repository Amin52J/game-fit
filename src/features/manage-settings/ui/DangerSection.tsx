"use client";

import React from "react";
import { Button, SectionCard, SectionDesc } from "@/shared/ui";
import { DangerSectionTitle, MarginedButtonRow } from "./SettingsPage.styles";

export function DangerSection({ onReset }: { onReset: () => void }) {
  return (
    <SectionCard>
      <DangerSectionTitle>Danger Zone</DangerSectionTitle>
      <SectionDesc>Permanently delete all your data (library, history, preferences) and start over.</SectionDesc>
      <MarginedButtonRow>
        <Button variant="danger" onClick={onReset}>Reset Everything</Button>
      </MarginedButtonRow>
    </SectionCard>
  );
}
