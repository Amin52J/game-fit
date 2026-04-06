"use client";

import React, { useMemo } from "react";
import styled, { css, keyframes } from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useApp } from "@/app/providers/AppProvider";
import { Icon } from "@/shared/ui";
import {
  parseResponseSections,
  extractMetrics,
  getSectionType,
  type ParsedSection,
  type RiskLevel,
} from "@/features/analyze-game/lib/response-parser";

/* ——— Animations ——— */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.2; }
`;

/* ——— Markdown body (shared) ——— */

export const MarkdownBody = styled.div`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.9375rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text};

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.font.sans};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin: 1.25em 0 0.5em;
    line-height: 1.35;
  }
  h1:first-child, h2:first-child, h3:first-child { margin-top: 0; }
  h1 { font-size: 1.375rem; }
  h2 { font-size: 1.2rem; }
  h3 { font-size: 1.05rem; }

  p { margin: 0.65em 0; }
  p:first-child { margin-top: 0; }
  p:last-child { margin-bottom: 0; }

  ul, ol { margin: 0.65em 0; padding-left: 1.35rem; }
  li { margin: 0.3em 0; }
  li::marker { color: ${({ theme }) => theme.colors.textMuted}; }

  strong { font-weight: 600; color: ${({ theme }) => theme.colors.text}; }
  em { font-style: italic; color: ${({ theme }) => theme.colors.textSecondary}; }

  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;
    &:hover { color: ${({ theme }) => theme.colors.accentHover}; text-decoration: underline; }
  }

  code {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 0.84em;
    padding: 0.15em 0.4em;
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.colors.surfaceElevated};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }

  pre {
    margin: 0.85em 0;
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.bg};
    border: 1px solid ${({ theme }) => theme.colors.border};
    overflow-x: auto;
    code { padding: 0; border: none; background: transparent; font-size: 0.8125rem; }
  }

  blockquote {
    margin: 0.85em 0;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    border-left: 3px solid ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentMuted};
    border-radius: 0 ${({ theme }) => theme.radius.sm} ${({ theme }) => theme.radius.sm} 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  hr { display: none; }

  table { width: 100%; border-collapse: collapse; margin: 0.85em 0; font-size: 0.875rem; }
  th, td {
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    text-align: left;
  }
  th {
    background: ${({ theme }) => theme.colors.surfaceElevated};
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }
`;

/* ——— Streaming indicators ——— */

const StreamRow = styled.span`
  display: inline-flex;
  align-items: center;
  vertical-align: baseline;
`;

const StreamCursor = styled.span`
  display: inline-block;
  width: 0.55em;
  height: 1.1em;
  margin-left: 2px;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 2px;
  animation: ${pulse} 1s ease-in-out infinite;
  vertical-align: text-bottom;
`;

const ThinkingLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-right: ${({ theme }) => theme.spacing.xs};
  animation: ${pulse} 1s ease-in-out infinite;
`;

/* ——— Result card shell ——— */

const Card = styled.article`
  margin-top: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  overflow: hidden;
  animation: ${fadeUp} ${({ theme }) => theme.transition.normal};
`;

const Header = styled.header`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const GameTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.3;
`;

const GameMeta = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/* ——— Score hero ——— */

const ScoreHero = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ScoreRing = styled.div<{ $score: number }>`
  flex-shrink: 0;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 1.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 4px solid ${({ $score, theme }) =>
    $score >= 80
      ? theme.colors.success
      : $score >= 60
        ? theme.colors.accent
        : $score >= 40
          ? theme.colors.warning
          : theme.colors.error};
  box-shadow: 0 0 20px ${({ $score, theme }) =>
    $score >= 80
      ? theme.colors.successMuted
      : $score >= 60
        ? theme.colors.accentMuted
        : $score >= 40
          ? theme.colors.warningMuted
          : theme.colors.errorMuted};
`;

const ScoreDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const ScoreLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ConfidenceBadge = styled.span<{ $level: string }>`
  display: inline-block;
  padding: 2px 8px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-radius: ${({ theme }) => theme.radius.sm};
  margin-left: ${({ theme }) => theme.spacing.sm};
  ${({ $level, theme }) => {
    if ($level.toLowerCase().includes("very high") || $level.toLowerCase() === "high")
      return css`background: ${theme.colors.successMuted}; color: ${theme.colors.success};`;
    if ($level.toLowerCase() === "medium")
      return css`background: ${theme.colors.warningMuted}; color: ${theme.colors.warning};`;
    return css`background: ${theme.colors.errorMuted}; color: ${theme.colors.error};`;
  }}
`;

const ScoreSummaryText = styled.div`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

/* ——— Metrics row ——— */

const MetricsRow = styled.div`
  display: flex;
  gap: 1px;
  background: ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const MetricCell = styled.div<{ $accent?: string }>`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const MetricLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MetricValue = styled.div<{ $color?: string }>`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ $color, theme }) => $color || theme.colors.text};
  word-break: break-word;
`;

/* ——— Section cards ——— */

type SectionAccent = "default" | "positive" | "negative" | "warning" | "risk-none" | "risk-medium" | "risk-high";

const accentBorder = (accent: SectionAccent) => css`
  border-left: 3px solid ${({ theme }) =>
    accent === "positive"
      ? theme.colors.success
      : accent === "negative"
        ? theme.colors.error
        : accent === "warning"
          ? theme.colors.warning
          : accent === "risk-high"
            ? theme.colors.error
            : accent === "risk-medium"
              ? theme.colors.warning
              : accent === "risk-none"
                ? theme.colors.success
                : theme.colors.border};
`;

const SectionCard = styled.div<{ $accent: SectionAccent }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  ${({ $accent }) => accentBorder($accent)}
`;

const SectionHeading = styled.h3<{ $color?: string }>`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ $color, theme }) => $color || theme.colors.textSecondary};
`;

const SectionContent = styled.div`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.9375rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text};
`;

/* ——— Refund banner ——— */

const RefundBanner = styled.div<{ $required: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme, $required }) =>
    $required ? theme.colors.warningMuted : theme.colors.accentMuted};
  border-bottom: 1px solid ${({ theme, $required }) =>
    $required ? theme.colors.warning : theme.colors.accent};
  border-left: 3px solid ${({ theme, $required }) =>
    $required ? theme.colors.warning : theme.colors.accent};
`;

const RefundIconWrap = styled.span<{ $required: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-top: 2px;
  color: ${({ theme, $required }) => $required ? theme.colors.warning : theme.colors.accent};
`;

const RefundTitle = styled.div<{ $required: boolean }>`
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme, $required }) => $required ? theme.colors.warning : theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

/* ——— Fallback body ——— */

const FallbackBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

/* ——— Helpers ——— */

function SectionMarkdown({ content }: { content: string }) {
  return (
    <MarkdownBody>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </MarkdownBody>
  );
}

function riskAccent(level: RiskLevel): SectionAccent {
  if (level === "high") return "risk-high";
  if (level === "medium") return "risk-medium";
  if (level === "none") return "risk-none";
  return "default";
}

function riskColor(level: RiskLevel, theme: { colors: Record<string, string> }): string {
  if (level === "high") return theme.colors.error;
  if (level === "medium") return theme.colors.warning;
  if (level === "none") return theme.colors.success;
  return theme.colors.textSecondary;
}

function confidenceColor(level: string, theme: { colors: Record<string, string> }): string {
  const lower = level.toLowerCase();
  if (lower === "very high" || lower === "high") return theme.colors.success;
  if (lower === "medium") return theme.colors.warning;
  return theme.colors.error;
}

function scoreColor(score: number, theme: { colors: Record<string, string> }): string {
  if (score >= 80) return theme.colors.success;
  if (score >= 60) return theme.colors.accent;
  if (score >= 40) return theme.colors.warning;
  return theme.colors.error;
}

function priceColor(text: string, theme: { colors: Record<string, string> }): string {
  const lower = text.toLowerCase();
  if (lower.includes("don't buy") || lower.includes("don't buy")) return theme.colors.error;
  return theme.colors.success;
}

/* ——— Renderers for each section type ——— */

function renderScoreHero(
  sections: ParsedSection[],
  metrics: ReturnType<typeof extractMetrics>,
) {
  const scoreSection = sections.find((s) => s.key.includes("enjoyment-score"));
  const summarySection = sections.find((s) => s.key.includes("score-summary"));

  if (metrics.score === null && !scoreSection) return null;

  return (
    <ScoreHero>
      {metrics.score !== null && (
        <ScoreRing $score={metrics.score}>{metrics.score}</ScoreRing>
      )}
      <ScoreDetails>
        <ScoreLabel>
          Enjoyment Score
          {metrics.confidence && <ConfidenceBadge $level={metrics.confidence}>{metrics.confidence}</ConfidenceBadge>}
        </ScoreLabel>
        {summarySection && (
          <ScoreSummaryText>
            <SectionMarkdown content={summarySection.content} />
          </ScoreSummaryText>
        )}
        {!summarySection && scoreSection && (
          <ScoreSummaryText>
            <SectionMarkdown content={scoreSection.content} />
          </ScoreSummaryText>
        )}
      </ScoreDetails>
    </ScoreHero>
  );
}

function renderMetricsRow(
  sections: ParsedSection[],
  metrics: ReturnType<typeof extractMetrics>,
  theme: { colors: Record<string, string> },
) {
  const riskSection = sections.find((s) => s.key.includes("red-line-risk"));
  const hasMetrics = metrics.targetPrice || riskSection;
  if (!hasMetrics) return null;

  return (
    <MetricsRow>
      {metrics.targetPrice && (
        <MetricCell>
          <MetricLabel>Target Price</MetricLabel>
          <MetricValue $color={priceColor(metrics.targetPrice, theme)}>
            {metrics.targetPrice}
          </MetricValue>
        </MetricCell>
      )}
      {riskSection && (
        <MetricCell>
          <MetricLabel>Red-Line Risk</MetricLabel>
          <MetricValue $color={riskColor(metrics.riskLevel, theme)}>
            {metrics.riskLevel === "unknown"
              ? "See below"
              : metrics.riskLevel.charAt(0).toUpperCase() + metrics.riskLevel.slice(1)}
          </MetricValue>
        </MetricCell>
      )}
      {metrics.confidence && (
        <MetricCell>
          <MetricLabel>Confidence</MetricLabel>
          <MetricValue $color={confidenceColor(metrics.confidence, theme)}>
            {metrics.confidence}
          </MetricValue>
        </MetricCell>
      )}
    </MetricsRow>
  );
}

function renderSection(
  section: ParsedSection,
  metrics: ReturnType<typeof extractMetrics>,
  isLast: boolean,
  isStreaming: boolean,
  theme: { colors: Record<string, string> },
) {
  const type = getSectionType(section.key);
  const showCursor = isLast && isStreaming;

  if (type === "score") return null;
  if (section.key.includes("target-price")) return null;

  if (type === "refund") {
    const lower = section.content.toLowerCase();
    const isRequired = !/not\s+\w*\s*(?:required|needed|necessary|recommended|applicable)|no\s+(?:guard|concerns|refund|special|high)|none\s+(?:needed|required)|unnecessary|n\/a|low risk|safe\s+(?:to buy|purchase)/.test(lower);
    return (
      <RefundBanner key={section.key} $required={isRequired}>
        <RefundIconWrap $required={isRequired}><Icon name={isRequired ? "alert-triangle" : "info"} size={20} /></RefundIconWrap>
        <SectionContent>
          <RefundTitle $required={isRequired}>Refund Guard</RefundTitle>
          <SectionMarkdown content={section.content} />
          {showCursor && <StreamRow aria-hidden><StreamCursor /></StreamRow>}
        </SectionContent>
      </RefundBanner>
    );
  }

  let accent: SectionAccent = "default";
  let headingColor: string | undefined;

  if (type === "positive") {
    accent = "positive";
    headingColor = theme.colors.success;
  } else if (type === "negative") {
    accent = "negative";
    headingColor = theme.colors.error;
  } else if (type === "risk") {
    accent = riskAccent(metrics.riskLevel);
    headingColor = riskColor(metrics.riskLevel, theme);
  }

  return (
    <SectionCard key={section.key} $accent={accent}>
      <SectionHeading $color={headingColor}>{section.heading}</SectionHeading>
      <SectionContent>
        <SectionMarkdown content={section.content} />
        {showCursor && <StreamRow aria-hidden><StreamCursor /></StreamRow>}
      </SectionContent>
    </SectionCard>
  );
}

/* ——— Structured result view ——— */

function StructuredResult({
  sections,
  isStreaming,
  theme,
}: {
  sections: ParsedSection[];
  isStreaming: boolean;
  theme: { colors: Record<string, string> };
}) {
  const metrics = extractMetrics(sections);

  const contentSections = sections.filter(
    (s) =>
      s.key !== "preamble" &&
      !s.key.includes("enjoyment-score") &&
      !s.key.includes("score-summary") &&
      !s.key.includes("target-price"),
  );

  return (
    <>
      {renderScoreHero(sections, metrics)}
      {renderMetricsRow(sections, metrics, theme)}
      {contentSections.map((s, i) =>
        renderSection(s, metrics, i === contentSections.length - 1, isStreaming, theme),
      )}
    </>
  );
}

/* ——— Public components ——— */

export interface AnalysisMarkdownProps {
  source: string;
  showStreamCursor?: boolean;
}

export function AnalysisMarkdown({ source, showStreamCursor }: AnalysisMarkdownProps) {
  const waitingForFirst = showStreamCursor && !source;

  return (
    <MarkdownBody>
      {waitingForFirst ? (
        <StreamRow aria-hidden>
          <ThinkingLabel>Thinking...</ThinkingLabel>
          <StreamCursor />
        </StreamRow>
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

export interface ResultCardProps {
  response: string;
  gameName: string;
  price: number;
  isStreaming: boolean;
}

function formatPrice(price: number, currencyCode: string | undefined): string {
  const code = currencyCode || "USD";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: code }).format(price);
  } catch {
    return `${code} ${price.toFixed(2)}`;
  }
}

export function ResultCard({ response, gameName, price, isStreaming }: ResultCardProps) {
  const { state } = useApp();
  const priceLabel = formatPrice(price, state.setupAnswers?.currency);

  const { sections, useStructured, themeColors } = useMemo(() => {
    const parsed = parseResponseSections(response);
    const hasSections = parsed.filter((s) => s.key !== "preamble").length >= 3;
    return {
      sections: parsed,
      useStructured: hasSections,
      themeColors: null as unknown,
    };
  }, [response]);

  const waitingForFirst = isStreaming && !response;

  return (
    <Card>
      <Header>
        <GameTitle>{gameName}</GameTitle>
        <GameMeta>{priceLabel}</GameMeta>
      </Header>

      {waitingForFirst ? (
        <FallbackBody>
          <MarkdownBody>
            <StreamRow aria-hidden>
              <ThinkingLabel>Thinking...</ThinkingLabel>
              <StreamCursor />
            </StreamRow>
          </MarkdownBody>
        </FallbackBody>
      ) : useStructured ? (
        <ThemedStructuredResult sections={sections} isStreaming={isStreaming} />
      ) : (
        <FallbackBody>
          <AnalysisMarkdown source={response} showStreamCursor={isStreaming} />
        </FallbackBody>
      )}
    </Card>
  );
}

export function HistoryPreview({ response }: { response: string }) {
  const sections = useMemo(() => parseResponseSections(response), [response]);
  const metrics = useMemo(() => extractMetrics(sections), [sections]);
  const hasStructure = sections.filter((s) => s.key !== "preamble").length >= 3;

  if (!hasStructure) return null;

  const refundSection = sections.find((s) => s.key.includes("refund-guard"));
  const theme = {
    colors: {
      success: "#22c55e",
      accent: "#7c8aff",
      warning: "#f59e0b",
      error: "#ef4444",
      text: "#e4e4f0",
      textSecondary: "#8888a8",
      textMuted: "#555570",
    },
  };

  const refundLower = refundSection?.content.toLowerCase() ?? "";
  const refundRequired = !/not\s+\w*\s*(?:required|needed|necessary|recommended|applicable)|no\s+(?:guard|concerns|refund|special|high)|none\s+(?:needed|required)|unnecessary|n\/a|low risk|safe\s+(?:to buy|purchase)/.test(refundLower);

  return (
    <>
      {renderScoreHero(sections, metrics)}
      {renderMetricsRow(sections, metrics, theme)}
      {refundSection && (
        <RefundBanner $required={refundRequired}>
          <RefundIconWrap $required={refundRequired}><Icon name={refundRequired ? "alert-triangle" : "info"} size={20} /></RefundIconWrap>
          <SectionContent>
            <RefundTitle $required={refundRequired}>Refund Guard</RefundTitle>
            <SectionMarkdown content={refundSection.content} />
          </SectionContent>
        </RefundBanner>
      )}
    </>
  );
}

export function ThemedStructuredResult({
  sections,
  isStreaming,
}: {
  sections: ParsedSection[];
  isStreaming: boolean;
}) {
  const theme = {
    colors: {
      success: "#22c55e",
      accent: "#7c8aff",
      warning: "#f59e0b",
      error: "#ef4444",
      text: "#e4e4f0",
      textSecondary: "#8888a8",
      textMuted: "#555570",
    },
  };

  return <StructuredResult sections={sections} isStreaming={isStreaming} theme={theme} />;
}
