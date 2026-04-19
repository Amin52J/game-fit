"use client";

import styled from "styled-components";

export const ShellRoot = styled.div`
  display: flex;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
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
  padding-top: 0;
  padding-bottom: ${({ $fullWidth }) =>
    $fullWidth ? "0" : "calc(88px + env(safe-area-inset-bottom, 0px))"};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    scrollbar-gutter: stable;
    padding-bottom: 0;
  }
`;
