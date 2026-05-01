"use client";

import React from "react";
import { Input, FilterChip, Icon } from "@/shared/ui";
import {
  Toolbar,
  ToolbarSearchRow,
  ToolbarSearchWrap,
  ViewToggle,
  ViewBtn,
  FilterBar,
  FilterLabel,
} from "./GameLibrary.styles";
import type { ViewMode } from "./GameLibrary.types";
import { SCORE_RANGES } from "./GameLibrary.utils";

export function LibraryToolbar({
  inputValue,
  setSearch,
  activeRanges,
  toggleRange,
  viewMode,
  setViewMode,
}: {
  inputValue: string;
  setSearch: (v: string) => void;
  activeRanges: Set<string>;
  toggleRange: (key: string) => void;
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
}) {
  return (
    <Toolbar>
      <ToolbarSearchRow>
        <ToolbarSearchWrap>
          <Input
            placeholder="Search your library..."
            value={inputValue}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            data-1p-ignore
            data-lpignore="true"
            data-form-type="other"
            data-bwignore
            name="library-search"
            id="library-search"
            type="search"
          />
        </ToolbarSearchWrap>
        <ViewToggle role="group" aria-label="View mode">
          <ViewBtn
            type="button"
            $active={viewMode === "list"}
            onClick={() => setViewMode("list")}
            title="List view"
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            <Icon name="view-list" size={16} />
          </ViewBtn>
          <ViewBtn
            type="button"
            $active={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
            title="Grid view"
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <Icon name="view-grid" size={16} />
          </ViewBtn>
        </ViewToggle>
      </ToolbarSearchRow>
      <FilterBar>
        <FilterLabel>Score:</FilterLabel>
        {SCORE_RANGES.map((r) => (
          <FilterChip
            key={r.key}
            $active={activeRanges.has(r.key)}
            onClick={() => toggleRange(r.key)}
          >
            {r.label}
          </FilterChip>
        ))}
      </FilterBar>
    </Toolbar>
  );
}
