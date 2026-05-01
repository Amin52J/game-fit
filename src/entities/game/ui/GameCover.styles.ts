"use client";

import styled, { css, keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export type CoverSize = "xs" | "sm" | "md" | "lg";

const sizeStyles = {
  xs: css`
    width: 36px;
    height: 54px;
  `,
  sm: css`
    width: 64px;
    height: 96px;

    @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
      width: 80px;
      height: 120px;
    }
  `,
  md: css`
    width: 88px;
    height: 132px;

    @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
      width: 120px;
      height: 180px;
    }
  `,
  lg: css`
    width: 100%;
    aspect-ratio: 2 / 3;
  `,
} as const;

export const CoverWrap = styled.div<{ $size: CoverSize }>`
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  ${({ $size }) => sizeStyles[$size]}
`;

export const CoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const CoverSkeleton = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceElevated} 0%,
    ${({ theme }) => theme.colors.surfaceHover} 50%,
    ${({ theme }) => theme.colors.surfaceElevated} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s ease-in-out infinite;
`;

export const CoverFallback = styled.div<{ $seed: number; $size: CoverSize }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.font.sans};
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: 0.04em;
  font-size: ${({ $size }) => {
    if ($size === "xs") return "0.95rem";
    if ($size === "sm") return "1.4rem";
    if ($size === "md") return "1.85rem";
    return "2.5rem";
  }};
  background: ${({ $seed }) => {
    const hue1 = $seed % 360;
    const hue2 = (hue1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${hue1} 55% 32%) 0%, hsl(${hue2} 50% 22%) 100%)`;
  }};
`;
