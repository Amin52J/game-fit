"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useApp } from "@/app/providers/AppProvider";
import { useAnalysis } from "@/features/analyze-game/model/useAnalysis";
import { TrialAnalysisError } from "@/entities/ai-provider/api/client";
import { sessionCache } from "@/features/analyze-game/model/session-cache";
import { OnboardingChecklist } from "@/features/onboarding";
import { AnalyzeForm } from "./AnalyzeForm";
import { ResultCard } from "./ResultCard";
import { TrialExhaustedCard } from "./TrialExhaustedCard";
import { Button, PageHeader, PageTitle, PageSubtitle, HashLink, GuidanceBanner } from "@/shared/ui";
import { Page, Toolbar, ExpandBar, ExpandHint, ErrorBox, TrialBadge } from "./AnalyzePage.styles";
import { errorMessage } from "./AnalyzePage.utils";

export function AnalyzePage() {
  const {
    analyze,
    isLoading,
    isStreaming,
    isExpanding,
    expanded,
    expand,
    streamedText,
    thinkingText,
    result,
    error,
    reset,
    stop,
    isTrialMode,
    trialRemaining,
    trialExhausted,
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
  const canExpand = isDone && result && !expanded && !isTrialMode;

  const displayResponse = streamedText || result?.response || "";
  const displayName = result?.gameName ?? session?.gameName ?? "";
  const displayPrice = result?.price ?? session?.price ?? 0;

  const { state } = useApp();
  const scoredCount = useMemo(
    () => state.games.filter((g) => g.score !== null).length,
    [state.games],
  );
  const hasLibrary = state.games.length > 0;
  const hasEnoughScored = scoredCount >= 10;
  const showBanners = !showResult && !isLoading && !isStreaming;

  return (
    <Page>
      <PageHeader>
        <PageTitle>Analyze Game</PageTitle>
        <PageSubtitle>
          <HashLink
            href="/help#analyzing"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            How it works
          </HashLink>{" "}
          ·{" "}
          <HashLink href="/help#results" style={{ color: "inherit", textDecoration: "underline" }}>
            Reading your results
          </HashLink>
        </PageSubtitle>
      </PageHeader>

      <OnboardingChecklist
        onAnalyzeClick={() => {
          document.getElementById("analyze-game-name")?.focus();
        }}
      />

      {isTrialMode && !trialExhausted && (
        <TrialBadge>
          {trialRemaining} starter {trialRemaining === 1 ? "analysis" : "analyses"} remaining
        </TrialBadge>
      )}

      {trialExhausted && <TrialExhaustedCard />}

      {showBanners && !hasLibrary && (
        <GuidanceBanner variant="warning" linkText="Go to Library" linkHref="/library">
          <strong>Your game library is empty.</strong> Import or add games and score them so the AI
          can use your taste as a reference. Without a library, analyses will be generic and less
          accurate.
        </GuidanceBanner>
      )}

      <AnalyzeForm
        key={formKey}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        trialExhausted={trialExhausted}
        notEnoughScored={!hasEnoughScored}
        scoredCount={scoredCount}
      />

      {isStreaming || isLoading || isExpanding ? (
        <Toolbar>
          <Button type="button" variant="secondary" size="md" onClick={stop}>
            {isExpanding ? "Stop Expanding" : "Stop Analysis"}
          </Button>
        </Toolbar>
      ) : isDone ? (
        <Toolbar>
          <Button type="button" variant="secondary" size="md" onClick={handleNewAnalysis}>
            New Analysis
          </Button>
        </Toolbar>
      ) : null}

      {showResult ? (
        <>
          <ResultCard
            response={displayResponse}
            gameName={displayName}
            price={displayPrice}
            isStreaming={isStreaming || isExpanding}
            thinkingText={thinkingText}
          />
          {canExpand && (
            <ExpandBar>
              <Button type="button" variant="primary" size="lg" fullWidth onClick={expand}>
                More Details
              </Button>
              <ExpandHint>
                Get an expanded breakdown with deeper sections tailored to your preferences
              </ExpandHint>
            </ExpandBar>
          )}
        </>
      ) : null}

      {error && !(error instanceof TrialAnalysisError) ? (
        <ErrorBox role="alert">{errorMessage(error)}</ErrorBox>
      ) : null}
    </Page>
  );
}
