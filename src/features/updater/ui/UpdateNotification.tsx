"use client";

import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const REPO = "Amin52J/game-fit";
const CURRENT_VERSION = "1.0.0";
const RELEASES_URL = `https://github.com/${REPO}/releases/latest`;
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;
const DISMISS_KEY = "gamefit_update_dismissed";

function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI__" in window;
}

function compareVersions(a: string, b: string): number {
  const pa = a.replace(/^v/, "").split(".").map(Number);
  const pb = b.replace(/^v/, "").split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na !== nb) return na - nb;
  }
  return 0;
}

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Banner = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 340px;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: rgba(26, 26, 48, 0.92);
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  animation: ${slideIn} 300ms ease;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
`;

const Body = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: 4px;
`;

const Btn = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ $primary, theme }) =>
      $primary ? theme.colors.accent : theme.colors.border};
  background: ${({ $primary, theme }) =>
    $primary ? theme.colors.accent : "transparent"};
  color: ${({ $primary, theme }) =>
    $primary ? "#fff" : theme.colors.textSecondary};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ $primary, theme }) =>
      $primary ? theme.colors.accentHover : theme.colors.surfaceHover};
  }

  &:active {
    transform: scale(0.97);
  }
`;

export function UpdateNotification() {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isTauri()) return;

    const prev = sessionStorage.getItem(DISMISS_KEY);
    if (prev) {
      setDismissed(true);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(API_URL, {
          headers: { Accept: "application/vnd.github.v3+json" },
        });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        const tag: string = data.tag_name ?? "";
        if (compareVersions(tag, CURRENT_VERSION) > 0) {
          setLatestVersion(tag.replace(/^v/, ""));
        }
      } catch {
        // non-critical — silently ignore
      }
    }, 3_000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  if (!latestVersion || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, latestVersion);
    setDismissed(true);
  };

  const handleDownload = () => {
    window.open(RELEASES_URL, "_blank");
  };

  return (
    <Banner>
      <Title>
        <Dot /> Update Available
      </Title>
      <Body>
        Version {latestVersion} is available. You are currently on{" "}
        {CURRENT_VERSION}.
      </Body>
      <Actions>
        <Btn onClick={handleDismiss}>Later</Btn>
        <Btn $primary onClick={handleDownload}>
          Download
        </Btn>
      </Actions>
    </Banner>
  );
}
