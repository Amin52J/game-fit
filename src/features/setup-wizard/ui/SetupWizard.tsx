"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/providers/AppProvider";
import { generateInstructions } from "@/features/setup-wizard/lib/prompt-generator";
import { fetchSteamGames } from "@/features/auth/lib/steam";
import { AIClient } from "@/entities/ai-provider/api/client";
import type { AIProviderConfig, Game, SetupAnswers } from "@/shared/types";
import { defaultSetupAnswers, defaultAiConfig, mergeGameLists, generateId } from "./SetupWizard.utils";
import { Skeleton } from "@/shared/ui/Skeleton";
import { Page, Center, Hero, Title, Subtitle, Card, StepContent, NavRow, Btn, NavRowActions, StatusPillTopMd, FieldGroup, SectionTitle, PlayGrid, SliderGrid, SliderField, ChipGrid, OptionRow, Row } from "./SetupWizard.styles";
import { ProgressStepper } from "./steps/ProgressStepper";
import { StepAiProvider } from "./steps/StepAiProvider";
import { StepImportLibrary } from "./steps/StepImportLibrary";
import { StepReview } from "./steps/StepReview";

export { defaultSetupAnswers };
export { StepPreferences } from "./steps/StepPreferences";

const LazyStepPreferences = React.lazy(() =>
  import("./steps/StepPreferences").then((m) => ({ default: m.StepPreferences })),
);

function PreferencesSkeleton() {
  return (
    <FieldGroup>
      <div>
        <SectionTitle><Skeleton $width="90px" $height="1em" /></SectionTitle>
        <PlayGrid>
          {[0, 1, 2].map((i) => <Skeleton key={i} $height="68px" $radius="12px" />)}
        </PlayGrid>
      </div>

      <div>
        <SectionTitle><Skeleton $width="180px" $height="1em" /></SectionTitle>
        <SliderGrid>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <SliderField key={i}>
              <Skeleton $width="100%" $height="14px" />
              <Skeleton $width="100%" $height="6px" $radius="3px" />
            </SliderField>
          ))}
        </SliderGrid>
      </div>

      <div>
        <SectionTitle><Skeleton $width="120px" $height="1em" /></SectionTitle>
        <ChipGrid>
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} $height="38px" $radius="8px" />
          ))}
        </ChipGrid>
      </div>

      <div>
        <SectionTitle><Skeleton $width="110px" $height="1em" /></SectionTitle>
        <OptionRow>
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} $width="100px" $height="38px" $radius="8px" />)}
        </OptionRow>
      </div>

      <div>
        <SectionTitle><Skeleton $width="140px" $height="1em" /></SectionTitle>
        <OptionRow>
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} $width="110px" $height="38px" $radius="8px" />)}
        </OptionRow>
      </div>

      <div>
        <SectionTitle><Skeleton $width="170px" $height="1em" /></SectionTitle>
        <OptionRow>
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} $width="120px" $height="38px" $radius="8px" />)}
        </OptionRow>
      </div>

      <Row>
        <div><Skeleton $width="70px" $height="14px" style={{ marginBottom: 6 }} /><Skeleton $height="40px" /></div>
        <div><Skeleton $width="50px" $height="14px" style={{ marginBottom: 6 }} /><Skeleton $height="40px" /></div>
      </Row>

      <div>
        <Skeleton $width="160px" $height="14px" style={{ marginBottom: 6 }} />
        <Skeleton $height="80px" $radius="8px" />
      </div>
    </FieldGroup>
  );
}

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
  const [trialMode, setTrialMode] = useState(false);
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

  const scrollTop = () => {
    const main = document.querySelector("main");
    if (main) main.scrollTo({ top: 0, behavior: "instant" });
    else window.scrollTo({ top: 0 });
  };

  const handleSkipTrial = () => {
    setTrialMode(true);
    setStep(2);
    scrollTop();
  };

  const goNext = () => {
    if (!isDevMode && !trialMode && step === 1 && !validateStep1()) return;
    setStep((s) => Math.min(4, s + 1));
    scrollTop();
  };

  const goBack = () => {
    setStep((s) => Math.max(1, s - 1));
    scrollTop();
  };

  const skipLibrary = () => {
    setStep(4);
    scrollTop();
  };

  const finish = () => {
    if (isDevMode) {
      router.push("/analyze");
      return;
    }
    if (!trialMode) {
      const cfg: AIProviderConfig = {
        type: aiConfig.type,
        apiKey: aiConfig.apiKey.trim(),
        model: aiConfig.model.trim(),
        ...(aiConfig.type === "custom" && aiConfig.baseUrl?.trim()
          ? { baseUrl: aiConfig.baseUrl.trim() }
          : {}),
      };
      setAIProvider(cfg);
    }
    setSetupAnswers(answers);
    setGames(importedGames);
    setInstructions(generateInstructions(answers));
    completeSetup();
    sessionStorage.removeItem("gamefit_steam_id");
    sessionStorage.removeItem("gamefit_steam_is_new");
    router.push("/analyze");
  };

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
                  onSkipTrial={handleSkipTrial}
                />
                {step1Error ? <StatusPillTopMd>{step1Error}</StatusPillTopMd> : null}
              </>
            ) : null}
            {step === 2 ? (
              <React.Suspense fallback={<PreferencesSkeleton />}>
                <LazyStepPreferences answers={answers} setAnswers={setAnswers} />
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
                trialMode={trialMode}
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
