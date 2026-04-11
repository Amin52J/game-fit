"use client";

import React from "react";
import { formatTime, type GameScore } from "../lib/gameScorer";
import {
  ResultCardWrap,
  ScoreValue,
  ScoreMax,
  DetailGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
  CompletionNote,
} from "./ScoreCalculatorPage.styles";

export function ScoreResult({ result }: { result: GameScore }) {
  return (
    <ResultCardWrap>
      <ScoreValue>
        {result.calculatedScore}
        <ScoreMax> / 75</ScoreMax>
      </ScoreValue>

      <DetailGrid>
        <DetailItem>
          <DetailLabel>Time Played</DetailLabel>
          <DetailValue>{formatTime(result.timePlayedMinutes)}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Status</DetailLabel>
          <DetailValue>{result.isFinished ? "Completed" : "Not Completed"}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Effective Time</DetailLabel>
          <DetailValue>{formatTime(result.effectiveTimeUsed)}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Score Range</DetailLabel>
          <DetailValue>0 &ndash; {result.isFinished ? "75" : "74"}</DetailValue>
        </DetailItem>
      </DetailGrid>

      {result.isFinished && (
        <CompletionNote>
          Time is doubled for completed games when calculating the score
        </CompletionNote>
      )}
    </ResultCardWrap>
  );
}
