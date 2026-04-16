"use client";

import React from "react";
import { Button, Input, Select, SectionCard, SectionTitle, SectionDesc } from "@/shared/ui";
import type { AIProviderType } from "@/shared/types";
import { DEFAULT_MODELS, FREE_ANALYSIS_LIMIT } from "@/shared/types";
import { FormRow, FormGroup, KeyFieldWrap, RevealKeyButton, MarginedButtonRow, TrialStatusBox } from "./SettingsPage.styles";

export function ProviderSection({
  providerType,
  setProviderType,
  apiKey,
  setApiKey,
  model,
  setModel,
  baseUrl,
  setBaseUrl,
  showKey,
  setShowKey,
  onSave,
  freeAnalysesUsed,
}: {
  providerType: AIProviderType;
  setProviderType: (t: AIProviderType) => void;
  apiKey: string;
  setApiKey: (v: string) => void;
  model: string;
  setModel: (v: string) => void;
  baseUrl: string;
  setBaseUrl: (v: string) => void;
  showKey: boolean;
  setShowKey: (v: boolean) => void;
  onSave: () => void;
  freeAnalysesUsed: number;
}) {
  const hasOwnKey = Boolean(apiKey.trim());
  const trialRemaining = FREE_ANALYSIS_LIMIT - freeAnalysesUsed;
  const showTrialStatus = !hasOwnKey && freeAnalysesUsed > 0;

  return (
    <SectionCard>
      <SectionTitle>AI Provider</SectionTitle>
      <SectionDesc>Configure which AI model to use for game analysis.</SectionDesc>

      {showTrialStatus && (
        <TrialStatusBox $exhausted={trialRemaining <= 0}>
          {trialRemaining > 0 ? (
            <>
              <strong>Starter analyses:</strong> {trialRemaining} of {FREE_ANALYSIS_LIMIT}{" "}
              remaining. Add your own API key below for unlimited use.
            </>
          ) : (
            <>
              <strong>All 5 starter analyses used.</strong> Add your own API key below to
              continue using GameFit.
            </>
          )}
        </TrialStatusBox>
      )}

      <FormRow>
        <FormGroup>
          <Select
            label="Provider"
            value={providerType}
            onChange={(e) => {
              const t = e.target.value as AIProviderType;
              setProviderType(t);
              setModel(DEFAULT_MODELS[t]?.[0] || "");
            }}
          >
            <option value="anthropic">Anthropic (Claude)</option>
            <option value="openai">OpenAI (ChatGPT)</option>
            <option value="google">Google (Gemini)</option>
            <option value="custom">Custom Endpoint</option>
          </Select>
        </FormGroup>
        <FormGroup>
          {DEFAULT_MODELS[providerType]?.length > 0 ? (
            <Select label="Model" value={model} onChange={(e) => setModel(e.target.value)}>
              {DEFAULT_MODELS[providerType].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          ) : (
            <Input
              label="Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model name"
            />
          )}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <KeyFieldWrap>
            <Input
              label="API Key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
            />
            <RevealKeyButton type="button" onClick={() => setShowKey(!showKey)}>
              {showKey ? "Hide" : "Show"}
            </RevealKeyButton>
          </KeyFieldWrap>
        </FormGroup>
        {providerType === "custom" && (
          <FormGroup>
            <Input
              label="Base URL"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.example.com/v1/chat/completions"
            />
          </FormGroup>
        )}
      </FormRow>

      <MarginedButtonRow>
        <Button variant="primary" onClick={onSave}>Save Provider</Button>
      </MarginedButtonRow>
    </SectionCard>
  );
}
