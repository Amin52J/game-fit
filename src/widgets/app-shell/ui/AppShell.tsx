"use client";

import { type ReactNode, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { useAuth } from "@/app/providers/AuthProvider";
import { useApp } from "@/app/providers/AppProvider";
import { AuthPage } from "@/features/auth";
import { LandingOrAuth } from "@/features/landing/ui/LandingPage";
import { Sidebar } from "@/widgets/sidebar";
import { KeepAlivePages } from "./KeepAlivePages";
import { AuthLoadingSkeleton, HydrationSkeleton } from "./AppShellSkeleton";
import { UpdateNotification } from "@/features/updater/ui/UpdateNotification";

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
  scrollbar-gutter: stable;
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 767px) {
    padding-top: ${({ $fullWidth, theme }) =>
      $fullWidth ? theme.spacing.lg : `calc(${theme.spacing.lg} + 52px)`};
  }
`;

const noopSubscribe = () => () => {};
const getTauri = () => "__TAURI__" in window;
const getTauriServer = () => null as boolean | null;

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user, loading: authLoading } = useAuth();
  const { state, hydrated } = useApp();
  const pathname = usePathname();
  const forceSetup = pathname === "/setup";
  const setupDone = state.isSetupComplete && !forceSetup;

  const isTauri = useSyncExternalStore(noopSubscribe, getTauri, getTauriServer);

  if (authLoading || isTauri === null) {
    return <AuthLoadingSkeleton />;
  }

  if (!user) {
    return isTauri ? <AuthPage /> : <LandingOrAuth />;
  }

  if (!hydrated) {
    return <HydrationSkeleton />;
  }

  return (
    <ShellRoot>
      {setupDone ? <Sidebar /> : null}
      <Main $fullWidth={!setupDone}>
        {setupDone ? <KeepAlivePages /> : children}
      </Main>
      <UpdateNotification />
    </ShellRoot>
  );
}
