"use client";

import React from "react";
import { Icon, FilterChip } from "@/shared/ui";
import type { ViewMode } from "../HistoryPage.utils";
import { SCORE_FILTERS, RISK_FILTERS } from "../HistoryPage.utils";
import {
  Toolbar,
  SearchRow,
  SearchInput,
  SearchWrap,
  ViewToggle,
  ViewBtn,
  FilterBar,
  FilterGroup,
  FilterLabel,
  ResultCount,
} from "../HistoryPage.styles";

export function HistoryToolbar({
  inputValue,
  setInputValue,
  viewMode,
  setViewMode,
  scoreFilters,
  riskFilters,
  eaFilter,
  setEaFilter,
  toggleScoreFilter,
  toggleRiskFilter,
  filteredCount,
  totalCount,
}: {
  inputValue: string;
  setInputValue: (v: string) => void;
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  scoreFilters: Set<string>;
  riskFilters: Set<string>;
  eaFilter: boolean;
  setEaFilter: (fn: (v: boolean) => boolean) => void;
  toggleScoreFilter: (key: string) => void;
  toggleRiskFilter: (key: string) => void;
  filteredCount: number;
  totalCount: number;
}) {
  return (
    <Toolbar>
      <SearchRow>
        <SearchWrap>
          <Icon name="search" size={16} />
          <SearchInput
            placeholder="Search game titles..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoComplete="off"
            data-1p-ignore
            data-lpignore="true"
            data-form-type="other"
            name="history-search"
          />
        </SearchWrap>
        <ViewToggle>
          <ViewBtn $active={viewMode === "detailed"} onClick={() => setViewMode("detailed")} title="Detailed view" aria-label="Detailed view">
            <Icon name="view-detail" size={16} />
          </ViewBtn>
          <ViewBtn $active={viewMode === "list"} onClick={() => setViewMode("list")} title="List view" aria-label="List view">
            <Icon name="view-list" size={16} />
          </ViewBtn>
        </ViewToggle>
      </SearchRow>

      <FilterBar>
        <FilterGroup>
          <FilterLabel>Score</FilterLabel>
          {SCORE_FILTERS.map((f) => (
            <FilterChip key={f.key} $active={scoreFilters.has(f.key)} onClick={() => toggleScoreFilter(f.key)}>
              {f.label}
            </FilterChip>
          ))}
        </FilterGroup>
        <FilterGroup>
          <FilterLabel>Risk</FilterLabel>
          {RISK_FILTERS.map((f) => (
            <FilterChip key={f.key} $active={riskFilters.has(f.key)} onClick={() => toggleRiskFilter(f.key)}>
              {f.label}
            </FilterChip>
          ))}
        </FilterGroup>
        <FilterChip $active={eaFilter} onClick={() => setEaFilter((v) => !v)}>
          Early Access
        </FilterChip>
        <ResultCount>
          {filteredCount === totalCount ? `${totalCount} analyses` : `${filteredCount} of ${totalCount}`}
        </ResultCount>
      </FilterBar>
    </Toolbar>
  );
}
