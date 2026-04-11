"use client";

import React from "react";
import type { ParsedSection } from "@/features/analyze-game/lib/response-parser";
import type { extractMetrics } from "@/features/analyze-game/lib/response-parser";
import { computeTargetPrice } from "@/features/analyze-game/lib/response-parser";
import {
  MetricsRow,
  MetricCell,
  MetricLabel,
  MetricValue,
  SkeletonBar,
} from "../ResultCard.styles";
import {
  riskColor,
  confidenceColor,
  priceColor,
  formatCurrencyValue,
} from "../ResultCard.utils";

export function renderMetricsRow(
  sections: ParsedSection[],
  metrics: ReturnType<typeof extractMetrics>,
  theme: { colors: Record<string, string> },
  isStreaming: boolean,
  fullPrice?: number,
  currencyCode?: string,
) {
  const riskSection = sections.find((s) => s.key.includes("red-line-risk"));

  const computed = metrics.score !== null && fullPrice != null
    ? computeTargetPrice(metrics.score, metrics.riskLevel, metrics.confidence, fullPrice, metrics.refundRecommended)
    : null;
  const priceLabel = computed
    ? computed.value != null ? formatCurrencyValue(computed.value, currencyCode) : computed.label
    : metrics.targetPrice;

  const potentialComputed = metrics.earlyAccess && metrics.potentialScore !== null && fullPrice != null
    ? computeTargetPrice(metrics.potentialScore, metrics.riskLevel, metrics.confidence, fullPrice, metrics.refundRecommended)
    : null;
  const potentialPriceLabel = potentialComputed
    ? potentialComputed.value != null ? formatCurrencyValue(potentialComputed.value, currencyCode) : potentialComputed.label
    : null;

  const hasMetrics = priceLabel || riskSection || metrics.confidence;
  if (!hasMetrics && !isStreaming) return null;

  if (isStreaming) {
    return (
      <MetricsRow>
        <MetricCell>
          <MetricLabel>Target Price</MetricLabel>
          {priceLabel ? (
            <MetricValue $color={priceColor(priceLabel, theme)}>{priceLabel}</MetricValue>
          ) : (
            <SkeletonBar $width="60%" $height="1rem" />
          )}
        </MetricCell>
        {metrics.earlyAccess && (
          <MetricCell>
            <MetricLabel>At Release</MetricLabel>
            {potentialPriceLabel ? (
              <MetricValue $color={priceColor(potentialPriceLabel, theme)}>{potentialPriceLabel}</MetricValue>
            ) : (
              <SkeletonBar $width="60%" $height="1rem" />
            )}
          </MetricCell>
        )}
        <MetricCell>
          <MetricLabel>Red-Line Risk</MetricLabel>
          {riskSection ? (
            <MetricValue $color={riskColor(metrics.riskLevel, theme)}>
              {metrics.riskLevel === "unknown"
                ? "See below"
                : metrics.riskLevel.charAt(0).toUpperCase() + metrics.riskLevel.slice(1)}
            </MetricValue>
          ) : (
            <SkeletonBar $width="50%" $height="1rem" />
          )}
        </MetricCell>
        <MetricCell>
          <MetricLabel>Confidence</MetricLabel>
          {metrics.confidence ? (
            <MetricValue $color={confidenceColor(metrics.confidence, theme)}>
              {metrics.confidence}
            </MetricValue>
          ) : (
            <SkeletonBar $width="55%" $height="1rem" />
          )}
        </MetricCell>
      </MetricsRow>
    );
  }

  return (
    <MetricsRow>
      {priceLabel && (
        <MetricCell>
          <MetricLabel>Target Price</MetricLabel>
          <MetricValue $color={priceColor(priceLabel, theme)}>{priceLabel}</MetricValue>
        </MetricCell>
      )}
      {metrics.earlyAccess && potentialPriceLabel && (
        <MetricCell>
          <MetricLabel>At Release</MetricLabel>
          <MetricValue $color={priceColor(potentialPriceLabel, theme)}>{potentialPriceLabel}</MetricValue>
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
