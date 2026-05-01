"use client";

import { usePathname } from "next/navigation";
import { useState, useMemo, useCallback, useEffect } from "react";
import type { Game } from "@/shared/types";
import { parseAnyFormat, gamesToCSV } from "@/entities/game/lib/csv-parser";
import { useApp } from "@/app/providers/AppProvider";
import type { SortField, SortDir, ViewMode } from "./GameLibrary.types";
import { SCORE_RANGES, PAGE_SIZE } from "./GameLibrary.utils";

function readInitialViewMode(): ViewMode {
  if (typeof window === "undefined") return "list";
  const params = new URLSearchParams(window.location.search);
  return params.get("view") === "grid" ? "grid" : "list";
}

function matchesRanges(score: number | null, activeRanges: Set<string>): boolean {
  if (activeRanges.size === 0) return true;
  if (score === null) return activeRanges.has("unscored");
  return SCORE_RANGES.some(
    (r) => r.key !== "unscored" && activeRanges.has(r.key) && score >= r.min && score <= r.max,
  );
}

export function useGameLibrary() {
  const { state, setGames, updateGame, deleteGame } = useApp();
  const pathname = usePathname();
  const isActive = pathname === "/library" || pathname?.startsWith("/library/");

  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [activeRanges, setActiveRanges] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>(readInitialViewMode);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState("");
  const [editName, setEditName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState("");
  const [addScore, setAddScore] = useState("");

  const setSearch = useCallback((q: string) => {
    setInputValue(q);
    setPage(0);
  }, []);

  useEffect(() => {
    if (!isActive || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (viewMode === "grid") params.set("view", "grid");
    else params.delete("view");
    const qs = params.toString();
    window.history.replaceState(null, "", `/library${qs ? `?${qs}` : ""}`);
  }, [isActive, viewMode]);

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

  const filtered = useMemo(() => {
    const q = inputValue.toLowerCase();
    let result = state.games.filter(
      (g) => g.name.toLowerCase().includes(q) || g.sortingName?.toLowerCase().includes(q),
    );
    if (activeRanges.size > 0) {
      result = result.filter((g) => matchesRanges(g.score, activeRanges));
    }
    result.sort((a, b) => {
      const nameA = (a.sortingName || a.name).toLowerCase();
      const nameB = (b.sortingName || b.name).toLowerCase();
      if (sortField === "name") {
        const cmp = nameA.localeCompare(nameB);
        return sortDir === "asc" ? cmp : -cmp;
      }
      const sa = a.score ?? -1;
      const sb = b.score ?? -1;
      const scoreCmp = sortDir === "asc" ? sa - sb : sb - sa;
      if (scoreCmp !== 0) return scoreCmp;
      return nameA.localeCompare(nameB);
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
    setEditName(game.name);
    setEditScore(game.score !== null ? String(game.score) : "");
  };

  const saveEdit = (game: Game) => {
    const val = editScore.trim();
    const parsed = val === "" ? null : parseInt(val, 10);
    const score = parsed === null || isNaN(parsed) ? null : Math.max(0, Math.min(100, parsed));
    const name = editName.trim() || game.name;
    updateGame({ ...game, name, score });
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
      }
    },
    [state.games, setGames],
  );

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

  const handleClearLibrary = () => {
    if (confirmClear) {
      setGames([]);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  };

  const handleDeleteGame = (id: string) => {
    if (confirmDeleteId === id) {
      deleteGame(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  const handleAddGame = () => {
    if (!addName.trim()) return;
    const raw = parseInt(addScore);
    const score = addScore.trim() && !isNaN(raw) ? Math.max(0, Math.min(100, raw)) : null;
    setGames([
      ...state.games,
      { id: Math.random().toString(36).slice(2, 11), name: addName.trim(), score },
    ]);
    setShowAddModal(false);
  };

  return {
    games: state.games,
    inputValue,
    setSearch,
    page,
    setPage,
    sortField,
    sortDir,
    toggleSort,
    activeRanges,
    toggleRange,
    viewMode,
    setViewMode,
    filtered,
    totalPages,
    clampedPage,
    pageGames,
    scored,
    avgScore,
    editingId,
    setEditingId,
    editScore,
    setEditScore,
    editName,
    setEditName,
    confirmDeleteId,
    setConfirmDeleteId,
    confirmClear,
    setConfirmClear,
    showAddModal,
    setShowAddModal,
    addName,
    setAddName,
    addScore,
    setAddScore,
    startEdit,
    saveEdit,
    handleImport,
    handleExport,
    handleClearLibrary,
    handleDeleteGame,
    handleAddGame,
    updateGame,
    setGames,
  };
}
