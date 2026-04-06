"use client";
import { useState, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { AIClient } from "@/entities/ai-provider/api/client";
import { useApp } from "@/app/providers/AppProvider";
import type { AnalysisResult } from "@/shared/types";

export function useAnalysis() {
  const { state, addAnalysis } = useApp();
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ gameName, price }: { gameName: string; price: number }) => {
      if (!state.aiProvider) throw new Error("No AI provider configured");

      const abortController = new AbortController();
      abortRef.current = abortController;

      const client = new AIClient(state.aiProvider);
      setStreamedText("");
      setIsStreaming(true);

      const response = await client.analyze(
        gameName,
        price,
        state.instructions,
        state.games,
        (chunk) => setStreamedText((prev) => prev + chunk),
        abortController.signal,
      );

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
      return result;
    },
    onError: () => {
      setIsStreaming(false);
      abortRef.current = null;
    },
  });

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    abortRef.current = null;
  }, []);

  const reset = useCallback(() => {
    setStreamedText("");
    setIsStreaming(false);
    abortRef.current?.abort();
    abortRef.current = null;
    mutation.reset();
  }, [mutation]);

  return {
    analyze: mutation.mutate,
    isLoading: mutation.isPending,
    isStreaming,
    streamedText,
    result: mutation.data,
    error: mutation.error,
    reset,
    stop,
  };
}
