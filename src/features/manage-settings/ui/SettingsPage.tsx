"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useApp } from "@/app/providers/AppProvider";
import { generateInstructions } from "@/features/setup-wizard/lib/prompt-generator";
import { StepPreferences, defaultSetupAnswers } from "@/features/setup-wizard/ui/SetupWizard";
import type { AIProviderConfig, AIProviderType, SetupAnswers } from "@/shared/types";
import { DEFAULT_MODELS } from "@/shared/types";
import { Icon } from "@/shared/ui";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

const TextArea = styled.textarea`
  width: 100%;
  min-height: 400px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 0.82rem;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: border-color ${({ theme }) => theme.transition.fast};

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
  transition: left ${({ theme }) => theme.transition.fast};
`;

const ToggleLabel = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ToggleDesc = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TasteSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TasteChip = styled.div`
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TasteChipLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-right: 6px;
`;

const TasteEditor = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const InstructionsPreview = styled.div`
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.85rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};

  h2 {
    font-size: 1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin: 1.25em 0 0.5em;
    &:first-child { margin-top: 0; }
  }

  h3 {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin: 1em 0 0.4em;
  }

  p { margin: 0.4em 0; }

  strong { color: ${({ theme }) => theme.colors.text}; }

  ul, ol {
    padding-left: 1.5em;
    margin: 0.4em 0;
  }

  li { margin: 0.2em 0; }

  hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    margin: 1em 0;
  }

  code {
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 0.8rem;
    background: ${({ theme }) => theme.colors.surfaceElevated};
    padding: 1px 5px;
    border-radius: 4px;
  }
`;

const Toast = styled.div<{ $type: "success" | "error" }>`
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $type }) =>
    $type === "success" ? theme.colors.successMuted : theme.colors.errorMuted};
  color: ${({ theme, $type }) => ($type === "success" ? theme.colors.success : theme.colors.error)};
  font-size: 0.85rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export function SettingsPage() {
  const { state, setAIProvider, setInstructions, setSetupAnswers, resetApp } = useApp();

  const [providerType, setProviderType] = useState<AIProviderType>(
    state.aiProvider?.type || "anthropic",
  );
  const [apiKey, setApiKey] = useState(state.aiProvider?.apiKey || "");
  const [model, setModel] = useState(state.aiProvider?.model || "");
  const [baseUrl, setBaseUrl] = useState(state.aiProvider?.baseUrl || "");
  const [extendedThinking, setExtendedThinking] = useState(
    state.aiProvider?.extendedThinking ?? false,
  );
  const [showKey, setShowKey] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [editableInstructions, setEditableInstructions] = useState(state.instructions);
  const [isEditingInstructions, setIsEditingInstructions] = useState(false);

  const [isEditingTaste, setIsEditingTaste] = useState(false);
  const [tasteAnswers, setTasteAnswers] = useState<SetupAnswers>(
    () => ({ ...defaultSetupAnswers(), ...state.setupAnswers }),
  );

  useEffect(() => {
    if (!isEditingTaste) return;
    const newInst = generateInstructions(tasteAnswers);
    setEditableInstructions(newInst);
  }, [tasteAnswers, isEditingTaste]);

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
      extendedThinking,
    };
    setAIProvider(config);
    showToast("AI provider saved");
  };

  const saveInstructions = () => {
    setInstructions(editableInstructions);
    setIsEditingInstructions(false);
    showToast("Instructions saved");
  };

  const saveTaste = () => {
    setSetupAnswers(tasteAnswers);
    setInstructions(editableInstructions);
    setIsEditingTaste(false);
    showToast("Taste preferences saved — instructions regenerated");
  };

  const cancelTaste = () => {
    setTasteAnswers({ ...defaultSetupAnswers(), ...state.setupAnswers });
    setEditableInstructions(state.instructions);
    setIsEditingTaste(false);
  };

  const regenerateInstructions = () => {
    if (!state.setupAnswers) {
      showToast("No setup answers found — re-run setup to regenerate", "error");
      return;
    }
    const newInst = generateInstructions(state.setupAnswers);
    setEditableInstructions(newInst);
    setInstructions(newInst);
    showToast("Instructions regenerated from your preferences");
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

        <ToggleRow onClick={() => setExtendedThinking((v) => !v)}>
          <ToggleTrack $on={extendedThinking}>
            <ToggleThumb $on={extendedThinking} />
          </ToggleTrack>
          <div>
            <ToggleLabel>Think More mode</ToggleLabel>
            <br />
            <ToggleDesc>
              AI reasons more deeply before responding — more thorough but slower and costlier.
            </ToggleDesc>
          </div>
        </ToggleRow>

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

        {!isEditingTaste ? (
          <>
            <TasteSummary>
              <TasteChip>
                <TasteChipLabel>Play style</TasteChipLabel>
                {tasteAnswers.playStyle}
              </TasteChip>
              <TasteChip>
                <TasteChipLabel>Difficulty</TasteChipLabel>
                {tasteAnswers.difficultyPreference}
              </TasteChip>
              <TasteChip>
                <TasteChipLabel>Length</TasteChipLabel>
                {tasteAnswers.idealLength}
              </TasteChip>
              <TasteChip>
                <TasteChipLabel>Voice acting</TasteChipLabel>
                {tasteAnswers.voiceActingPreference.replace(/_/g, " ")}
              </TasteChip>
              <TasteChip>
                <TasteChipLabel>Story</TasteChipLabel>
                {tasteAnswers.storyImportance}/5
              </TasteChip>
              <TasteChip>
                <TasteChipLabel>Gameplay</TasteChipLabel>
                {tasteAnswers.gameplayImportance}/5
              </TasteChip>
              <TasteChip>
                <TasteChipLabel>Exploration</TasteChipLabel>
                {tasteAnswers.explorationImportance}/5
              </TasteChip>
              <TasteChip>
                <TasteChipLabel>Combat</TasteChipLabel>
                {tasteAnswers.combatImportance}/5
              </TasteChip>
              <TasteChip>
                <TasteChipLabel>Puzzles</TasteChipLabel>
                {tasteAnswers.puzzleImportance}/5
              </TasteChip>
              <TasteChip>
                <TasteChipLabel>Strategy</TasteChipLabel>
                {tasteAnswers.strategyImportance}/5
              </TasteChip>
              {tasteAnswers.dealbreakers?.length > 0 && (
                <TasteChip style={{ gridColumn: "1 / -1" }}>
                  <TasteChipLabel>Dealbreakers</TasteChipLabel>
                  {tasteAnswers.dealbreakers.join(", ").replace(/_/g, " ")}
                </TasteChip>
              )}
              {tasteAnswers.customDealbreakers?.length > 0 && (
                <TasteChip style={{ gridColumn: "1 / -1" }}>
                  <TasteChipLabel>Custom dealbreakers</TasteChipLabel>
                  {tasteAnswers.customDealbreakers.join(", ")}
                </TasteChip>
              )}
            </TasteSummary>
            <BtnRow>
              <Btn $variant="secondary" onClick={() => setIsEditingTaste(true)}>
                <Icon name="edit" size={14} /> Edit Preferences
              </Btn>
            </BtnRow>
          </>
        ) : (
          <TasteEditor>
            <StepPreferences answers={tasteAnswers} setAnswers={setTasteAnswers} />
            <BtnRow>
              <Btn $variant="primary" onClick={saveTaste}>
                Save Preferences
              </Btn>
              <Btn $variant="secondary" onClick={cancelTaste}>
                Cancel
              </Btn>
            </BtnRow>
          </TasteEditor>
        )}
      </Section>

      <Section>
        <SectionTitle>Analysis Instructions</SectionTitle>
        <SectionDesc>
          These instructions are sent to the AI along with your game library when analyzing a game.
          They define how the AI evaluates games for you.
        </SectionDesc>

        {isEditingInstructions ? (
          <TextArea
            value={editableInstructions}
            onChange={(e) => setEditableInstructions(e.target.value)}
          />
        ) : (
          <InstructionsPreview>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{editableInstructions}</ReactMarkdown>
          </InstructionsPreview>
        )}

        <BtnRow>
          {isEditingInstructions ? (
            <>
              <Btn $variant="primary" onClick={saveInstructions}>
                Save Instructions
              </Btn>
              <Btn
                $variant="secondary"
                onClick={() => {
                  setEditableInstructions(state.instructions);
                  setIsEditingInstructions(false);
                }}
              >
                Cancel
              </Btn>
            </>
          ) : (
            <>
              <Btn $variant="secondary" onClick={() => setIsEditingInstructions(true)}>
                Edit Instructions
              </Btn>
              <Btn $variant="secondary" onClick={regenerateInstructions}>
                Regenerate from Preferences
              </Btn>
            </>
          )}
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
