"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useApp } from "@/app/providers/AppProvider";
import { Icon } from "@/shared/ui";
import { GameCover } from "@/entities/game";
import { parseResponseSections, extractMetrics, isInternalSection } from "@/features/analyze-game/lib/response-parser";
import type { ParsedSection } from "@/features/analyze-game/lib/response-parser";
import { renderScoreHero } from "./result/ScoreHero";
import { renderMetricsRow } from "./result/MetricsRow";
import { renderSection, displaySortKey } from "./result/SectionRenderer";
import { formatPrice, FALLBACK_THEME } from "./ResultCard.utils";
import {
  Card,
  Header,
  HeaderRow,
  HeaderText,
  GameTitle,
  GameMeta,
  EarlyAccessBadge,
  StreamRow,
  StreamCursor,
  ThinkingLabel,
  MarkdownBody,
  SkeletonBarSpaced,
  FallbackBody,
  PreviewWrap,
  RefundStrip,
  RefundSkeletonBanner,
  RefundSkeletonIcon,
  RefundSkeletonTitle,
  RefundSkeletonBody,
} from "./ResultCard.styles";

export { parseResponseSections, MarkdownBody };

function ThinkingDisplay({ text }: { text: string }) {
  const label = text || "Thinking...";
  return (
    <ThinkingLabel aria-hidden>
      {label}<StreamCursor />
    </ThinkingLabel>
  );
}

export interface AnalysisMarkdownProps {
  source: string;
  showStreamCursor?: boolean;
  thinkingText?: string;
}

export function AnalysisMarkdown({ source, showStreamCursor, thinkingText }: AnalysisMarkdownProps) {
  const waitingForFirst = showStreamCursor && !source;

  return (
    <MarkdownBody>
      {waitingForFirst ? (
        <ThinkingDisplay text={thinkingText ?? ""} />
      ) : (
        <>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
          {showStreamCursor ? (
            <StreamRow aria-hidden><StreamCursor /></StreamRow>
          ) : null}
        </>
      )}
    </MarkdownBody>
  );
}

export function ThemedStructuredResult({
  sections,
  isStreaming,
  fullPrice,
  currencyCode,
  coverName,
}: {
  sections: ParsedSection[];
  isStreaming: boolean;
  fullPrice?: number;
  currencyCode?: string;
  coverName?: string;
}) {
  const metrics = extractMetrics(sections);

  const contentSections = sections.filter(
    (s) =>
      s.key !== "preamble" &&
      !s.key.includes("enjoyment-score") &&
      !s.key.includes("score-summary") &&
      !s.key.includes("target-price") &&
      !isInternalSection(s.key),
  );

  const refundSection = contentSections.find((s) => s.key.includes("refund-guard"));
  const otherSections = contentSections.filter((s) => !s.key.includes("refund-guard"));

  const ordered = isStreaming
    ? otherSections
    : [...otherSections].sort((a, b) => displaySortKey(a.key) - displaySortKey(b.key));

  return (
    <>
      {renderScoreHero(sections, metrics, isStreaming, { coverName, compact: !!coverName })}
      {renderMetricsRow(sections, metrics, FALLBACK_THEME, isStreaming, fullPrice, currencyCode)}
      {refundSection
        ? renderSection(refundSection, metrics, false, isStreaming, FALLBACK_THEME)
        : isStreaming && (
          <RefundSkeletonBanner>
            <RefundSkeletonIcon />
            <RefundSkeletonBody>
              <RefundSkeletonTitle />
              <SkeletonBarSpaced $width="85%" />
              <SkeletonBarSpaced $width="60%" />
            </RefundSkeletonBody>
          </RefundSkeletonBanner>
        )}
      {ordered.map((s, i) =>
        renderSection(s, metrics, i === ordered.length - 1, isStreaming, FALLBACK_THEME),
      )}
    </>
  );
}

export interface ResultCardProps {
  response: string;
  gameName: string;
  price: number;
  isStreaming: boolean;
  thinkingText?: string;
}

export function ResultCard({ response, gameName, price, isStreaming, thinkingText }: ResultCardProps) {
  const { state } = useApp();
  const priceLabel = formatPrice(price, state.setupAnswers?.currency);

  const { sections, useStructured, earlyAccess } = useMemo(() => {
    const parsed = parseResponseSections(response);
    const hasSections = parsed.filter((s) => s.key !== "preamble").length >= 1;
    const preamble = parsed.find((s) => s.key === "preamble");
    return {
      sections: parsed,
      useStructured: hasSections,
      earlyAccess: Boolean(preamble && /\[EARLY_ACCESS\]/i.test(preamble.content)),
    };
  }, [response]);

  const waitingForFirst = isStreaming && !response;

  return (
    <Card>
      <Header>
        <HeaderRow>
          {gameName && <GameCover name={gameName} size="md" />}
          <HeaderText>
            <GameTitle>
              {gameName}
              {earlyAccess && <EarlyAccessBadge>Early Access</EarlyAccessBadge>}
            </GameTitle>
            <GameMeta>{priceLabel}</GameMeta>
          </HeaderText>
        </HeaderRow>
      </Header>

      {waitingForFirst ? (
        <FallbackBody>
          <MarkdownBody>
            <ThinkingDisplay text={thinkingText ?? ""} />
          </MarkdownBody>
        </FallbackBody>
      ) : (useStructured || isStreaming) ? (
        <ThemedStructuredResult sections={sections} isStreaming={isStreaming} fullPrice={price} currencyCode={state.setupAnswers?.currency} />
      ) : (
        <FallbackBody>
          <AnalysisMarkdown source={response} showStreamCursor={isStreaming} thinkingText={thinkingText} />
        </FallbackBody>
      )}
    </Card>
  );
}

export function HistoryPreview({ response, gameName, fullPrice, currencyCode }: { response: string; gameName?: string; fullPrice?: number; currencyCode?: string }) {
  const sections = useMemo(() => parseResponseSections(response), [response]);
  const metrics = useMemo(() => extractMetrics(sections), [sections]);
  const hasStructure = sections.filter((s) => s.key !== "preamble").length >= 3;

  if (!hasStructure) return null;

  const refundSection = sections.find((s) => s.key.includes("refund-guard"));
  const refundRequired = metrics.refundRecommended;

  return (
    <PreviewWrap>
      {renderScoreHero(sections, metrics, false, { coverName: gameName, compact: true, hideTextOnMobile: true })}
      {renderMetricsRow(sections, metrics, FALLBACK_THEME, false, fullPrice, currencyCode)}
      {refundSection && (
        <RefundStrip $required={refundRequired}>
          <Icon name={refundRequired ? "alert-triangle" : "info"} size={14} />
          <span><strong>Refund Guard:</strong> {refundRequired ? "Recommended" : "Not required"}</span>
        </RefundStrip>
      )}
    </PreviewWrap>
  );
}
