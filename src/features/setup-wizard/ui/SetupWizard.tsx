"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/providers/AppProvider";
import { generateInstructions } from "@/features/setup-wizard/lib/prompt-generator";
import { fetchSteamGames } from "@/features/auth/lib/steam";
import { AIClient } from "@/entities/ai-provider/api/client";
import type { AIProviderConfig, Game, SetupAnswers } from "@/shared/types";
import { defaultSetupAnswers, defaultAiConfig, mergeGameLists, generateId } from "./SetupWizard.utils";
import { Page, Center, Hero, Title, Subtitle, Card, StepContent, NavRow, Btn, NavRowActions, StatusPillTopMd } from "./SetupWizard.styles";
import { ProgressStepper } from "./steps/ProgressStepper";
import { StepAiProvider } from "./steps/StepAiProvider";
import { StepImportLibrary } from "./steps/StepImportLibrary";
import { StepReview } from "./steps/StepReview";

export { defaultSetupAnswers };
export { StepPreferences } from "./steps/StepPreferences";

export function SetupWizard() {
  const router = useRouter();
  const { setAIProvider, setGames, setInstructions, setSetupAnswers, completeSetup } = useApp();

  const isDevMode = typeof window !== "undefined"
    && new URLSearchParams(window.location.search).get("dev") === "true";

  const [step, setStep] = useState(1);
  const [aiConfig, setAiConfig] = useState<AIProviderConfig>(defaultAiConfig);
  const [answers, setAnswers] = useState<SetupAnswers>(defaultSetupAnswers);
  const [importedGames, setImportedGames] = useState<Game[]>([]);
  const [pasteText, setPasteText] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "ok" | "err">("idle");
  const [testLoading, setTestLoading] = useState(false);
  const [step1Error, setStep1Error] = useState<string | null>(null);
  const [steamAutoImportCount, setSteamAutoImportCount] = useState<number | null>(null);
  const steamAutoImported = useRef(false);

  useEffect(() => {
    if (steamAutoImported.current) return;
    const storedSteamId = sessionStorage.getItem("gamefit_steam_id");
    if (!storedSteamId) return;
    steamAutoImported.current = true;

    fetchSteamGames(storedSteamId)
      .then((games) => {
        const mapped: Game[] = games.map((g) => ({
          id: generateId(),
          name: g.name,
          score: null,
        }));
        setImportedGames((prev) => mergeGameLists(prev, mapped));
        setSteamAutoImportCount(games.length);
      })
      .catch(() => {});
  }, []);

  const runTestConnection = async () => {
    setTestLoading(true);
    setTestStatus("idle");
    try {
      const cfg: AIProviderConfig = {
        type: aiConfig.type,
        apiKey: aiConfig.apiKey.trim(),
        model: aiConfig.model.trim(),
        ...(aiConfig.type === "custom" ? { baseUrl: aiConfig.baseUrl?.trim() } : {}),
      };
      const client = new AIClient(cfg);
      await client.analyze("Connection test", 0, "Reply with exactly: OK", [], "€");
      setTestStatus("ok");
    } catch {
      setTestStatus("err");
    } finally {
      setTestLoading(false);
    }
  };

  const validateStep1 = (): boolean => {
    if (!aiConfig.apiKey.trim()) {
      setStep1Error("Please enter an API key.");
      return false;
    }
    if (!aiConfig.model.trim()) {
      setStep1Error("Please choose or enter a model.");
      return false;
    }
    if (aiConfig.type === "custom" && !aiConfig.baseUrl?.trim()) {
      setStep1Error("Custom providers need a base URL.");
      return false;
    }
    setStep1Error(null);
    return true;
  };

  const goNext = () => {
    if (!isDevMode && step === 1 && !validateStep1()) return;
    setStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const skipLibrary = () => {
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finish = () => {
    if (isDevMode) {
      router.push("/analyze");
      return;
    }
    const cfg: AIProviderConfig = {
      type: aiConfig.type,
      apiKey: aiConfig.apiKey.trim(),
      model: aiConfig.model.trim(),
      ...(aiConfig.type === "custom" && aiConfig.baseUrl?.trim()
        ? { baseUrl: aiConfig.baseUrl.trim() }
        : {}),
    };
    setAIProvider(cfg);
    setSetupAnswers(answers);
    setGames(importedGames);
    setInstructions(generateInstructions(answers));
    completeSetup();
    sessionStorage.removeItem("gamefit_steam_id");
    sessionStorage.removeItem("gamefit_steam_is_new");
    router.push("/analyze");
  };

  // Lazy-import StepPreferences to keep this file slim
  const StepPreferences = React.lazy(() =>
    import("./steps/StepPreferences").then((m) => ({ default: m.StepPreferences })),
  );

  return (
    <Page>
      <Center>
        <Hero>
          <Title>Welcome to GameFit</Title>
          <Subtitle>Let&apos;s set up your personalized game analysis assistant</Subtitle>
        </Hero>

        <Card>
          <ProgressStepper currentStep={step} />

          <StepContent key={step}>
            {step === 1 ? (
              <>
                <StepAiProvider
                  config={aiConfig}
                  setConfig={setAiConfig}
                  showKey={showKey}
                  setShowKey={setShowKey}
                  testStatus={testStatus}
                  testLoading={testLoading}
                  onTest={runTestConnection}
                />
                {step1Error ? <StatusPillTopMd>{step1Error}</StatusPillTopMd> : null}
              </>
            ) : null}
            {step === 2 ? (
              <React.Suspense fallback={null}>
                <StepPreferences answers={answers} setAnswers={setAnswers} />
              </React.Suspense>
            ) : null}
            {step === 3 ? (
              <StepImportLibrary
                importedGames={importedGames}
                setImportedGames={setImportedGames}
                pasteText={pasteText}
                setPasteText={setPasteText}
                parseError={parseError}
                setParseError={setParseError}
                steamAutoImportCount={steamAutoImportCount}
              />
            ) : null}
            {step === 4 ? (
              <StepReview
                aiConfig={aiConfig}
                importedGames={importedGames}
                answers={answers}
              />
            ) : null}
          </StepContent>

          <NavRow>
            <div>
              {step > 1 ? (
                <Btn type="button" $variant="secondary" onClick={goBack}>
                  Back
                </Btn>
              ) : (
                <span />
              )}
            </div>
            <NavRowActions>
              {step === 3 ? (
                <Btn type="button" $variant="ghost" onClick={skipLibrary}>
                  Skip import
                </Btn>
              ) : null}
              {step < 4 ? (
                <Btn type="button" $variant="primary" onClick={goNext}>
                  Next
                </Btn>
              ) : (
                <Btn type="button" $variant="primary" onClick={finish}>
                  Finish Setup
                </Btn>
              )}
            </NavRowActions>
          </NavRow>
        </Card>
      </Center>
    </Page>
  );
}
