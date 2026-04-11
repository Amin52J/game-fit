import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/app/providers/AppProvider";
import { useNavigation } from "@/app/providers/NavigationProvider";
import { parseResponseSections, extractMetrics } from "@/features/analyze-game/lib/response-parser";
import { sessionCache } from "@/features/analyze-game/model/session-cache";
import { PAGE_SIZE, SCORE_FILTERS, RISK_FILTERS, readInitialParams, matchesScoreFilter, matchesRiskFilter } from "./HistoryPage.utils";
import type { ViewMode } from "./HistoryPage.utils";
import type { EnrichedResult } from "./HistoryPage.types";

export function useHistoryPage() {
  const { state, deleteAnalysis, clearHistory } = useApp();
  const { setIntent } = useNavigation();
  const pathname = usePathname();
  const isActive = pathname === "/history" || pathname.startsWith("/history/");

  const initial = useMemo(() => readInitialParams(), []);

  const [inputValue, setInputValue] = useState(initial.q);
  const [debouncedSearch, setDebouncedSearch] = useState(initial.q);
  const [scoreFilters, setScoreFilters] = useState<Set<string>>(initial.score);
  const [riskFilters, setRiskFilters] = useState<Set<string>>(initial.risk);
  const [eaFilter, setEaFilter] = useState(initial.ea);
  const [viewMode, setViewMode] = useState<ViewMode>(initial.view);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(inputValue), 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const scoreKey = useMemo(() => [...scoreFilters].sort().join(","), [scoreFilters]);
  const riskKey = useMemo(() => [...riskFilters].sort().join(","), [riskFilters]);

  const filterKey = `${debouncedSearch}\0${scoreKey}\0${riskKey}\0${eaFilter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

  useEffect(() => {
    if (!isActive) return;
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (scoreKey) params.set("score", scoreKey);
    if (riskKey) params.set("risk", riskKey);
    if (eaFilter) params.set("ea", "1");
    if (viewMode === "list") params.set("view", "list");
    const qs = params.toString();
    window.history.replaceState(null, "", `/history${qs ? `?${qs}` : ""}`);
  }, [isActive, debouncedSearch, scoreKey, riskKey, eaFilter, viewMode]);

  const enriched = useMemo<EnrichedResult[]>(
    () =>
      state.analysisHistory.map((item) => {
        const sections = parseResponseSections(item.response);
        const metrics = extractMetrics(sections);
        return { item, sections, metrics };
      }),
    [state.analysisHistory],
  );

  const filtered = useMemo(() => {
    let results = enriched;

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      results = results.filter((r) => r.item.gameName.toLowerCase().includes(q));
    }

    if (scoreFilters.size > 0) {
      results = results.filter((r) => matchesScoreFilter(r.metrics.score, scoreFilters));
    }

    if (riskFilters.size > 0) {
      results = results.filter((r) => matchesRiskFilter(r.metrics.riskLevel, riskFilters));
    }

    if (eaFilter) {
      results = results.filter((r) => r.metrics.earlyAccess);
    }

    return [...results].sort((a, b) => b.item.timestamp - a.item.timestamp);
  }, [enriched, debouncedSearch, scoreFilters, riskFilters, eaFilter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
        }
      },
      { threshold: 0, rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [filtered.length, visibleCount]);

  const toggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const toggleScoreFilter = useCallback((key: string) => {
    setScoreFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleRiskFilter = useCallback((key: string) => {
    setRiskFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const handleDelete = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (confirmDeleteId === id) {
        deleteAnalysis(id);
        setExpandedId((prev) => (prev === id ? null : prev));
        setConfirmDeleteId(null);
      } else {
        setConfirmDeleteId(id);
      }
    },
    [deleteAnalysis, confirmDeleteId],
  );

  const handleListDelete = useCallback(
    (id: string) => {
      if (confirmDeleteId === id) {
        deleteAnalysis(id);
        setConfirmDeleteId(null);
      } else {
        setConfirmDeleteId(id);
      }
    },
    [deleteAnalysis, confirmDeleteId],
  );

  const handleClearAll = useCallback(() => {
    if (confirmClearAll) {
      clearHistory();
      setExpandedId(null);
      setConfirmClearAll(false);
    } else {
      setConfirmClearAll(true);
    }
  }, [clearHistory, confirmClearAll]);

  const handleReanalyze = useCallback(
    (e: React.MouseEvent, gameName: string, price: number) => {
      e.stopPropagation();
      sessionCache.set({
        gameName,
        priceRaw: String(price),
        result: null,
        streamedText: "",
        prefillId: Date.now(),
      });
      setIntent("/analyze");
      window.history.pushState(null, "", "/analyze");
    },
    [setIntent],
  );

  const currency = state.setupAnswers?.currency;
  const totalCount = state.analysisHistory.length;

  return {
    inputValue,
    setInputValue,
    scoreFilters,
    riskFilters,
    eaFilter,
    setEaFilter,
    viewMode,
    setViewMode,
    expandedId,
    confirmDeleteId,
    setConfirmDeleteId,
    confirmClearAll,
    setConfirmClearAll,
    sentinelRef,
    filtered,
    visible,
    hasMore,
    toggle,
    toggleScoreFilter,
    toggleRiskFilter,
    handleDelete,
    handleListDelete,
    handleClearAll,
    handleReanalyze,
    currency,
    totalCount,
    SCORE_FILTERS,
    RISK_FILTERS,
  };
}
