"use client";

import React from "react";
import type { Game } from "@/shared/types";
import { Stats, StatCard, StatValue, StatLabel } from "./GameLibrary.styles";

export function LibraryStats({ games, scored }: { games: Game[]; scored: Game[] }) {
  const unscoredCount = games.length - scored.length;
  return (
    <Stats>
      <StatCard>
        <StatValue>{games.length}</StatValue>
        <StatLabel>Total games</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>{scored.length}</StatValue>
        <StatLabel>Scored</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>{unscoredCount}</StatValue>
        <StatLabel>Unscored</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>{games.filter((g) => (g.score || 0) >= 76).length}</StatValue>
        <StatLabel>Top rated (76+)</StatLabel>
      </StatCard>
    </Stats>
  );
}
