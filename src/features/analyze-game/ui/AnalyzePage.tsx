"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAnalysis } from "@/features/analyze-game/model/useAnalysis";
import { sessionCache } from "@/features/analyze-game/model/session-cache";
import { AnalyzeForm } from "./AnalyzeForm";
import { ResultCard } from "./ResultCard";
import { Button } from "@/shared/ui";
import { Page, Toolbar, ErrorBox } from "./AnalyzePage.styles";
import { errorMessage } from "./AnalyzePage.utils";

export function AnalyzePage() {
  const {
    analyze, isLoading, isStreaming, isExpanding, expanded, expand,
    streamedText, thinkingText, result, error, reset, stop,
  } = useAnalysis();
  const cached = sessionCache.get();
  const [session, setSession] = useState<{ gameName: string; price: number } | null>(
    cached.result ? { gameName: cached.result.gameName, price: cached.result.price } : null,
  );
  const [formKey, setFormKey] = useState(0);
  const [lastPrefillId, setLastPrefillId] = useState(0);
  const currentPrefillId = sessionCache.get().prefillId;
  if (currentPrefillId > lastPrefillId) {
    setLastPrefillId(currentPrefillId);
    setSession(null);
    setFormKey((k) => k + 1);
  }

  const bottomRef = useRef<HTMLDivElement>(null);
  const wasStreamingRef = useRef(false);
  const userScrolledRef = useRef(false);

  useEffect(() => {
    const active = isStreaming || isExpanding;
    if (!active) return;

    userScrolledRef.current = false;
    const onUserScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      userScrolledRef.current = !nearBottom;
    };
    window.addEventListener("wheel", onUserScroll, { passive: true });
    window.addEventListener("touchmove", onUserScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onUserScroll);
      window.removeEventListener("touchmove", onUserScroll);
    };
  }, [isStreaming, isExpanding]);

  useEffect(() => {
    const active = isStreaming || isExpanding;
    if (active) {
      wasStreamingRef.current = true;
      if (!userScrolledRef.current) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    } else if (wasStreamingRef.current) {
      wasStreamingRef.current = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isStreaming, isExpanding, streamedText]);

  const handleSubmit = useCallback(
    (gameName: string, price: number) => {
      setSession({ gameName, price });
      sessionCache.set({ gameName, priceRaw: String(price) });
      analyze({ gameName, price });
    },
    [analyze],
  );

  const handleNewAnalysis = useCallback(() => {
    reset();
    setSession(null);
    setFormKey((k) => k + 1);
  }, [reset]);

  const showResult = Boolean(session);
  const isDone = !isStreaming && !isLoading && !isExpanding && (session || result);
  const canExpand = isDone && result && !expanded;

  const displayResponse = streamedText || result?.response || "";
  const displayName = result?.gameName ?? session?.gameName ?? "";
  const displayPrice = result?.price ?? session?.price ?? 0;

  return (
    <Page>
      <AnalyzeForm key={formKey} onSubmit={handleSubmit} isLoading={isLoading} />

      {(isStreaming || isLoading || isExpanding) ? (
        <Toolbar>
          <Button type="button" variant="secondary" size="md" onClick={stop}>
            {isExpanding ? "Stop Expanding" : "Stop Analysis"}
          </Button>
        </Toolbar>
      ) : isDone ? (
        <Toolbar>
          {canExpand && (
            <Button type="button" variant="secondary" size="md" onClick={expand}>
              More Details
            </Button>
          )}
          <Button type="button" variant="secondary" size="md" onClick={handleNewAnalysis}>
            New Analysis
          </Button>
        </Toolbar>
      ) : null}

      {showResult ? (
        <ResultCard
          response={displayResponse}
          gameName={displayName}
          price={displayPrice}
          isStreaming={isStreaming || isExpanding}
          thinkingText={thinkingText}
        />
      ) : null}

      {error ? <ErrorBox role="alert">{errorMessage(error)}</ErrorBox> : null}

      <div ref={bottomRef} />
    </Page>
  );
}
