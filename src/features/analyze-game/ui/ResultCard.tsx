"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme } from "styled-components";
import { parseResponseSections, extractMetrics } from "@/features/analyze-game/lib/response-parser";
import type { ParsedSection } from "@/features/analyze-game/lib/response-parser";
import { renderScoreHero } from "./result/ScoreHero";
import { renderMetricsRow } from "./result/MetricsRow";
import { renderSection, displaySortKey, isInternalSection } from "./result/SectionRenderer";
import {
  Card,
  Header,
  GameTitle,
  GameMeta,
  EarlyAccessBadge,
  StreamRow,
  StreamCursor,
  ThinkingLabel,
  MarkdownBody,
  SkeletonBarSpaced,
  SectionCard,
  SectionContent,
  FallbackBody,
  ResultWrapper,
  PreviewGrid,
  PreviewLabel,
  PreviewValue,
  PreviewScoreCircle,
} from "./ResultCard.styles";

export { parseResponseSections, MarkdownBody };

export function AnalysisMarkdown({ source }: { source: string }) {
  return (
    <MarkdownBody>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </MarkdownBody>
  );
}

export function ThemedStructuredResult({
  sections,
  isStreaming,
  fullPrice,
  currencyCode,
}: {
  sections: ParsedSection[];
  isStreaming: boolean;
  fullPrice?: number;
  currencyCode?: string;
}) {
  const theme = useTheme() as { colors: Record<string, string> };
  const metrics = useMemo(() => extractMetrics(sections), [sections]);

  const bodySections = useMemo(
    () =>
      sections
        .filter((s) => s.key !== "preamble" && !isInternalSection(s.key))
        .sort((a, b) => displaySortKey(a.key) - displaySortKey(b.key)),
    [sections],
  );

  return (
    <ResultWrapper>
      {renderScoreHero(sections, metrics, isStreaming)}
      {renderMetricsRow(sections, metrics, theme, isStreaming, fullPrice, currencyCode)}
      {bodySections.map((section, i) =>
        renderSection(section, metrics, i === bodySections.length - 1, isStreaming, theme),
      )}
      {isStreaming && sections.length === 0 && (
        <SectionCard $accent="default">
          <SectionContent>
            <SkeletonBarSpaced $width="80%" />
            <SkeletonBarSpaced $width="65%" />
            <SkeletonBarSpaced $width="90%" />
            <StreamRow><StreamCursor /></StreamRow>
          </SectionContent>
        </SectionCard>
      )}
    </ResultWrapper>
  );
}

export function HistoryPreview({
  response,
  fullPrice,
  currencyCode,
}: {
  response: string;
  fullPrice?: number;
  currencyCode?: string;
}) {
  const theme = useTheme() as { colors: Record<string, string> };
  const sections = useMemo(() => parseResponseSections(response), [response]);
  const metrics = useMemo(() => extractMetrics(sections), [sections]);

  return (
    <PreviewGrid>
      {metrics.score !== null && (
        <div>
          <PreviewLabel>Score</PreviewLabel>
          <PreviewScoreCircle $score={metrics.score}>{metrics.score}</PreviewScoreCircle>
        </div>
      )}
      {metrics.riskLevel !== "unknown" && (
        <div>
          <PreviewLabel>Risk</PreviewLabel>
          <PreviewValue>
            {metrics.riskLevel.charAt(0).toUpperCase() + metrics.riskLevel.slice(1)}
          </PreviewValue>
        </div>
      )}
      {metrics.confidence && (
        <div>
          <PreviewLabel>Confidence</PreviewLabel>
          <PreviewValue>{metrics.confidence}</PreviewValue>
        </div>
      )}
      {metrics.targetPrice && (
        <div>
          <PreviewLabel>Target Price</PreviewLabel>
          <PreviewValue>{metrics.targetPrice}</PreviewValue>
        </div>
      )}
    </PreviewGrid>
  );
}

export function ResultCard({
  response,
  gameName,
  price,
  isStreaming,
  thinkingText,
}: {
  response: string;
  gameName: string;
  price: number;
  isStreaming: boolean;
  thinkingText?: string;
}) {
  const sections = useMemo(() => parseResponseSections(response), [response]);
  const hasStructure = sections.filter((s) => s.key !== "preamble").length >= 3;

  if (!hasStructure && response) {
    return (
      <Card>
        <Header>
          <GameTitle>{gameName}</GameTitle>
        </Header>
        {thinkingText ? (
          <SectionCard $accent="default">
            <SectionContent><ThinkingLabel>{thinkingText}</ThinkingLabel></SectionContent>
          </SectionCard>
        ) : null}
        <FallbackBody>
          <AnalysisMarkdown source={response} />
          {isStreaming && <StreamRow><StreamCursor /></StreamRow>}
        </FallbackBody>
      </Card>
    );
  }

  return (
    <Card>
      <Header>
        <GameTitle>
          {gameName}
          {sections.some((s) => s.content.toLowerCase().includes("early access")) && (
            <EarlyAccessBadge>Early Access</EarlyAccessBadge>
          )}
        </GameTitle>
        <GameMeta>Price: {price > 0 ? `$${price}` : "Free"}</GameMeta>
      </Header>
      {thinkingText ? (
        <SectionCard $accent="default">
          <SectionContent><ThinkingLabel>{thinkingText}</ThinkingLabel></SectionContent>
        </SectionCard>
      ) : null}
      <ThemedStructuredResult
        sections={sections}
        isStreaming={isStreaming}
        fullPrice={price}
      />
    </Card>
  );
}
