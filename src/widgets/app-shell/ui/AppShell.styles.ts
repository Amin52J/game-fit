"use client";

import styled from "styled-components";

export const ShellRoot = styled.div`
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.bg};
  background-image:
    radial-gradient(
      ellipse 120% 80% at 50% -30%,
      ${({ theme }) => theme.colors.accentGlow} 0%,
      transparent 55%
    ),
    radial-gradient(
      ellipse 90% 60% at 100% 100%,
      ${({ theme }) => theme.colors.accentMuted} 0%,
      transparent 50%
    ),
    ${({ theme }) => theme.colors.bgGradient};
  color: ${({ theme }) => theme.colors.text};
`;

export const Main = styled.main<{ $fullWidth: boolean }>`
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  scrollbar-gutter: stable;
  padding: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ $fullWidth, theme }) =>
    $fullWidth ? theme.spacing.sm : `calc(${theme.spacing.sm} + 64px)`};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;
