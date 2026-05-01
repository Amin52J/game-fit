"use client";

import React from "react";
import type { ParsedSection } from "@/features/analyze-game/lib/response-parser";
import type { extractMetrics } from "@/features/analyze-game/lib/response-parser";
import { GameCover } from "@/entities/game";
import { SectionMarkdown } from "./SectionMarkdown";
import {
  ScoreHero,
  ScoreRing,
  InlineScoreRing,
  ScoreRingWrap,
  ScoreRingTag,
  ScoreDetails,
  ScoreLabel,
  ScoreSummaryText,
  CurrentScoreNote,
  SkeletonBarSpaced,
  SkeletonRing,
} from "../ResultCard.styles";

export interface RenderScoreHeroOptions {
  coverName?: string;
  compact?: boolean;
  hideTextOnMobile?: boolean;
}

export function renderScoreHero(
  sections: ParsedSection[],
  metrics: ReturnType<typeof extractMetrics>,
  isStreaming: boolean,
  options?: RenderScoreHeroOptions,
) {
  const scoreSection = sections.find((s) => s.key.includes("enjoyment-score"));
  const summarySection = sections.find((s) => s.key.includes("score-summary"));

  if (metrics.score === null && !scoreSection && !isStreaming) return null;

  const displayScore = metrics.earlyAccess
    ? metrics.potentialScore
    : metrics.score;

  const coverName = options?.coverName?.trim();
  const useCover = !!coverName;
  const useCompact = useCover && (options?.compact ?? false);
  const hideTextOnMobile = useCompact && (options?.hideTextOnMobile ?? false);

  return (
    <ScoreHero
      $withCover={useCover}
      $compact={useCompact}
      $hideTextOnMobile={hideTextOnMobile}
    >
      <ScoreRingWrap>
        {metrics.earlyAccess && <ScoreRingTag>Potential</ScoreRingTag>}
        {useCover ? (
          <GameCover name={coverName} size="md" />
        ) : displayScore !== null ? (
          <ScoreRing $score={displayScore}>{displayScore}</ScoreRing>
        ) : isStreaming ? (
          <SkeletonRing />
        ) : null}
      </ScoreRingWrap>
      {useCompact && displayScore !== null && (
        <InlineScoreRing $score={displayScore}>{displayScore}</InlineScoreRing>
      )}
      <ScoreDetails>
        {!useCompact && useCover && displayScore !== null && (
          <InlineScoreRing $score={displayScore}>{displayScore}</InlineScoreRing>
        )}
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
