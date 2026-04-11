"use client";

import React from "react";
import { Icon } from "@/shared/ui";
import type { ParsedSection } from "@/features/analyze-game/lib/response-parser";
import type { extractMetrics } from "@/features/analyze-game/lib/response-parser";
import { getSectionType, isInternalSection } from "@/features/analyze-game/lib/response-parser";
import { SectionMarkdown } from "./SectionMarkdown";
import {
  StreamRow,
  StreamCursor,
  SectionCard,
  SectionHeading,
  SectionContent,
  RefundBanner,
  RefundIconWrap,
  RefundTitle,
} from "../ResultCard.styles";
import type { SectionAccent } from "../ResultCard.styles";
import { riskAccent, riskColor, displaySortKey } from "../ResultCard.utils";

export { displaySortKey, isInternalSection };

export function renderSection(
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
