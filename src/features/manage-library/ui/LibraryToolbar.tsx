"use client";

import React from "react";
import { Input, FilterChip } from "@/shared/ui";
import { SCORE_RANGES } from "./GameLibrary.utils";
import { Toolbar, ToolbarSearchWrap, FilterBar, FilterLabel } from "./GameLibrary.styles";

export function LibraryToolbar({
  inputValue,
  setSearch,
  activeRanges,
  toggleRange,
}: {
  inputValue: string;
  setSearch: (v: string) => void;
  activeRanges: Set<string>;
  toggleRange: (key: string) => void;
}) {
  return (
    <Toolbar>
      <ToolbarSearchWrap>
        <Input
          placeholder="Search games..."
          value={inputValue}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          name="library-search"
        />
      </ToolbarSearchWrap>
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
