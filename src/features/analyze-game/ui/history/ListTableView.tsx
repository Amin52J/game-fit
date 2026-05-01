"use client";

import React from "react";
import type { EnrichedResult } from "../HistoryPage.types";
import { formatPrice, formatDateShort } from "../HistoryPage.utils";
import { ExpandedContent } from "./ExpandedContent";
import {
  ListTable,
  ListHeader,
  ListItem,
  ListRow,
  ListExpandedSection,
  ListExpandedToolbar,
  MiniScore,
  ListRowActionsCell,
  ListGameName,
  ListMeta,
  RiskBadge,
  EarlyAccessTag,
  ListGameCell,
  ListGameTopRow,
  ListMobileMeta,
  ListDeleteBtn,
  ReanalyzeBtn,
} from "../HistoryPage.styles";

export function ListTableView({
  visible,
  expandedId,
  confirmDeleteId,
  currency,
  toggle,
  handleListDelete,
  handleReanalyze,
  setConfirmDeleteId,
}: {
  visible: EnrichedResult[];
  expandedId: string | null;
  confirmDeleteId: string | null;
  currency: string | undefined;
  toggle: (id: string) => void;
  handleListDelete: (id: string) => void;
  handleReanalyze: (e: React.MouseEvent, gameName: string, price: number) => void;
  setConfirmDeleteId: (id: string | null) => void;
}) {
  return (
    <ListTable>
      <ListHeader>
        <span>Score</span>
        <span>Game</span>
        <span>Price</span>
        <span>Date</span>
        <span>Risk</span>
        <span />
      </ListHeader>
      {visible.map(({ item, metrics }: EnrichedResult) => (
        <ListItem key={item.id}>
          <ListRow onClick={() => toggle(item.id)}>
            <div>
              <MiniScore $score={metrics.score}>
                {metrics.score !== null ? metrics.score : "—"}
              </MiniScore>
            </div>
            <ListGameCell>
              <ListGameTopRow>
                <ListGameName title={item.gameName}>{item.gameName}</ListGameName>
                {metrics.earlyAccess && <EarlyAccessTag>EA</EarlyAccessTag>}
              </ListGameTopRow>
              <ListMobileMeta>
                {formatPrice(item.price, currency)} · {formatDateShort(item.timestamp)}
                {metrics.riskLevel !== "unknown" && ` · ${metrics.riskLevel} risk`}
              </ListMobileMeta>
            </ListGameCell>
            <ListMeta>{formatPrice(item.price, currency)}</ListMeta>
            <ListMeta>{formatDateShort(item.timestamp)}</ListMeta>
            <div>
              <RiskBadge $level={metrics.riskLevel}>
                {metrics.riskLevel === "unknown" ? "—" : metrics.riskLevel}
              </RiskBadge>
            </div>
            <ListRowActionsCell>
              <ListDeleteBtn
                type="button"
                $confirm={confirmDeleteId === item.id}
                onClick={(e) => { e.stopPropagation(); handleListDelete(item.id); }}
                onBlur={() => setConfirmDeleteId(null)}
                aria-label={`Delete analysis for ${item.gameName}`}
              >
                {confirmDeleteId === item.id ? "Sure?" : "Delete"}
              </ListDeleteBtn>
            </ListRowActionsCell>
          </ListRow>
          {expandedId === item.id && (
            <ListExpandedSection>
              <ListExpandedToolbar>
                <ReanalyzeBtn type="button" onClick={(e) => handleReanalyze(e, item.gameName, item.price)} aria-label={`Analyze ${item.gameName} again`}>
                  Analyze Again
                </ReanalyzeBtn>
              </ListExpandedToolbar>
              <ExpandedContent response={item.response} gameName={item.gameName} fullPrice={item.price} currencyCode={currency} />
            </ListExpandedSection>
          )}
        </ListItem>
      ))}
    </ListTable>
  );
}
