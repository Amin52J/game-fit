"use client";

import styled, { css, keyframes } from "styled-components";

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
`;

export const pulse = keyframes`
  0%, 100% { opacity: 0.12; }
  50%      { opacity: 0.25; }
`;

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

  @media (max-width: 767px) {
    font-size: 0.8125rem;
    line-height: 1.55;

    h1 { font-size: 1.1rem; }
    h2 { font-size: 1rem; }
    h3 { font-size: 0.9375rem; }

    ul, ol { padding-left: 1.1rem; }

    pre {
      padding: ${({ theme }) => theme.spacing.sm};
      code { font-size: 0.75rem; }
    }
  }

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

export const StreamRow = styled.span`
  display: inline-flex;
  align-items: center;
  vertical-align: baseline;
`;

export const StreamCursor = styled.span`
  display: inline-block;
  width: 0.55em;
  height: 1.1em;
  margin-left: 2px;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 2px;
  animation: ${blink} 1s step-end infinite;
  vertical-align: text-bottom;
`;

export const ThinkingLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Card = styled.article`
  margin-top: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  overflow: hidden;
  animation: ${fadeUp} ${({ theme }) => theme.transition.normal};

  @media (max-width: 767px) {
    margin-top: ${({ theme }) => theme.spacing.md};
    border-radius: 0;
    border-left: none;
    border-right: none;
    box-shadow: none;
  }
`;

export const Header = styled.header`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 767px) {
    padding: 8px 12px;
  }
`;

export const GameTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.3;

  @media (max-width: 767px) {
    font-size: 1rem;
  }
`;

export const GameMeta = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const EarlyAccessBadge = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: ${({ theme }) => theme.spacing.sm};
  padding: 2px ${({ theme }) => theme.spacing.sm};
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.warning};
  background: ${({ theme }) => theme.colors.warningMuted};
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.radius.sm};
  vertical-align: middle;
`;

export const ScoreHero = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: 12px;
  }
`;

export const ScoreRing = styled.div<{ $score: number }>`
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

  @media (max-width: 767px) {
    width: 56px;
    height: 56px;
    font-size: 1.2rem;
    border-width: 3px;
  }
`;

export const ScoreRingWrap = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const ScoreRingTag = styled.span`
  font-size: 0.5625rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.warning};
`;

export const ScoreDetails = styled.div`
  flex: 1;
  min-width: 0;

  @media (max-width: 767px) {
    width: 100%;
  }
`;

export const ScoreLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const ScoreSummaryText = styled.div`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 767px) {
    font-size: 0.8125rem;
    line-height: 1.4;
  }
`;

export const CurrentScoreNote = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

export const MetricsRow = styled.div`
  display: flex;
  gap: 1px;
  background: ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 767px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

export const MetricCell = styled.div<{ $accent?: string }>`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  @media (max-width: 767px) {
    padding: 8px 10px;

    &:last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }
  }
`;

export const MetricLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const MetricValue = styled.div<{ $color?: string }>`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ $color, theme }) => $color || theme.colors.text};
  word-break: break-word;
`;

export const SkeletonBar = styled.div<{ $width?: string; $height?: string }>`
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "0.875rem"};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.textMuted};
  animation: ${pulse} 1.8s ease-in-out infinite;
`;

export const SkeletonBarSpaced = styled(SkeletonBar)`
  margin-top: 6px;
`;

export const SkeletonRing = styled.div`
  flex-shrink: 0;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 4px solid ${({ theme }) => theme.colors.border};
  animation: ${pulse} 1.8s ease-in-out infinite;

  @media (max-width: 767px) {
    width: 56px;
    height: 56px;
    border-width: 3px;
  }
`;

export type SectionAccent = "default" | "positive" | "negative" | "warning" | "risk-none" | "risk-medium" | "risk-high";

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

export const SectionCard = styled.div<{ $accent: SectionAccent }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  ${({ $accent }) => accentBorder($accent)};

  @media (max-width: 767px) {
    padding: 10px 12px;
  }
`;

export const SectionHeading = styled.h3<{ $color?: string }>`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ $color, theme }) => $color || theme.colors.textSecondary};
`;

export const SectionContent = styled.div`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.9375rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 767px) {
    font-size: 0.8125rem;
    line-height: 1.55;
  }
`;

export const RefundBanner = styled.div<{ $required: boolean }>`
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

  @media (max-width: 767px) {
    padding: 12px;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const RefundIconWrap = styled.span<{ $required: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-top: 2px;
  color: ${({ theme, $required }) => $required ? theme.colors.warning : theme.colors.accent};
`;

export const RefundTitle = styled.div<{ $required: boolean }>`
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme, $required }) => $required ? theme.colors.warning : theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const FallbackBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 767px) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

export const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const PreviewLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const PreviewValue = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const PreviewScoreCircle = styled.div<{ $score: number }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ $score, theme }) =>
    $score >= 80
      ? theme.colors.success
      : $score >= 60
        ? theme.colors.accent
        : $score >= 40
          ? theme.colors.warning
          : theme.colors.error};
`;

export const ResultWrapper = styled.div``;

export const PreviewWrap = styled.div`
  ${ScoreSummaryText} {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const RefundStrip = styled.div<{ $required: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${({ theme }) => `${theme.spacing.md}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.8125rem;
  color: ${({ theme, $required }) =>
    $required ? theme.colors.warning : theme.colors.accent};

  svg { flex-shrink: 0; }

  @media (max-width: 767px) {
    padding: ${({ theme }) => `${theme.spacing.sm}`};
    font-size: 0.75rem;
    gap: 4px;
  }
`;
