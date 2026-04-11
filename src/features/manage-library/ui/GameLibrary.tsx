"use client";
import React, { useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import { useApp } from "@/app/providers/AppProvider";
import { parseAnyFormat, gamesToCSV } from "@/entities/game/lib/csv-parser";
import { openSteamLoginPopup, fetchSteamGames, extractSteamIdFromParams } from "@/features/auth/lib/steam";
import { openEpicLoginTab, fetchEpicGames } from "@/features/auth/lib/epic";
import type { Game } from "@/shared/types";
import { useDropzone } from "react-dropzone";
import { Icon } from "@/shared/ui";

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-top: 4px;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const Btn = styled.button<{ $variant?: "primary" | "secondary" | "danger" }>`
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "primary"
        ? theme.colors.accent
        : $variant === "danger"
          ? theme.colors.error
          : theme.colors.border};
  background: ${({ theme, $variant }) =>
    $variant === "primary"
      ? theme.colors.accent
      : $variant === "danger"
        ? theme.colors.errorMuted
        : theme.colors.surface};
  color: ${({ theme, $variant }) =>
    $variant === "danger" ? theme.colors.error : theme.colors.text};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    opacity: 0.85;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.97);
  }
`;

const SearchBar = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  outline: none;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentMuted};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Stats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  flex: 1;
  min-width: 120px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
`;

const Table = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px 80px;
  padding: 12px 20px;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SortableCol = styled.button<{ $active: boolean }>`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.textSecondary)};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  user-select: none;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const SortArrow = styled.span<{ $dir: "asc" | "desc" | null }>`
  display: inline-flex;
  align-items: center;
  opacity: ${({ $dir }) => ($dir ? 1 : 0.3)};
`;

const FilterBar = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-right: 2px;
`;

const FilterChip = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.border)};
  background: ${({ theme, $active }) => ($active ? theme.colors.accentMuted : "transparent")};
  color: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.textSecondary)};

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.text};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0) scale(0.95);
  }
`;

const Row = styled.div<{ $editing?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 100px 80px;
  padding: 10px 20px;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background ${({ theme }) => theme.transition.fast};
  background: ${({ theme, $editing }) => ($editing ? theme.colors.accentMuted : "transparent")};

  &:hover {
    background: ${({ theme, $editing }) =>
      $editing ? theme.colors.accentMuted : theme.colors.surfaceHover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const GameName = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ScoreBadge = styled.span<{ $score: number | null }>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ theme, $score }) => {
    if ($score === null) return theme.colors.surfaceElevated;
    if ($score >= 80) return theme.colors.successMuted;
    if ($score >= 60) return theme.colors.warningMuted;
    return theme.colors.errorMuted;
  }};
  color: ${({ theme, $score }) => {
    if ($score === null) return theme.colors.textMuted;
    if ($score >= 80) return theme.colors.success;
    if ($score >= 60) return theme.colors.warning;
    return theme.colors.error;
  }};
`;

const InlineInput = styled.input`
  width: 60px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  text-align: center;
  outline: none;
`;

const RowActions = styled.div`
  display: flex;
  gap: 6px;
  justify-content: flex-end;
`;

const IconBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: 4px;
  font-size: 1rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition:
    color ${({ theme }) => theme.transition.fast},
    background ${({ theme }) => theme.transition.fast},
    transform ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  &:active {
    transform: scale(0.9);
  }
`;

const DropZone = styled.div<{ $active: boolean }>`
  border: 2px dashed
    ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.textSecondary)};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.normal};
  background: ${({ theme, $active }) => ($active ? theme.colors.accentMuted : "transparent")};
`;

const Empty = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ImportSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PlatformRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PlatformBtn = styled.button<{ $connected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ $connected, theme }) => ($connected ? theme.colors.success : theme.colors.border)};
  background: ${({ $connected, theme }) => ($connected ? "transparent" : theme.colors.surface)};
  color: ${({ $connected, theme }) => ($connected ? theme.colors.success : theme.colors.text)};
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.surfaceHover};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  img { flex-shrink: 0; }
`;

const PlatformGuide = styled.details`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};

  &[open] summary { margin-bottom: ${({ theme }) => theme.spacing.sm}; }
`;

const PlatformGuideSummary = styled.summary`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker { display: none; }
  &::marker { content: ""; }

  img { flex-shrink: 0; }
`;

const PlatformGuideBody = styled.div`
  padding: 0 14px 14px;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;

  ol { margin: 0; padding-left: 1.2rem; }
  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; &:hover { text-decoration: underline; } }
`;

const StatusText = styled.span`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorText = styled.span`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.error};
`;

const SectionLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PasteArea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  font-family: ${({ theme }) => theme.font.sans};
  resize: vertical;
  outline: none;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentMuted};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const PasteActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const CodeInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  font-family: ${({ theme }) => theme.font.sans};
  outline: none;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentMuted};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85rem;
`;

const PAGE_SIZE = 50;

type SortField = "name" | "score";
type SortDir = "asc" | "desc";

const SCORE_RANGES = [
  { key: "90-100", label: "90–100", min: 90, max: 100 },
  { key: "75-89", label: "75–89", min: 75, max: 89 },
  { key: "50-74", label: "50–74", min: 50, max: 74 },
  { key: "25-49", label: "25–49", min: 25, max: 49 },
  { key: "0-24", label: "0–24", min: 0, max: 24 },
  { key: "unscored", label: "Unscored", min: -1, max: -1 },
] as const;

function matchesRanges(score: number | null, activeRanges: Set<string>): boolean {
  if (activeRanges.size === 0) return true;
  if (score === null) return activeRanges.has("unscored");
  return SCORE_RANGES.some(
    (r) => r.key !== "unscored" && activeRanges.has(r.key) && score >= r.min && score <= r.max,
  );
}

export function GameLibrary() {
  const { state, setGames, updateGame, deleteGame } = useApp();

  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [activeRanges, setActiveRanges] = useState<Set<string>>(new Set());

  const setSearch = useCallback((q: string) => {
    setInputValue(q);
    setPage(0);
  }, []);

  const toggleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir(field === "score" ? "desc" : "asc");
      }
      setPage(0);
    },
    [sortField],
  );

  const toggleRange = useCallback((key: string) => {
    setActiveRanges((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setPage(0);
  }, []);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [steamLoading, setSteamLoading] = useState(false);
  const [steamCount, setSteamCount] = useState<number | null>(null);
  const [steamError, setSteamError] = useState<string | null>(null);
  const [epicStep, setEpicStep] = useState<"idle" | "waiting" | "loading">("idle");
  const [epicCode, setEpicCode] = useState("");
  const [epicCount, setEpicCount] = useState<number | null>(null);
  const [epicError, setEpicError] = useState<string | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [pasteError, setPasteError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = inputValue.toLowerCase();
    let result = state.games.filter(
      (g) => g.name.toLowerCase().includes(q) || g.sortingName?.toLowerCase().includes(q),
    );
    if (activeRanges.size > 0) {
      result = result.filter((g) => matchesRanges(g.score, activeRanges));
    }
    result.sort((a, b) => {
      if (sortField === "name") {
        const nameA = (a.sortingName || a.name).toLowerCase();
        const nameB = (b.sortingName || b.name).toLowerCase();
        const cmp = nameA.localeCompare(nameB);
        return sortDir === "asc" ? cmp : -cmp;
      }
      const sa = a.score ?? -1;
      const sb = b.score ?? -1;
      return sortDir === "asc" ? sa - sb : sb - sa;
    });
    return result;
  }, [state.games, inputValue, activeRanges, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages - 1);
  const pageGames = filtered.slice(clampedPage * PAGE_SIZE, (clampedPage + 1) * PAGE_SIZE);

  const scored = state.games.filter((g) => g.score !== null);
  const avgScore =
    scored.length > 0
      ? Math.round(scored.reduce((s, g) => s + (g.score || 0), 0) / scored.length)
      : 0;

  const startEdit = (game: Game) => {
    setEditingId(game.id);
    setEditScore(game.score !== null ? String(game.score) : "");
  };

  const saveEdit = (game: Game) => {
    const val = editScore.trim();
    const score = val === "" ? null : parseInt(val, 10);
    updateGame({ ...game, score: isNaN(score as number) ? null : score });
    setEditingId(null);
  };

  const handleImport = useCallback(
    (text: string) => {
      const parsed = parseAnyFormat(text);
      if (parsed.length > 0) {
        const existingIdx = new Map(state.games.map((g, i) => [g.name.trim().toLowerCase(), i]));
        const merged = [...state.games];
        for (const g of parsed) {
          const key = g.name.trim().toLowerCase();
          const idx = existingIdx.get(key);
          if (idx === undefined) {
            existingIdx.set(key, merged.length);
            merged.push(g);
          } else {
            merged[idx] = { ...g, id: merged[idx].id };
          }
        }
        setGames(merged);
        setShowImport(false);
      }
    },
    [state.games, setGames],
  );

  const handlePaste = useCallback(() => {
    setPasteError(null);
    if (!pasteText.trim()) return;
    try {
      handleImport(pasteText);
      setPasteText("");
    } catch {
      setPasteError("Could not parse pasted content.");
    }
  }, [pasteText, handleImport]);

  const handleExport = () => {
    const csv = gamesToCSV(state.games);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "GameLibrary.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSteamConnect = useCallback(async () => {
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

  const handleEpicLogin = () => {
    openEpicLoginTab();
    setEpicStep("waiting");
    setEpicError(null);
  };

  const handleEpicSubmitCode = useCallback(async () => {
    if (!epicCode.trim()) return;
    setEpicError(null);
    setEpicStep("loading");
    try {
      const games = await fetchEpicGames(epicCode.trim());
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
      setEpicCount(games.length);
      setEpicStep("idle");
      setEpicCode("");
    } catch (err) {
      setEpicError(err instanceof Error ? err.message : "Failed to import Epic games");
      setEpicStep("waiting");
    }
  }, [epicCode, state.games, setGames]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "text/*": [".csv", ".json", ".txt"], "application/json": [".json"] },
    multiple: true,
    onDrop: async (files) => {
      for (const file of files) {
        const text = await file.text();
        handleImport(text);
      }
    },
    noClick: false,
  });

  const handleClearLibrary = () => {
    if (confirm(`Remove all ${state.games.length} games from your library?`)) {
      setGames([]);
      setSteamCount(null);
      setEpicCount(null);
      setEpicStep("idle");
    }
  };

  return (
    <Page>
      <Header>
        <div>
          <Title>Game Library</Title>
          <Subtitle>{state.games.length} games in your library</Subtitle>
        </div>
        <Actions>
          <Btn $variant="secondary" onClick={() => setShowImport(!showImport)}>
            {showImport ? "Hide Import" : "Import Games"}
          </Btn>
          <Btn $variant="secondary" onClick={handleExport}>
            Export CSV
          </Btn>
          <Btn
            $variant="secondary"
            onClick={() => {
              const name = prompt("Game name:");
              if (name) {
                const scoreStr = prompt("Score (0-100, leave empty for none):");
                const score = scoreStr && !isNaN(parseInt(scoreStr)) ? parseInt(scoreStr) : null;
                const newGame: Game = {
                  id: Math.random().toString(36).slice(2, 11),
                  name,
                  score,
                };
                setGames([...state.games, newGame]);
              }
            }}
          >
            + Add Game
          </Btn>
          {state.games.length > 0 && (
            <Btn $variant="danger" onClick={handleClearLibrary}>
              Clear Library
            </Btn>
          )}
        </Actions>
      </Header>

      {showImport && (
        <ImportSection>
          <div>
            <SectionLabel>Connect platforms</SectionLabel>
            <PlatformRow style={{ marginTop: 8 }}>
              <PlatformBtn
                type="button"
                $connected={steamCount !== null}
                onClick={handleSteamConnect}
                disabled={steamLoading}
              >
                <img src="/steam-logo.svg" alt="" width="16" height="16" />
                {steamLoading ? "Connecting…" : steamCount !== null ? `Steam (${steamCount} imported)` : "Import from Steam"}
              </PlatformBtn>
            </PlatformRow>
            {steamError && <ErrorText>{steamError}</ErrorText>}
            {steamCount !== null && (
              <StatusText>
                Imported {steamCount} games from Steam. Existing library entries were preserved.
              </StatusText>
            )}
          </div>

          <div>
            <SectionLabel>Epic Games</SectionLabel>
            <div style={{ marginTop: 8 }}>
              {epicCount !== null ? (
                <StatusText>Imported {epicCount} games from Epic Games.</StatusText>
              ) : epicStep === "idle" ? (
                <PlatformRow>
                  <PlatformBtn type="button" onClick={handleEpicLogin}>
                    <img src="/epic-logo.svg" alt="" width="16" height="16" />
                    Connect Epic Games
                  </PlatformBtn>
                </PlatformRow>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <StatusText>
                    A new tab opened to Epic Games. Log in, then copy the authorization code shown on the page and paste it below.
                  </StatusText>
                  <div style={{ display: "flex", gap: 8 }}>
                    <CodeInput
                      placeholder="Paste authorization code…"
                      value={epicCode}
                      onChange={(e) => setEpicCode(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleEpicSubmitCode(); }}
                    />
                    <Btn
                      $variant="primary"
                      onClick={handleEpicSubmitCode}
                      disabled={epicStep === "loading" || !epicCode.trim()}
                    >
                      {epicStep === "loading" ? "Importing…" : "Import"}
                    </Btn>
                  </div>
                </div>
              )}
              {epicError && <ErrorText>{epicError}</ErrorText>}
            </div>
          </div>

          <div>
            <SectionLabel>File import</SectionLabel>
            <DropZone {...getRootProps()} $active={isDragActive} style={{ marginTop: 8, marginBottom: 0 }}>
              <input {...getInputProps()} />
              <p style={{ fontSize: "1.1rem", marginBottom: 8 }}>
                {isDragActive ? "Drop your file here..." : "Drag & drop CSV, JSON, or text files here"}
              </p>
              <p style={{ fontSize: "0.8rem" }}>
                or click to browse — multiple files supported, games merge with your existing library
              </p>
            </DropZone>
          </div>

          <div>
            <SectionLabel>Or paste data</SectionLabel>
            <PasteArea
              rows={5}
              placeholder="Paste CSV, JSON array, or one game per line…"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              style={{ marginTop: 8 }}
            />
            <PasteActions>
              <Btn $variant="secondary" onClick={handlePaste} disabled={!pasteText.trim()}>
                Parse pasted text
              </Btn>
            </PasteActions>
            {pasteError && <ErrorText>{pasteError}</ErrorText>}
          </div>
        </ImportSection>
      )}

      <Stats>
        <StatCard>
          <StatValue>{state.games.length}</StatValue>
          <StatLabel>Total games</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{scored.length}</StatValue>
          <StatLabel>Scored</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{avgScore}</StatValue>
          <StatLabel>Average score</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{state.games.filter((g) => (g.score || 0) >= 85).length}</StatValue>
          <StatLabel>Top rated (85+)</StatLabel>
        </StatCard>
      </Stats>

      <Toolbar>
        <SearchBar
          placeholder="Search games..."
          value={inputValue}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          name="library-search"
        />
        <FilterBar>
          <FilterLabel>Score:</FilterLabel>
          {SCORE_RANGES.map((r) => (
            <FilterChip
              key={r.key}
              $active={activeRanges.has(r.key)}
              onClick={() => toggleRange(r.key)}
            >
              {r.label}
            </FilterChip>
          ))}
        </FilterBar>
      </Toolbar>

      <Table>
        <TableHeader>
          <SortableCol $active={sortField === "name"} onClick={() => toggleSort("name")}>
            Game
            <SortArrow $dir={sortField === "name" ? sortDir : null}>
              <Icon name={sortField === "name" && sortDir === "asc" ? "chevron-up" : "chevron-down"} size={14} />
            </SortArrow>
          </SortableCol>
          <SortableCol $active={sortField === "score"} onClick={() => toggleSort("score")}>
            Score
            <SortArrow $dir={sortField === "score" ? sortDir : null}>
              <Icon name={sortField === "score" && sortDir === "asc" ? "chevron-up" : "chevron-down"} size={14} />
            </SortArrow>
          </SortableCol>
          <span style={{ textAlign: "right" }}>Actions</span>
        </TableHeader>
        {pageGames.length === 0 ? (
          <Empty>
            {state.games.length === 0
              ? "No games yet — import your library to get started"
              : "No games match your search"}
          </Empty>
        ) : (
          pageGames.map((game) => (
            <Row key={game.id} $editing={editingId === game.id}>
              <GameName>{game.name}</GameName>
              <div>
                {editingId === game.id ? (
                  <InlineInput
                    value={editScore}
                    onChange={(e) => setEditScore(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(game);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    autoFocus
                    placeholder="—"
                  />
                ) : (
                  <ScoreBadge $score={game.score}>
                    {game.score !== null ? game.score : "—"}
                  </ScoreBadge>
                )}
              </div>
              <RowActions>
                {editingId === game.id ? (
                  <>
                    <IconBtn onClick={() => saveEdit(game)} title="Save">
                      <Icon name="check" size={16} />
                    </IconBtn>
                    <IconBtn onClick={() => setEditingId(null)} title="Cancel">
                      <Icon name="x" size={16} />
                    </IconBtn>
                  </>
                ) : (
                  <>
                    <IconBtn onClick={() => startEdit(game)} title="Edit score">
                      <Icon name="edit" size={16} />
                    </IconBtn>
                    <IconBtn
                      onClick={() => {
                        if (confirm(`Remove "${game.name}"?`)) deleteGame(game.id);
                      }}
                      title="Delete"
                    >
                      <Icon name="trash" size={16} />
                    </IconBtn>
                  </>
                )}
              </RowActions>
            </Row>
          ))
        )}
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <Btn
            $variant="secondary"
            onClick={() => setPage(Math.max(0, clampedPage - 1))}
            disabled={clampedPage === 0}
          >
            <Icon name="chevron-left" size={14} /> Prev
          </Btn>
          <span>
            Page {clampedPage + 1} of {totalPages}
          </span>
          <Btn
            $variant="secondary"
            onClick={() => setPage(Math.min(totalPages - 1, clampedPage + 1))}
            disabled={clampedPage >= totalPages - 1}
          >
            Next <Icon name="chevron-right" size={14} />
          </Btn>
        </Pagination>
      )}
    </Page>
  );
}
