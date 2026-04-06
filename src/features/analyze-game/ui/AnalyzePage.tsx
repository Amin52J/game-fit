"use client";

import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useAnalysis } from "@/features/analyze-game/model/useAnalysis";
import { sessionCache } from "@/features/analyze-game/model/session-cache";
import { AnalyzeForm } from "./AnalyzeForm";
import { ResultCard } from "./ResultCard";
import { Button } from "@/shared/ui/Button";

const Page = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ErrorBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.error};
  background: ${({ theme }) => theme.colors.errorMuted};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radius.md};
`;

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Something went wrong. Try again.";
}

export function AnalyzePage() {
  const { analyze, isLoading, isStreaming, streamedText, result, error, reset, stop } =
    useAnalysis();
  const cached = sessionCache.get();
  const [session, setSession] = useState<{ gameName: string; price: number } | null>(
    cached.result ? { gameName: cached.result.gameName, price: cached.result.price } : null,
  );

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
  }, [reset]);

  const showResult = Boolean(session);

  const displayResponse = streamedText || result?.response || "";
  const displayName = result?.gameName ?? session?.gameName ?? "";
  const displayPrice = result?.price ?? session?.price ?? 0;

  return (
    <Page>
      <AnalyzeForm onSubmit={handleSubmit} isLoading={isLoading} />

      {(isStreaming || isLoading) ? (
        <Toolbar>
          <Button type="button" variant="secondary" size="md" onClick={stop}>
            Stop Analysis
          </Button>
        </Toolbar>
      ) : (session || result) ? (
        <Toolbar>
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
          isStreaming={isStreaming}
        />
      ) : null}

      {error ? <ErrorBox role="alert">{errorMessage(error)}</ErrorBox> : null}
    </Page>
  );
}
