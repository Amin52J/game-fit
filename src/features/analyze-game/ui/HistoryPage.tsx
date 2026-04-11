"use client";

import React from "react";
import { Button, PageTitle, PageHeader, ButtonRow } from "@/shared/ui";
import { useHistoryPage } from "./HistoryPage.hooks";
import { HistoryToolbar } from "./history/HistoryToolbar";
import { DetailedCardView } from "./history/DetailedCardView";
import { ListTableView } from "./history/ListTableView";
import { Page, Sentinel, EmptyState } from "./HistoryPage.styles";

export function HistoryPage() {
  const h = useHistoryPage();

  if (h.totalCount === 0) {
    return (
      <Page>
        <PageHeader><PageTitle>Analysis history</PageTitle></PageHeader>
        <EmptyState>No analyses yet</EmptyState>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader>
        <PageTitle>Analysis history</PageTitle>
        <ButtonRow>
          <Button variant="danger" onClick={h.handleClearAll} onBlur={() => h.setConfirmClearAll(false)}>
            {h.confirmClearAll ? "Are you sure?" : "Clear all"}
          </Button>
        </ButtonRow>
      </PageHeader>

      <HistoryToolbar
        inputValue={h.inputValue}
        setInputValue={h.setInputValue}
        viewMode={h.viewMode}
        setViewMode={h.setViewMode}
        scoreFilters={h.scoreFilters}
        riskFilters={h.riskFilters}
        eaFilter={h.eaFilter}
        setEaFilter={h.setEaFilter}
        toggleScoreFilter={h.toggleScoreFilter}
        toggleRiskFilter={h.toggleRiskFilter}
        filteredCount={h.filtered.length}
        totalCount={h.totalCount}
      />

      {h.filtered.length === 0 ? (
        <EmptyState>No analyses match your search or filters</EmptyState>
      ) : h.viewMode === "detailed" ? (
        <>
          <DetailedCardView
            visible={h.visible}
            expandedId={h.expandedId}
            confirmDeleteId={h.confirmDeleteId}
            currency={h.currency}
            toggle={h.toggle}
            handleDelete={h.handleDelete}
            handleReanalyze={h.handleReanalyze}
            setConfirmDeleteId={h.setConfirmDeleteId}
          />
          {h.hasMore && <Sentinel ref={h.sentinelRef}>Loading more...</Sentinel>}
        </>
      ) : (
        <>
          <ListTableView
            visible={h.visible}
            expandedId={h.expandedId}
            confirmDeleteId={h.confirmDeleteId}
            currency={h.currency}
            toggle={h.toggle}
            handleListDelete={h.handleListDelete}
            handleReanalyze={h.handleReanalyze}
            setConfirmDeleteId={h.setConfirmDeleteId}
          />
          {h.hasMore && <Sentinel ref={h.sentinelRef}>Loading more...</Sentinel>}
        </>
      )}
    </Page>
  );
}
