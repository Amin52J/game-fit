"use client";

import React from "react";
import { HistoryPreview } from "../ResultCard";
import type { EnrichedResult } from "../HistoryPage.types";
import { formatPrice, formatDate } from "../HistoryPage.utils";
import { ExpandedContent } from "./ExpandedContent";
import {
  List,
  HistoryCard,
  CardMain,
  CardHeader,
  CardTitleBlock,
  CardTitle,
  CardMeta,
  DeleteBtn,
  CardActions,
  ReanalyzeBtn,
  PreviewContent,
  PreviewBody,
  ExpandHint,
  ExpandedSection,
  InlineMiniScore,
  EarlyAccessTag,
} from "../HistoryPage.styles";

export function DetailedCardView({
  visible,
  expandedId,
  confirmDeleteId,
  currency,
  toggle,
  handleDelete,
  handleReanalyze,
  setConfirmDeleteId,
}: {
  visible: EnrichedResult[];
  expandedId: string | null;
  confirmDeleteId: string | null;
  currency: string | undefined;
  toggle: (id: string) => void;
  handleDelete: (e: React.MouseEvent, id: string) => void;
  handleReanalyze: (e: React.MouseEvent, gameName: string, price: number) => void;
  setConfirmDeleteId: (id: string | null) => void;
}) {
  return (
    <List>
      {visible.map(({ item, metrics }: EnrichedResult) => {
        const expanded = expandedId === item.id;
        return (
          <HistoryCard key={item.id} $expanded={expanded}>
            <CardHeader>
              <CardMain type="button" onClick={() => toggle(item.id)} aria-expanded={expanded}>
                <CardTitleBlock>
                  <CardTitle>
                    {item.gameName}
                    {metrics.earlyAccess && <EarlyAccessTag>Early Access</EarlyAccessTag>}
                  </CardTitle>
                  <CardMeta>
                    {metrics.score !== null && (
                      <InlineMiniScore as="span" $score={metrics.score}>
                        {metrics.score}
                      </InlineMiniScore>
                    )}
                    {formatPrice(item.price, currency)} · {formatDate(item.timestamp)}
                  </CardMeta>
                </CardTitleBlock>
              </CardMain>
              <CardActions>
                <ReanalyzeBtn type="button" onClick={(e) => handleReanalyze(e, item.gameName, item.price)} aria-label={`Analyze ${item.gameName} again`}>
                  Analyze Again
                </ReanalyzeBtn>
                <DeleteBtn type="button" onClick={(e) => handleDelete(e, item.id)} onBlur={() => setConfirmDeleteId(null)} aria-label={`Delete analysis for ${item.gameName}`}>
                  {confirmDeleteId === item.id ? "Sure?" : "Delete"}
                </DeleteBtn>
              </CardActions>
            </CardHeader>

            {!expanded ? (
              <CardMain type="button" onClick={() => toggle(item.id)}>
                <PreviewContent>
                  <HistoryPreview response={item.response} gameName={item.gameName} fullPrice={item.price} currencyCode={currency} />
                </PreviewContent>
                <PreviewBody>
                  <ExpandHint>Click to view full analysis</ExpandHint>
                </PreviewBody>
              </CardMain>
            ) : (
              <ExpandedSection>
                <ExpandedContent response={item.response} gameName={item.gameName} fullPrice={item.price} currencyCode={currency} />
              </ExpandedSection>
            )}
          </HistoryCard>
        );
      })}
    </List>
  );
}
