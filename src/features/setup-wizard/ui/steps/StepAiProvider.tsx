"use client";

import React, { useState } from "react";
import type { AIProviderConfig, AIProviderType } from "@/shared/types";
import { DEFAULT_MODELS, FREE_ANALYSIS_LIMIT } from "@/shared/types";
import { ApiKeyInfoModal } from "@/features/help-guide";
import { ApiKeyGuide } from "./ApiKeyGuide";
import {
  FieldGroup,
  SectionTitle,
  SectionHint,
  Label,
  TextInput,
  SelectInput,
  PasswordWrap,
  PasswordInput,
  IconButton,
  NoteBox,
  InlineActions,
  Btn,
  StatusPill,
  ProviderGrid,
  ProviderCard,
  ProviderName,
  ProviderDesc,
  InlineLink,
  TrialBanner,
  TrialBannerTitle,
  TrialBannerDesc,
  TrialBannerBtn,
  Divider,
} from "../SetupWizard.styles";

export function StepAiProvider({
  config,
  setConfig,
  showKey,
  setShowKey,
  testStatus,
  testLoading,
  onTest,
  onSkipTrial,
}: {
  config: AIProviderConfig;
  setConfig: React.Dispatch<React.SetStateAction<AIProviderConfig>>;
  showKey: boolean;
  setShowKey: (v: boolean) => void;
  testStatus: "idle" | "ok" | "err";
  testLoading: boolean;
  onTest: () => void;
  onSkipTrial?: () => void;
}) {
  const [showApiKeyInfo, setShowApiKeyInfo] = useState(false);
  const models = DEFAULT_MODELS[config.type];

  const setType = (type: AIProviderType) => {
    setConfig((c) => ({
      ...c,
      type,
      model: type === "custom" ? "" : (DEFAULT_MODELS[type][0] ?? ""),
      baseUrl: type === "custom" ? c.baseUrl : "",
    }));
  };

  return (
    <FieldGroup>
      {onSkipTrial && (
        <>
          <TrialBanner>
            <TrialBannerTitle>Don&apos;t have an API key yet?</TrialBannerTitle>
            <TrialBannerDesc>
              Get {FREE_ANALYSIS_LIMIT} game analyses with our key — no setup needed.
              Test the app before setting up your own provider.
            </TrialBannerDesc>
            <TrialBannerBtn type="button" onClick={onSkipTrial}>
              Skip — use our key
            </TrialBannerBtn>
          </TrialBanner>
          <Divider>or set up your own AI provider</Divider>
        </>
      )}

      <div>
        <SectionTitle>AI provider</SectionTitle>
        <SectionHint>Choose a provider and connect your API key. GameFit supports all major AI providers.</SectionHint>
        <ProviderGrid>
          <ProviderCard type="button" $selected={config.type === "anthropic"} onClick={() => setType("anthropic")}>
            <ProviderName>Anthropic</ProviderName>
            <ProviderDesc>Claude Sonnet 4.6, Opus 4.6, Haiku 4.5</ProviderDesc>
          </ProviderCard>
          <ProviderCard type="button" $selected={config.type === "openai"} onClick={() => setType("openai")}>
            <ProviderName>OpenAI</ProviderName>
            <ProviderDesc>GPT-5.4, GPT-5, o3, and more</ProviderDesc>
          </ProviderCard>
          <ProviderCard type="button" $selected={config.type === "google"} onClick={() => setType("google")}>
            <ProviderName>Google</ProviderName>
            <ProviderDesc>Gemini 3.1 Pro, 3 Flash, 2.5 Pro</ProviderDesc>
          </ProviderCard>
          <ProviderCard type="button" $selected={config.type === "custom"} onClick={() => setType("custom")}>
            <ProviderName>Custom</ProviderName>
            <ProviderDesc>Any OpenAI-compatible endpoint</ProviderDesc>
          </ProviderCard>
        </ProviderGrid>
        {(config.type === "google" || config.type === "custom") && (
          <NoteBox style={{ marginTop: 12 }}>
            <strong>Note:</strong> Anthropic and OpenAI include built-in web search, which lets the
            AI pull up-to-date reviews and community sentiment for each analysis.{" "}
            {config.type === "google" ? "Google Gemini" : "Custom endpoints"} may not support web
            search, which can reduce the accuracy of public sentiment data in your results.
          </NoteBox>
        )}
      </div>

      <div>
        <Label htmlFor="gf-api-key">API key</Label>
        <SectionHint>
          An API key is a unique code that lets GameFit connect to the AI provider you chose above.
          You get it free from the provider&apos;s website — it takes about 2 minutes. The key stays
          in your browser and is never sent to us. Each analysis costs a fraction of a cent, billed
          directly by the provider.{" "}
          <InlineLink type="button" onClick={() => setShowApiKeyInfo(true)}>
            Learn more
          </InlineLink>
        </SectionHint>
        <PasswordWrap>
          <PasswordInput
            id="gf-api-key"
            type={showKey ? "text" : "password"}
            autoComplete="off"
            placeholder={
              config.type === "anthropic"
                ? "sk-ant-…"
                : config.type === "openai"
                  ? "sk-…"
                  : config.type === "google"
                    ? "AIza…"
                    : "Your API key"
            }
            value={config.apiKey}
            onChange={(e) => setConfig((c) => ({ ...c, apiKey: e.target.value }))}
          />
          <IconButton type="button" onClick={() => setShowKey(!showKey)}>
            {showKey ? "Hide" : "Show"}
          </IconButton>
        </PasswordWrap>
        <ApiKeyGuide provider={config.type} />
      </div>

      {config.type === "custom" ? (
        <div>
          <Label htmlFor="gf-base-url">Base URL</Label>
          <TextInput
            id="gf-base-url"
            placeholder="https://api.example.com/v1/chat/completions"
            value={config.baseUrl ?? ""}
            onChange={(e) => setConfig((c) => ({ ...c, baseUrl: e.target.value }))}
          />
        </div>
      ) : null}

      <div>
        <Label htmlFor="gf-model">Model</Label>
        {models.length > 0 ? (
          <SelectInput
            id="gf-model"
            value={config.model}
            onChange={(e) => setConfig((c) => ({ ...c, model: e.target.value }))}
          >
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </SelectInput>
        ) : (
          <TextInput
            id="gf-model"
            placeholder="e.g. llama-3, mistral-large, …"
            value={config.model}
            onChange={(e) => setConfig((c) => ({ ...c, model: e.target.value }))}
          />
        )}
      </div>

      <NoteBox>
        Your API key stays in your browser and is never sent to any server other than your chosen AI
        provider. Each provider charges per request — typically a few cents per game analysis.
      </NoteBox>

      <InlineActions>
        <Btn type="button" $variant="secondary" onClick={onTest} disabled={testLoading}>
          {testLoading ? "Testing…" : "Test Connection"}
        </Btn>
      </InlineActions>
      {testStatus === "ok" ? <StatusPill $ok>Connection succeeded</StatusPill> : null}
      {testStatus === "err" ? (
        <StatusPill>Connection failed — check your key and try again</StatusPill>
      ) : null}
      <ApiKeyInfoModal open={showApiKeyInfo} onClose={() => setShowApiKeyInfo(false)} />
    </FieldGroup>
  );
}
