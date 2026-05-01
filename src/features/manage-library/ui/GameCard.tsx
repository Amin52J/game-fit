"use client";

import React, { useState } from "react";
import type { Game } from "@/shared/types";
import { useGameCover } from "@/entities/game";
import {
  Card,
  CardCover,
  CardSkeleton,
  CardFallback,
  CardScoreBadge,
  CardTitle,
} from "./GameLibrary.styles";

function getInitials(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function GameCard({ game }: { game: Game }) {
  const { image, isLoading } = useGameCover(game.name);
  const [imgFailed, setImgFailed] = useState(false);

  const showSkeleton = isLoading;
  const showFallback = !isLoading && (!image || imgFailed);
  const showImage = !isLoading && !!image && !imgFailed;

  return (
    <Card>
      <CardCover>
        {showSkeleton && <CardSkeleton />}
        {showImage && image && (
          <img
            src={image}
            alt={game.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}
        {showFallback && (
          <CardFallback $seed={hashString(game.name)}>{getInitials(game.name)}</CardFallback>
        )}
        <CardScoreBadge $score={game.score} aria-label={`Score: ${game.score ?? "unscored"}`}>
          {game.score !== null ? game.score : "—"}
        </CardScoreBadge>
      </CardCover>
      <CardTitle title={game.name}>{game.name}</CardTitle>
    </Card>
  );
}
