"use client";

import React, { useState, useCallback } from "react";
import { useApp } from "@/app/providers/AppProvider";
import { openEpicLoginTab, fetchEpicGames } from "@/features/auth/lib/epic";
import type { Game } from "@/shared/types";
import { Button, Input } from "@/shared/ui";
import {
  ImportBlock,
  PlatformRow,
  PlatformBtn,
  SectionLabel,
  StatusText,
  ErrorText,
  EpicAuthStack,
  EpicCodeRow,
  EpicInputWrap,
} from "./GameLibrary.styles";

export function EpicImport() {
  const { state, setGames } = useApp();
  const [step, setStep] = useState<"idle" | "waiting" | "loading">("idle");
  const [code, setCode] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    openEpicLoginTab();
    setStep("waiting");
    setError(null);
  };

  const handleSubmitCode = useCallback(async () => {
    if (!code.trim()) return;
    setError(null);
    setStep("loading");
    try {
      const games = await fetchEpicGames(code.trim());
      const mapped: Game[] = games.map((name) => ({
        id: Math.random().toString(36).slice(2, 11),
        name,
        score: null,
      }));
      const existing = new Map(state.games.map((g) => [g.name.trim().toLowerCase(), g]));
      const merged = [...state.games];
      for (const g of mapped) {
        if (!existing.has(g.name.trim().toLowerCase())) {
          merged.push(g);
          existing.set(g.name.trim().toLowerCase(), g);
        }
      }
      setGames(merged);
      setCount(games.length);
      setStep("idle");
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import Epic games");
      setStep("waiting");
    }
  }, [code, state.games, setGames]);

  return (
    <div>
      <SectionLabel>Epic Games</SectionLabel>
      <ImportBlock>
        {count !== null ? (
          <StatusText>Imported {count} games from Epic Games.</StatusText>
        ) : step === "idle" ? (
          <PlatformRow>
            <PlatformBtn type="button" onClick={handleLogin}>
              <img src="/epic-logo.svg" alt="" width="16" height="16" />
              Connect Epic Games
            </PlatformBtn>
          </PlatformRow>
        ) : (
          <EpicAuthStack>
            <StatusText>
              A new tab opened to Epic Games. Log in, then copy the authorization code shown on the page and paste it below.
            </StatusText>
            <EpicCodeRow>
              <EpicInputWrap>
                <Input
                  placeholder="Paste authorization code…"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmitCode(); }}
                />
              </EpicInputWrap>
              <Button
                variant="primary"
                onClick={handleSubmitCode}
                disabled={step === "loading" || !code.trim()}
              >
                {step === "loading" ? "Importing…" : "Import"}
              </Button>
            </EpicCodeRow>
          </EpicAuthStack>
        )}
        {error && <ErrorText>{error}</ErrorText>}
      </ImportBlock>
    </div>
  );
}
