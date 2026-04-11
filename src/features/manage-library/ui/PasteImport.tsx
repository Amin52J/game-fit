"use client";

import React, { useCallback, useState } from "react";
import { Button, TextArea } from "@/shared/ui";
import { SectionLabel, ImportBlock, ErrorText, PasteButtonRow } from "./GameLibrary.styles";

export function PasteImport({
  handleImport,
  onHide,
}: {
  handleImport: (text: string) => void;
  onHide: () => void;
}) {
  const [pasteText, setPasteText] = useState("");
  const [pasteError, setPasteError] = useState<string | null>(null);

  const handlePaste = useCallback(() => {
    setPasteError(null);
    if (!pasteText.trim()) return;
    try {
      handleImport(pasteText);
      setPasteText("");
      onHide();
    } catch {
      setPasteError("Could not parse pasted content.");
    }
  }, [pasteText, handleImport, onHide]);

  return (
    <div>
      <SectionLabel>Or paste data</SectionLabel>
      <ImportBlock>
        <TextArea
          rows={5}
          placeholder="Paste CSV, JSON array, or one game per line…"
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
        />
      </ImportBlock>
      <PasteButtonRow>
        <Button variant="secondary" onClick={handlePaste} disabled={!pasteText.trim()}>
          Parse pasted text
        </Button>
      </PasteButtonRow>
      {pasteError && <ErrorText>{pasteError}</ErrorText>}
    </div>
  );
}
