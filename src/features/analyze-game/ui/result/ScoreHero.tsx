"use client";

import React from "react";
import type { ParsedSection } from "@/features/analyze-game/lib/response-parser";
import type { extractMetrics } from "@/features/analyze-game/lib/response-parser";
import { SectionMarkdown } from "./SectionMarkdown";
import {
  ScoreHero,
  ScoreRing,
  ScoreRingWrap,
  ScoreRingTag,
  ScoreDetails,
  ScoreLabel,
  ScoreSummaryText,
  CurrentScoreNote,
  SkeletonBarSpaced,
  SkeletonRing,
} from "../ResultCard.styles";

export function renderScoreHero(
  sections: ParsedSection[],
  metrics: ReturnType<typeof extractMetrics>,
  isStreaming: boolean,
) {
  const scoreSection = sections.find((s) => s.key.includes("enjoyment-score"));
  const summarySection = sections.find((s) => s.key.includes("score-summary"));

  if (metrics.score === null && !scoreSection && !isStreaming) return null;

  const displayScore = metrics.earlyAccess
    ? metrics.potentialScore
    : metrics.score;

  return (
    <ScoreHero>
      <ScoreRingWrap>
        {metrics.earlyAccess && <ScoreRingTag>Potential</ScoreRingTag>}
        {displayScore !== null ? (
          <ScoreRing $score={displayScore}>{displayScore}</ScoreRing>
        ) : isStreaming ? (
          <SkeletonRing />
        ) : null}
      </ScoreRingWrap>
      <ScoreDetails>
        <ScoreLabel>Enjoyment Score</ScoreLabel>
        {metrics.earlyAccess && metrics.score !== null && (
          <CurrentScoreNote>Currently {metrics.score}/100</CurrentScoreNote>
        )}
        {summarySection ? (
          <ScoreSummaryText><SectionMarkdown content={summarySection.content} /></ScoreSummaryText>
        ) : scoreSection ? (
          <ScoreSummaryText><SectionMarkdown content={scoreSection.content} /></ScoreSummaryText>
        ) : isStreaming ? (
          <>
            <SkeletonBarSpaced $width="60%" />
            <SkeletonBarSpaced $width="85%" />
          </>
        ) : null}
      </ScoreDetails>
    </ScoreHero>
  );
}
