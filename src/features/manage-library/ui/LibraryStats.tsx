"use client";

import React from "react";
import type { Game } from "@/shared/types";
import { Stats, StatCard, StatValue, StatLabel } from "./GameLibrary.styles";

export function LibraryStats({ games, scored, avgScore }: { games: Game[]; scored: Game[]; avgScore: number }) {
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
        <StatValue>{avgScore}</StatValue>
        <StatLabel>Average score</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>{games.filter((g) => (g.score || 0) >= 85).length}</StatValue>
        <StatLabel>Top rated (85+)</StatLabel>
      </StatCard>
    </Stats>
  );
}
