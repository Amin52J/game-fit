"use client";

import React from "react";
import { ImportSectionRoot } from "./GameLibrary.styles";
import { SteamImport } from "./SteamImport";
import { EpicImport } from "./EpicImport";
import { FileImport } from "./FileImport";
import { PasteImport } from "./PasteImport";

interface ImportSectionProps {
  handleImport: (text: string) => void;
  onHide: () => void;
}

export function ImportSection({ handleImport, onHide }: ImportSectionProps) {
  return (
    <ImportSectionRoot>
      <SteamImport />
      <EpicImport />
      <FileImport handleImport={handleImport} />
      <PasteImport handleImport={handleImport} onHide={onHide} />
    </ImportSectionRoot>
  );
}
