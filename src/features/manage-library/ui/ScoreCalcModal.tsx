"use client";

import React, { useState, useMemo } from "react";
import { Button, Input, Checkbox } from "@/shared/ui";
import {
  calculateGameScore,
  parseTimeInput,
  formatTime,
} from "@/features/score-calculator/lib/gameScorer";
import {
  ModalBackdrop,
  ModalCard,
  ModalTitle,
  ModalHint,
  ModalActions,
  ScorePreview,
  ScorePreviewRing,
  ScorePreviewDetails,
  ScorePreviewLabel,
  ScorePreviewValue,
} from "./GameLibrary.styles";

export function ScoreCalcModal({
  gameName,
  onApply,
  onClose,
}: {
  gameName: string;
  onApply: (score: number) => void;
  onClose: () => void;
}) {
  const [timeInput, setTimeInput] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const result = useMemo(() => {
    const minutes = parseTimeInput(timeInput);
    if (minutes === null || minutes <= 0) return null;
    return calculateGameScore(minutes, isFinished);
  }, [timeInput, isFinished]);

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Calculate Score — {gameName}</ModalTitle>
        <Input
          label="Time played"
          id="calc-time"
          autoFocus
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && result) onApply(result.calculatedScore);
            if (e.key === "Escape") onClose();
          }}
          placeholder="e.g. 2:30 or 45"
          hint="Use h:mm format (e.g. 1:30) or just hours (e.g. 2)"
        />
        <Checkbox
          label="I finished this game"
          checked={isFinished}
          onChange={(e) => setIsFinished(e.target.checked)}
        />
        <ScorePreview $visible={result !== null}>
          {result && (
            <>
              <ScorePreviewRing $score={result.calculatedScore}>
                {result.calculatedScore}
              </ScorePreviewRing>
              <ScorePreviewDetails>
                <ScorePreviewLabel>Calculated Score</ScorePreviewLabel>
                <ScorePreviewValue>
                  Based on {formatTime(result.timePlayedMinutes)} played
                </ScorePreviewValue>
              </ScorePreviewDetails>
            </>
          )}
        </ScorePreview>
        <ModalActions>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!result}
            onClick={() => result && onApply(result.calculatedScore)}
          >
            Apply Score
          </Button>
        </ModalActions>
      </ModalCard>
    </ModalBackdrop>
  );
}
