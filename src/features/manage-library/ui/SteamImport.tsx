"use client";

import React, { useState, useCallback } from "react";
import { useApp } from "@/app/providers/AppProvider";
import { openSteamLoginPopup, fetchSteamGames, extractSteamIdFromParams } from "@/features/auth/lib/steam";
import type { Game } from "@/shared/types";
import {
  ImportBlock,
  PlatformRow,
  PlatformBtn,
  SectionLabel,
  StatusText,
  ErrorText,
} from "./GameLibrary.styles";

export function SteamImport() {
  const { state, setGames } = useApp();
  const [loading, setSteamLoading] = useState(false);
  const [count, setSteamCount] = useState<number | null>(null);
  const [error, setSteamError] = useState<string | null>(null);

  const handleConnect = useCallback(async () => {
    setSteamError(null);
    setSteamLoading(true);
    try {
      const params = await openSteamLoginPopup();
      const steamId = extractSteamIdFromParams(params);
      if (!steamId) throw new Error("Could not extract Steam ID");

      const games = await fetchSteamGames(steamId);
      const mapped: Game[] = games.map((g) => ({
        id: Math.random().toString(36).slice(2, 11),
        name: g.name,
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
      setSteamCount(games.length);
    } catch (err) {
      setSteamError(err instanceof Error ? err.message : "Failed to connect to Steam");
    }
    setSteamLoading(false);
  }, [state.games, setGames]);

  return (
    <div>
      <SectionLabel>Connect platforms</SectionLabel>
      <ImportBlock>
        <PlatformRow>
          <PlatformBtn
            type="button"
            $connected={count !== null}
            onClick={handleConnect}
            disabled={loading}
          >
            <img src="/steam-logo.svg" alt="" width="16" height="16" />
            {loading ? "Connecting…" : count !== null ? `Steam (${count} imported)` : "Import from Steam"}
          </PlatformBtn>
        </PlatformRow>
      </ImportBlock>
      {error && <ErrorText>{error}</ErrorText>}
      {count !== null && (
        <StatusText>
          Imported {count} games from Steam. Existing library entries were preserved.
        </StatusText>
      )}
    </div>
  );
}
