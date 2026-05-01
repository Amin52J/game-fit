"use client";

import React, { useState } from "react";
import { useGameCover } from "../lib/useGameCover";
import {
  CoverWrap,
  CoverImg,
  CoverSkeleton,
  CoverFallback,
  type CoverSize,
} from "./GameCover.styles";

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

export interface GameCoverProps {
  name: string;
  size?: CoverSize;
  className?: string;
  children?: React.ReactNode;
}

export function GameCover({ name, size = "md", className, children }: GameCoverProps) {
  const { image, isLoading } = useGameCover(name);
  const [imgFailed, setImgFailed] = useState(false);

  const showSkeleton = isLoading;
  const showFallback = !isLoading && (!image || imgFailed);
  const showImage = !isLoading && !!image && !imgFailed;

  return (
    <CoverWrap $size={size} className={className}>
      {showSkeleton && <CoverSkeleton />}
      {showImage && image && (
        <CoverImg
          src={image}
          alt={name}
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      )}
      {showFallback && (
        <CoverFallback $seed={hashString(name)} $size={size}>
          {getInitials(name)}
        </CoverFallback>
      )}
      {children}
    </CoverWrap>
  );
}

export type { CoverSize } from "./GameCover.styles";
