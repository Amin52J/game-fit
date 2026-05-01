"use client";

import React from "react";
import type { Game } from "@/shared/types";
import { GameCard } from "./GameCard";
import { Grid, Empty } from "./GameLibrary.styles";

export function GameGrid({
  gridRef,
  pageGames,
  totalGames,
}: {
  gridRef: React.RefObject<HTMLDivElement | null>;
  pageGames: Game[];
  totalGames: number;
}) {
  if (pageGames.length === 0) {
    return (
      <Empty>
        {totalGames === 0
          ? "No games yet — import your library to get started"
          : "No games match your search"}
      </Empty>
    );
  }

  return (
    <Grid ref={gridRef}>
      {pageGames.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </Grid>
  );
}
