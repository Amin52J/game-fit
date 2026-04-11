"use client";
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useApp } from "@/app/providers/AppProvider";
import { generateInstructions } from "@/features/setup-wizard/lib/prompt-generator";
import { StepPreferences, defaultSetupAnswers } from "@/features/setup-wizard/ui/SetupWizard";
import type { AIProviderConfig, AIProviderType, SetupAnswers } from "@/shared/types";
import { DEFAULT_MODELS } from "@/shared/types";


const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Section = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
`;

const SectionDesc = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FormRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const FormGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  outline: none;
  transition: border-color ${({ theme }) => theme.transition.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const Btn = styled.button<{ $variant?: "primary" | "secondary" | "danger" | "ghost" }>`
  padding: 8px 18px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "primary"
        ? theme.colors.accent
        : $variant === "danger"
          ? theme.colors.error
          : $variant === "ghost"
            ? "transparent"
            : theme.colors.border};
  background: ${({ theme, $variant }) =>
    $variant === "primary"
      ? theme.colors.accent
      : $variant === "danger"
        ? theme.colors.errorMuted
        : $variant === "ghost"
          ? "transparent"
          : theme.colors.surface};
  color: ${({ theme, $variant }) =>
    $variant === "primary"
      ? "#fff"
      : $variant === "danger"
        ? theme.colors.error
        : theme.colors.text};

  &:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0) scale(0.97);
  }
`;

const BtnRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  user-select: none;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ToggleTrack = styled.div<{ $on: boolean }>`
  position: relative;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 12px;
  background: ${({ theme, $on }) => ($on ? theme.colors.accent : theme.colors.border)};
  transition: background ${({ theme }) => theme.transition.fast};
`;

const ToggleThumb = styled.div<{ $on: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $on }) => ($on ? "22px" : "2px")};
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.text};
  transition: left 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const ToggleLabel = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ToggleDesc = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;


const toastSlideIn = keyframes`
  from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
`;

const Toast = styled.div<{ $type: "success" | "error" }>`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  left: calc(50% + 120px);
  transform: translateX(-50%);
  z-index: 900;
  padding: 10px 24px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $type }) =>
    $type === "success" ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)"};
  border: 1px solid ${({ theme, $type }) =>
    $type === "success" ? theme.colors.success : theme.colors.error};
  color: ${({ theme, $type }) => ($type === "success" ? theme.colors.success : theme.colors.error)};
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: ${({ theme }) => theme.shadow.md};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  animation: ${toastSlideIn} 250ms ease;
  pointer-events: none;

  @media (max-width: 767px) {
    left: 50%;
  }
`;

export function SettingsPage() {
  const { state, setAIProvider, setInstructions, setSetupAnswers, resetApp } = useApp();

  const [providerType, setProviderType] = useState<AIProviderType>(
    state.aiProvider?.type || "anthropic",
  );
  const [apiKey, setApiKey] = useState(state.aiProvider?.apiKey || "");
  const [model, setModel] = useState(state.aiProvider?.model || "");
  const [baseUrl, setBaseUrl] = useState(state.aiProvider?.baseUrl || "");
  const [showKey, setShowKey] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [tasteAnswers, setTasteAnswers] = useState<SetupAnswers>(
    () => ({ ...defaultSetupAnswers(), ...state.setupAnswers }),
  );

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveProvider = () => {
    const config: AIProviderConfig = {
      type: providerType,
      apiKey,
      model: model || DEFAULT_MODELS[providerType]?.[0] || "",
      ...(providerType === "custom" ? { baseUrl } : {}),
    };
    setAIProvider(config);
    showToast("AI provider saved");
  };

  const saveTaste = () => {
    setSetupAnswers(tasteAnswers);
    setInstructions(generateInstructions(tasteAnswers));
    showToast("Taste preferences saved");
  };

  const handleReset = () => {
    if (confirm("This will delete ALL your data (library, settings, history). Are you sure?")) {
      resetApp();
    }
  };

  return (
    <Page>
      <Title>Settings</Title>

      {toast && <Toast $type={toast.type}>{toast.msg}</Toast>}

      <Section>
        <SectionTitle>AI Provider</SectionTitle>
        <SectionDesc>Configure which AI model to use for game analysis.</SectionDesc>

        <FormRow>
          <FormGroup>
            <Label>Provider</Label>
            <StyledSelect
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
            </StyledSelect>
          </FormGroup>
          <FormGroup>
            <Label>Model</Label>
            {DEFAULT_MODELS[providerType]?.length > 0 ? (
              <StyledSelect value={model} onChange={(e) => setModel(e.target.value)}>
                {DEFAULT_MODELS[providerType].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </StyledSelect>
            ) : (
              <StyledInput
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Model name"
              />
            )}
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label>API Key</Label>
            <div style={{ position: "relative" }}>
              <StyledInput
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
              <button
                onClick={() => setShowKey(!showKey)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#888",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
          </FormGroup>
          {providerType === "custom" && (
            <FormGroup>
              <Label>Base URL</Label>
              <StyledInput
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.example.com/v1/chat/completions"
              />
            </FormGroup>
          )}
        </FormRow>

        <BtnRow>
          <Btn $variant="primary" onClick={saveProvider}>
            Save Provider
          </Btn>
        </BtnRow>
      </Section>

      <Section>
        <SectionTitle>Game Taste</SectionTitle>
        <SectionDesc>
          Your gaming preferences, priorities, and dealbreakers. Changes will regenerate the AI
          instructions automatically.
        </SectionDesc>

        <StepPreferences answers={tasteAnswers} setAnswers={setTasteAnswers} />
        <BtnRow>
          <Btn $variant="primary" onClick={saveTaste}>
            Save Preferences
          </Btn>
        </BtnRow>
      </Section>

      <Section>
        <SectionTitle style={{ color: "#ef4444" }}>Danger Zone</SectionTitle>
        <SectionDesc>Permanently delete all your data (library, history, preferences) and start over.</SectionDesc>
        <BtnRow>
          <Btn $variant="danger" onClick={handleReset}>
            Reset Everything
          </Btn>
        </BtnRow>
      </Section>
    </Page>
  );
}
