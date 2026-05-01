"use client";

import React from "react";
import type { Game } from "@/shared/types";
import { GameCover } from "@/entities/game";
import { Card, CardScoreBadge, CardTitle } from "./GameLibrary.styles";

export function GameCard({ game }: { game: Game }) {
  return (
    <Card>
      <GameCover name={game.name} size="lg">
        <CardScoreBadge $score={game.score} aria-label={`Score: ${game.score ?? "unscored"}`}>
          {game.score !== null ? game.score : "—"}
        </CardScoreBadge>
      </GameCover>
      <CardTitle title={game.name}>{game.name}</CardTitle>
    </Card>
  );
}
