"use client";

import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

export const Skeleton = styled.div<{
  $width?: string;
  $height?: string;
  $radius?: string;
}>`
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "20px"};
  border-radius: ${({ $radius, theme }) => $radius || theme.radius.md};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface} 0%,
    ${({ theme }) => theme.colors.surfaceElevated} 40%,
    ${({ theme }) => theme.colors.surface} 80%
  );
  background-size: 1200px 100%;
  animation: ${shimmer} 1.8s ease-in-out infinite;
`;

export const SkeletonCircle = styled(Skeleton)`
  border-radius: 50%;
  flex-shrink: 0;
`;

export const SkeletonText = styled(Skeleton)<{ $lines?: number }>`
  height: ${({ $lines }) => ($lines ? `${$lines * 1.4}em` : "1em")};
  border-radius: ${({ theme }) => theme.radius.sm};
`;
