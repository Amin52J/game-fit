"use client";
import { useState, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { AIClient, trialAnalyze, TrialAnalysisError } from "@/entities/ai-provider/api/client";
import { useApp } from "@/app/providers/AppProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import type { AnalysisResult } from "@/shared/types";
import { FREE_ANALYSIS_LIMIT } from "@/shared/types";
import { loadFreeAnalysesUsed } from "@/shared/api/db";
import { trackStarterAnalysis } from "@/shared/analytics";
import { getExtendedSectionNames } from "@/features/setup-wizard/lib/prompt-generator";
import { sessionCache } from "./session-cache";

function resolveCurrencySymbol(code: string | undefined): string {
  if (!code) return "€";
  try {
    const parts = new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value ?? code;
  } catch {
    return code;
  }
}

export function useAnalysis() {
  const { user } = useAuth();
  const { state, addAnalysis, updateAnalysisResponse, setFreeAnalysesUsed } = useApp();
  const cached = sessionCache.get();
  const [streamedText, setStreamedText] = useState(cached.streamedText);
  const [thinkingText, setThinkingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [cachedResult, setCachedResult] = useState<AnalysisResult | null>(cached.result);
  const abortRef = useRef<AbortController | null>(null);

  const hasOwnKey = Boolean(state.aiProvider?.apiKey?.trim());
  const isTrialMode = !hasOwnKey;
  const trialRemaining = FREE_ANALYSIS_LIMIT - state.freeAnalysesUsed;
  const trialExhausted = isTrialMode && trialRemaining <= 0;

  const mutation = useMutation({
    mutationFn: async ({ gameName, price }: { gameName: string; price: number }) => {
      if (!hasOwnKey && trialRemaining <= 0) {
        throw new TrialAnalysisError(
          "FREE_TRIAL_EXHAUSTED",
          "You've used all 5 starter analyses. Set up your own API key to continue.",
        );
      }

      const abortController = new AbortController();
      abortRef.current = abortController;

      setStreamedText("");
      setThinkingText("");
      setCachedResult(null);
      setExpanded(false);
      sessionCache.set({ streamedText: "", result: null });
      setIsStreaming(true);

      const onChunk = (chunk: string) => {
        setStreamedText((prev) => {
          const next = prev + chunk;
          sessionCache.set({ streamedText: next });
          return next;
        });
      };
      const onStatus = (status: string) => {
        setThinkingText(status);
      };

      let response: string;

      if (hasOwnKey) {
        const client = new AIClient(state.aiProvider!);
        response = await client.analyze(
          gameName,
          price,
          state.instructions,
          state.games,
          resolveCurrencySymbol(state.setupAnswers?.currency),
          onChunk,
          abortController.signal,
          onStatus,
        );
      } else {
        response = await trialAnalyze(
          gameName,
          price,
          state.instructions,
          state.games,
          resolveCurrencySymbol(state.setupAnswers?.currency),
          onChunk,
          abortController.signal,
          onStatus,
        );
        const updated = await loadFreeAnalysesUsed();
        setFreeAnalysesUsed(updated);
        if (user) void trackStarterAnalysis(user, gameName, updated);
      }

      setIsStreaming(false);
      abortRef.current = null;

      const result: AnalysisResult = {
        id: Math.random().toString(36).slice(2, 11),
        gameName,
        price,
        response,
        timestamp: Date.now(),
      };

      addAnalysis(result);
      setCachedResult(result);
      sessionCache.set({ result, streamedText: response });
      return result;
    },
    onError: (err) => {
      setIsStreaming(false);
      abortRef.current = null;
      if (err instanceof TrialAnalysisError) {
        setFreeAnalysesUsed(FREE_ANALYSIS_LIMIT);
      }
    },
  });

  const expand = useCallback(async () => {
    if (!state.aiProvider || !state.setupAnswers) return;
    const currentResult = mutation.data ?? cachedResult;
    if (!currentResult) return;

    const sectionNames = getExtendedSectionNames(state.setupAnswers);
    if (sectionNames.length === 0) return;

    const abortController = new AbortController();
    abortRef.current = abortController;
    setIsExpanding(true);

    try {
      const client = new AIClient(state.aiProvider);
      let expandedChunks = "";
      await client.expandAnalysis(
        currentResult.gameName,
        currentResult.response,
        sectionNames,
        (chunk) => {
          expandedChunks += chunk;
          setStreamedText((prev) => prev + chunk);
        },
        abortController.signal,
      );
      setExpanded(true);
      const fullResponse = currentResult.response + expandedChunks;
      updateAnalysisResponse(currentResult.id, fullResponse);
      sessionCache.set({ streamedText: fullResponse, result: { ...currentResult, response: fullResponse } });
    } catch {
      /* abort or error — ignore */
    } finally {
      setIsExpanding(false);
      abortRef.current = null;
    }
  }, [state.aiProvider, state.setupAnswers, mutation.data, cachedResult, updateAnalysisResponse]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setIsExpanding(false);
    abortRef.current = null;
  }, []);

  const reset = useCallback(() => {
    setStreamedText("");
    setThinkingText("");
    setIsStreaming(false);
    setIsExpanding(false);
    setExpanded(false);
    setCachedResult(null);
    abortRef.current?.abort();
    abortRef.current = null;
    mutation.reset();
    sessionCache.clear();
  }, [mutation]);

  const result = (mutation.isPending || isStreaming) ? null : (mutation.data ?? cachedResult);

  return {
    analyze: mutation.mutate,
    isLoading: mutation.isPending,
    isStreaming,
    isExpanding,
    expanded,
    expand,
    streamedText,
    thinkingText,
    result,
    error: mutation.error,
    reset,
    stop,
    isTrialMode,
    trialRemaining,
    trialExhausted,
  };
}
