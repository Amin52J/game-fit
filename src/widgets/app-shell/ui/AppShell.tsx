"use client";

import type { ReactNode } from "react";
import styled from "styled-components";
import { useApp } from "@/app/providers/AppProvider";
import { Sidebar } from "@/widgets/sidebar";

const ShellRoot = styled.div`
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

const Main = styled.main<{ $fullWidth: boolean }>`
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 767px) {
    padding-top: ${({ $fullWidth, theme }) =>
      $fullWidth ? theme.spacing.lg : `calc(${theme.spacing.lg} + 52px)`};
  }
`;

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { state, hydrated } = useApp();
  const setupDone = state.isSetupComplete;

  if (!hydrated) {
    return <ShellRoot />;
  }

  return (
    <ShellRoot>
      {setupDone ? <Sidebar /> : null}
      <Main $fullWidth={!setupDone}>{children}</Main>
    </ShellRoot>
  );
}
