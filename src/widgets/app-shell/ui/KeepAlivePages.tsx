"use client";

import { useState } from "react";
import Link from "next/link";
import styled, { keyframes } from "styled-components";
import { useNavigation } from "@/app/providers/NavigationProvider";
import { AnalyzePage } from "@/features/analyze-game";
import { HistoryPage } from "@/features/analyze-game";
import { GameLibrary } from "@/features/manage-library";
import { SettingsPage } from "@/features/manage-settings";

const pageFadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const PageSlot = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? "block" : "none")};
  animation: ${pageFadeIn} 250ms ease;
`;

const NotFoundRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const NotFoundCode = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 6rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent} 0%,
    ${({ theme }) => theme.colors.textMuted} 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const NotFoundTitle = styled.h1`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const NotFoundDesc = styled.p`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  max-width: 380px;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const NotFoundLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: 10px 28px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius.md};
  text-decoration: none;
  transition:
    background ${({ theme }) => theme.transition.fast},
    transform ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-1px);
  }
`;

interface PageEntry {
  path: string;
  Component: React.ComponentType;
}

const PAGES: PageEntry[] = [
  { path: "/analyze", Component: AnalyzePage },
  { path: "/library", Component: GameLibrary },
  { path: "/history", Component: HistoryPage },
  { path: "/settings", Component: SettingsPage },
];

function matchRoute(pathname: string, route: string): boolean {
  if (route === "/analyze") return pathname === "/analyze" || pathname === "/";
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function KeepAlivePages() {
  const { activePath } = useNavigation();
  const anyMatch = PAGES.some((p) => matchRoute(activePath, p.path));

  const [mounted, setMounted] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    const match = PAGES.find((p) => matchRoute(activePath, p.path));
    if (match) initial.add(match.path);
    return initial;
  });

  const currentMatch = PAGES.find((p) => matchRoute(activePath, p.path));
  if (currentMatch && !mounted.has(currentMatch.path)) {
    setMounted((prev) => new Set([...prev, currentMatch.path]));
  }

  return (
    <>
      {PAGES.map(({ path, Component }) => {
        const active = matchRoute(activePath, path);
        if (!mounted.has(path) && !active) return null;
        return (
          <PageSlot key={path} $visible={active}>
            <Component />
          </PageSlot>
        );
      })}
      {!anyMatch && (
        <NotFoundRoot>
          <NotFoundCode>404</NotFoundCode>
          <NotFoundTitle>Page not found</NotFoundTitle>
          <NotFoundDesc>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </NotFoundDesc>
          <NotFoundLink href="/analyze">Go to Analyze</NotFoundLink>
        </NotFoundRoot>
      )}
    </>
  );
}
