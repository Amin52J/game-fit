"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styled, { keyframes } from "styled-components";
import { useApp } from "@/app/providers/AppProvider";
import type { AnalysisResult } from "@/shared/types";
import { AnalysisMarkdown, ThemedStructuredResult, HistoryPreview } from "./ResultCard";
import {
  parseResponseSections,
  extractMetrics,
  type ParsedSection,
  type ExtractedMetrics,
} from "@/features/analyze-game/lib/response-parser";
import { Button } from "@/shared/ui/Button";
import { Icon } from "@/shared/ui";
import { useNavigation } from "@/app/providers/NavigationProvider";
import { sessionCache } from "@/features/analyze-game/model/session-cache";

/* ——— Constants ——— */

const PAGE_SIZE = 20;

type ViewMode = "detailed" | "list";

const SCORE_FILTERS = [
  { key: "excellent", label: "80 +", min: 80, max: 100 },
  { key: "good", label: "60–79", min: 60, max: 79 },
  { key: "mixed", label: "40–59", min: 40, max: 59 },
  { key: "low", label: "< 40", min: 0, max: 39 },
] as const;

const RISK_FILTERS = [
  { key: "none", label: "No risk" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
] as const;

/* ——— Enriched type ——— */

interface EnrichedResult {
  item: AnalysisResult;
  sections: ParsedSection[];
  metrics: ExtractedMetrics;
}

/* ——— URL helpers ——— */

function readInitialParams(): {
  q: string;
  score: Set<string>;
  risk: Set<string>;
  view: ViewMode;
  ea: boolean;
} {
  if (typeof window === "undefined")
    return { q: "", score: new Set(), risk: new Set(), view: "detailed", ea: false };
  const params = new URLSearchParams(window.location.search);
  return {
    q: params.get("q") || "",
    score: new Set(params.get("score")?.split(",").filter(Boolean) || []),
    risk: new Set(params.get("risk")?.split(",").filter(Boolean) || []),
    view: params.get("view") === "list" ? "list" : "detailed",
    ea: params.get("ea") === "1",
  };
}

/* ——— Animations ——— */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ——— Layout ——— */

const Page = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
`;

const HeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

/* ——— Toolbar ——— */

const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SearchRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 10px 16px 10px 40px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  outline: none;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentMuted};
  }
`;

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textMuted};
    pointer-events: none;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  flex-shrink: 0;
`;

const ViewBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: none;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentMuted : theme.colors.surface};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.textMuted};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  & + & {
    border-left: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

/* ——— Filter bar ——— */

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const FilterLabel = styled.span`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;
`;

const FilterChip = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  border-radius: 14px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
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

const ResultCount = styled.span`
  margin-left: auto;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;
`;

/* ——— Detailed view ——— */

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const HistoryCard = styled.li<{ $expanded: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  overflow: hidden;
  animation: ${fadeUp} ${({ theme }) => theme.transition.normal};
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  ${({ $expanded, theme }) =>
    $expanded
      ? `
    border-color: ${theme.colors.borderLight};
    box-shadow: ${theme.shadow.md};
  `
      : ""}
`;

const CardMain = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  margin: 0;
  text-align: left;
  cursor: pointer;
  font: inherit;
  color: inherit;
  background: transparent;
  border: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: -2px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CardTitleBlock = styled.div`
  min-width: 0;
  flex: 1;
`;

const CardTitle = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 1.05rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.35;
`;

const CardMeta = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DeleteBtn = styled.button`
  flex-shrink: 0;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.error};
  background: ${({ theme }) => theme.colors.errorMuted};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast};

  &:hover {
    filter: brightness(1.08);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
`;

const ReanalyzeBtn = styled.button`
  flex-shrink: 0;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentMuted};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast};

  &:hover {
    filter: brightness(1.08);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const PreviewContent = styled.div`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
`;

const PreviewBody = styled.div`
  padding: ${({ theme }) => `0 ${theme.spacing.lg} ${theme.spacing.md}`};
`;

const ExpandHint = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ExpandedSection = styled.div`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.lg}`};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
`;

/* ——— List view ——— */

const ListTable = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const ListHeader = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr 90px 140px 80px 60px;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
  align-items: center;

  @media (max-width: 640px) {
    grid-template-columns: 48px 1fr 80px 60px;
    & > :nth-child(3),
    & > :nth-child(4) {
      display: none;
    }
  }
`;

const ListItem = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ListRow = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr 90px 140px 80px 60px;
  padding: 8px 16px;
  align-items: center;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  @media (max-width: 640px) {
    grid-template-columns: 48px 1fr 80px 60px;
    & > :nth-child(3),
    & > :nth-child(4) {
      display: none;
    }
  }
`;

const ListExpandedSection = styled.div`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.lg}`};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
`;

const ListExpandedToolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;


const MiniScore = styled.span<{ $score: number | null }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${({ theme, $score }) => {
    if ($score === null) return theme.colors.surfaceElevated;
    if ($score >= 80) return theme.colors.successMuted;
    if ($score >= 60) return theme.colors.accentMuted;
    if ($score >= 40) return theme.colors.warningMuted;
    return theme.colors.errorMuted;
  }};
  color: ${({ theme, $score }) => {
    if ($score === null) return theme.colors.textMuted;
    if ($score >= 80) return theme.colors.success;
    if ($score >= 60) return theme.colors.accent;
    if ($score >= 40) return theme.colors.warning;
    return theme.colors.error;
  }};

  @media (max-width: 640px) {
    width: 34px;
    height: 34px;
    font-size: 0.7rem;
  }
`;

const ListGameName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ListMeta = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

const RiskBadge = styled.span<{ $level: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  ${({ $level, theme }) => {
    if ($level === "none")
      return `background: ${theme.colors.successMuted}; color: ${theme.colors.success};`;
    if ($level === "medium")
      return `background: ${theme.colors.warningMuted}; color: ${theme.colors.warning};`;
    if ($level === "high")
      return `background: ${theme.colors.errorMuted}; color: ${theme.colors.error};`;
    return `background: ${theme.colors.surfaceElevated}; color: ${theme.colors.textMuted};`;
  }}
`;

const EarlyAccessTag = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  padding: 1px 6px;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.warning};
  background: ${({ theme }) => theme.colors.warningMuted};
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.radius.sm};
  flex-shrink: 0;
  white-space: nowrap;
  vertical-align: middle;
`;

const ListGameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
`;

const ListDeleteBtn = styled.button`
  padding: 4px 8px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  background: transparent;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.error};
    border-color: ${({ theme }) => theme.colors.error};
    background: ${({ theme }) => theme.colors.errorMuted};
  }
`;

/* ——— Infinite scroll ——— */

const Sentinel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ——— Shared ——— */

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

/* ——— Helpers ——— */

function formatPrice(price: number, currencyCode: string | undefined): string {
  const code = currencyCode || "USD";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
    }).format(price);
  } catch {
    return `${code} ${price.toFixed(2)}`;
  }
}

function formatDate(ts: number): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleString();
  }
}

function formatDateShort(ts: number): string {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleDateString();
  }
}

function matchesScoreFilter(score: number | null, filters: Set<string>): boolean {
  if (filters.size === 0) return true;
  if (score === null) return false;
  return SCORE_FILTERS.some((f) => filters.has(f.key) && score >= f.min && score <= f.max);
}

function matchesRiskFilter(risk: string, filters: Set<string>): boolean {
  if (filters.size === 0) return true;
  return filters.has(risk);
}

/* ——— Sub-components ——— */

function ExpandedContent({ response, fullPrice, currencyCode }: { response: string; fullPrice?: number; currencyCode?: string }) {
  const sections = useMemo(() => parseResponseSections(response), [response]);
  const hasStructure = sections.filter((s) => s.key !== "preamble").length >= 3;

  if (hasStructure) {
    return <ThemedStructuredResult sections={sections} isStreaming={false} fullPrice={fullPrice} currencyCode={currencyCode} />;
  }
  return <AnalysisMarkdown source={response} />;
}

/* ——— Main component ——— */

export function HistoryPage() {
  const { state, deleteAnalysis, clearHistory } = useApp();
  const { setIntent } = useNavigation();
  const pathname = usePathname();
  const isActive = pathname === "/history" || pathname.startsWith("/history/");

  /* — State from URL on mount — */
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

  /* — Debounce search — */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(inputValue), 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  /* — Reset visible count on filter change — */
  const scoreKey = useMemo(() => [...scoreFilters].sort().join(","), [scoreFilters]);
  const riskKey = useMemo(() => [...riskFilters].sort().join(","), [riskFilters]);

  const filterKey = `${debouncedSearch}\0${scoreKey}\0${riskKey}\0${eaFilter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

  /* — Sync state to URL when active — */
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

  /* — Enrich results with parsed metrics — */
  const enriched = useMemo<EnrichedResult[]>(
    () =>
      state.analysisHistory.map((item) => {
        const sections = parseResponseSections(item.response);
        const metrics = extractMetrics(sections);
        return { item, sections, metrics };
      }),
    [state.analysisHistory],
  );

  /* — Filter and sort — */
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

  /* — Intersection observer for infinite scroll — */
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

  /* — Callbacks — */
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

  /* — Empty state — */
  if (totalCount === 0) {
    return (
      <Page>
        <HeaderRow>
          <Title>Analysis history</Title>
        </HeaderRow>
        <EmptyState>No analyses yet</EmptyState>
      </Page>
    );
  }

  /* — Render — */
  return (
    <Page>
      <HeaderRow>
        <Title>Analysis history</Title>
        <Actions>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={handleClearAll}
            onBlur={() => setConfirmClearAll(false)}
          >
            {confirmClearAll ? "Are you sure?" : "Clear all"}
          </Button>
        </Actions>
      </HeaderRow>

      <Toolbar>
        <SearchRow>
          <SearchWrap>
            <Icon name="search" size={16} />
            <SearchInput
              placeholder="Search game titles..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoComplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-form-type="other"
              name="history-search"
            />
          </SearchWrap>
          <ViewToggle>
            <ViewBtn
              $active={viewMode === "detailed"}
              onClick={() => setViewMode("detailed")}
              title="Detailed view"
              aria-label="Detailed view"
            >
              <Icon name="view-detail" size={16} />
            </ViewBtn>
            <ViewBtn
              $active={viewMode === "list"}
              onClick={() => setViewMode("list")}
              title="List view"
              aria-label="List view"
            >
              <Icon name="view-list" size={16} />
            </ViewBtn>
          </ViewToggle>
        </SearchRow>

        <FilterBar>
          <FilterGroup>
            <FilterLabel>Score</FilterLabel>
            {SCORE_FILTERS.map((f) => (
              <FilterChip
                key={f.key}
                $active={scoreFilters.has(f.key)}
                onClick={() => toggleScoreFilter(f.key)}
              >
                {f.label}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Risk</FilterLabel>
            {RISK_FILTERS.map((f) => (
              <FilterChip
                key={f.key}
                $active={riskFilters.has(f.key)}
                onClick={() => toggleRiskFilter(f.key)}
              >
                {f.label}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterChip
            $active={eaFilter}
            onClick={() => setEaFilter((v) => !v)}
          >
            Early Access
          </FilterChip>
          <ResultCount>
            {filtered.length === totalCount
              ? `${totalCount} analyses`
              : `${filtered.length} of ${totalCount}`}
          </ResultCount>
        </FilterBar>
      </Toolbar>

      {filtered.length === 0 ? (
        <EmptyState>No analyses match your search or filters</EmptyState>
      ) : viewMode === "detailed" ? (
        <>
          <List>
            {visible.map(({ item, metrics }: EnrichedResult) => {
              const expanded = expandedId === item.id;
              return (
                <HistoryCard key={item.id} $expanded={expanded}>
                  <CardHeader>
                    <CardMain
                      type="button"
                      onClick={() => toggle(item.id)}
                      aria-expanded={expanded}
                    >
                      <CardTitleBlock>
                        <CardTitle>
                          {item.gameName}
                          {metrics.earlyAccess && <EarlyAccessTag>Early Access</EarlyAccessTag>}
                        </CardTitle>
                        <CardMeta>
                          {metrics.score !== null && (
                            <>
                              <MiniScore
                                as="span"
                                $score={metrics.score}
                                style={{
                                  width: "auto",
                                  height: "auto",
                                  borderRadius: "10px",
                                  padding: "1px 8px",
                                  fontSize: "0.75rem",
                                  marginRight: 6,
                                  display: "inline-flex",
                                }}
                              >
                                {metrics.score}
                              </MiniScore>
                            </>
                          )}
                          {formatPrice(item.price, currency)} · {formatDate(item.timestamp)}
                        </CardMeta>
                      </CardTitleBlock>
                    </CardMain>
                    <CardActions>
                      <ReanalyzeBtn
                        type="button"
                        onClick={(e) => handleReanalyze(e, item.gameName, item.price)}
                        aria-label={`Analyze ${item.gameName} again`}
                      >
                        Analyze Again
                      </ReanalyzeBtn>
                      <DeleteBtn
                        type="button"
                        onClick={(e) => handleDelete(e, item.id)}
                        onBlur={() => setConfirmDeleteId(null)}
                        aria-label={`Delete analysis for ${item.gameName}`}
                      >
                        {confirmDeleteId === item.id ? "Sure?" : "Delete"}
                      </DeleteBtn>
                    </CardActions>
                  </CardHeader>

                  {!expanded ? (
                    <CardMain type="button" onClick={() => toggle(item.id)}>
                      <PreviewContent>
                        <HistoryPreview response={item.response} fullPrice={item.price} currencyCode={currency} />
                      </PreviewContent>
                      <PreviewBody>
                        <ExpandHint>Click to view full analysis</ExpandHint>
                      </PreviewBody>
                    </CardMain>
                  ) : (
                    <ExpandedSection>
                      <ExpandedContent response={item.response} fullPrice={item.price} currencyCode={currency} />
                    </ExpandedSection>
                  )}
                </HistoryCard>
              );
            })}
          </List>

          {hasMore && (
            <Sentinel ref={sentinelRef}>Loading more...</Sentinel>
          )}
        </>
      ) : (
        <>
          <ListTable>
            <ListHeader>
              <span>Score</span>
              <span>Game</span>
              <span>Price</span>
              <span>Date</span>
              <span>Risk</span>
              <span />
            </ListHeader>
            {visible.map(({ item, metrics }: EnrichedResult) => (
              <ListItem key={item.id}>
                <ListRow onClick={() => toggle(item.id)}>
                  <div>
                    <MiniScore $score={metrics.score}>
                      {metrics.score !== null ? metrics.score : "—"}
                    </MiniScore>
                  </div>
                  <ListGameCell>
                    <ListGameName title={item.gameName}>{item.gameName}</ListGameName>
                    {metrics.earlyAccess && <EarlyAccessTag>EA</EarlyAccessTag>}
                  </ListGameCell>
                  <ListMeta>{formatPrice(item.price, currency)}</ListMeta>
                  <ListMeta>{formatDateShort(item.timestamp)}</ListMeta>
                  <div>
                    <RiskBadge $level={metrics.riskLevel}>
                      {metrics.riskLevel === "unknown" ? "—" : metrics.riskLevel}
                    </RiskBadge>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <ListDeleteBtn
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleListDelete(item.id);
                      }}
                      onBlur={() => setConfirmDeleteId(null)}
                      aria-label={`Delete analysis for ${item.gameName}`}
                    >
                      {confirmDeleteId === item.id ? "Sure?" : "Delete"}
                    </ListDeleteBtn>
                  </div>
                </ListRow>
                {expandedId === item.id && (
                  <ListExpandedSection>
                    <ListExpandedToolbar>
                      <ReanalyzeBtn
                        type="button"
                        onClick={(e) => handleReanalyze(e, item.gameName, item.price)}
                        aria-label={`Analyze ${item.gameName} again`}
                      >
                        Analyze Again
                      </ReanalyzeBtn>
                    </ListExpandedToolbar>
                    <ExpandedContent response={item.response} fullPrice={item.price} currencyCode={currency} />
                  </ListExpandedSection>
                )}
              </ListItem>
            ))}
          </ListTable>

          {hasMore && (
            <Sentinel ref={sentinelRef}>Loading more...</Sentinel>
          )}
        </>
      )}
    </Page>
  );
}
