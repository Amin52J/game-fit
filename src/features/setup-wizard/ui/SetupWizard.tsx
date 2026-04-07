"use client";

import React, { useCallback, useMemo, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/providers/AppProvider";
import { generateInstructions } from "@/features/setup-wizard/lib/prompt-generator";
import { parseAnyFormat } from "@/entities/game/lib/csv-parser";
import { AIClient } from "@/entities/ai-provider/api/client";
import type { AIProviderConfig, AIProviderType, Game, SetupAnswers } from "@/shared/types";
import { DEFAULT_MODELS, DEALBREAKER_OPTIONS } from "@/shared/types";
import { Icon } from "@/shared/ui";

const STEPS = [
  { id: 1, label: "AI Provider" },
  { id: 2, label: "Preferences" },
  { id: 3, label: "Library" },
  { id: 4, label: "Review" },
] as const;

export function defaultSetupAnswers(): SetupAnswers {
  return {
    playStyle: "singleplayer",
    storyImportance: 3,
    gameplayImportance: 3,
    explorationImportance: 3,
    combatImportance: 3,
    puzzleImportance: 3,
    strategyImportance: 3,
    dealbreakers: [],
    customDealbreakers: [],
    voiceActingPreference: "preferred",
    difficultyPreference: "moderate",
    idealLength: "medium",
    currency: "EUR",
    region: "Germany",
    additionalNotes: "",
  };
}

function defaultAiConfig(): AIProviderConfig {
  return {
    type: "anthropic",
    apiKey: "",
    model: DEFAULT_MODELS.anthropic[0] ?? "",
    baseUrl: "",
    extendedThinking: false,
  };
}

function mergeGameLists(a: Game[], b: Game[]): Game[] {
  const map = new Map<string, Game>();
  const keyOf = (name: string) => name.trim().toLowerCase();
  for (const g of a) {
    map.set(keyOf(g.name), g);
  }
  for (const g of b) {
    const k = keyOf(g.name);
    const prev = map.get(k);
    if (!prev) {
      map.set(k, g);
      continue;
    }
    const ps = prev.score ?? -Infinity;
    const gs = g.score ?? -Infinity;
    map.set(k, gs > ps ? { ...g, id: prev.id } : prev);
  }
  return Array.from(map.values());
}

function computeScoreBuckets(games: Game[]) {
  const buckets = {
    b0_25: 0,
    b26_50: 0,
    b51_75: 0,
    b76_100: 0,
    unscored: 0,
  };
  for (const g of games) {
    if (g.score === null || g.score === undefined || Number.isNaN(g.score)) {
      buckets.unscored += 1;
      continue;
    }
    const s = g.score;
    if (s <= 25) buckets.b0_25 += 1;
    else if (s <= 50) buckets.b26_50 += 1;
    else if (s <= 75) buckets.b51_75 += 1;
    else buckets.b76_100 += 1;
  }
  return buckets;
}

/* ——— Layout ——— */

const Page = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bg};
  font-family: ${({ theme }) => theme.font.sans};
`;

const Center = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Hero = styled.header`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const stepSlideIn = keyframes`
  from { opacity: 0; transform: translateX(12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadow.lg};
`;

const StepContent = styled.div`
  animation: ${stepSlideIn} 250ms ease;
`;

const SectionTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: 1.0625rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const SectionHint = styled.p`
  margin: ${({ theme }) => `-${theme.spacing.sm}`} 0 ${({ theme }) => theme.spacing.md};
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  & > * {
    flex: 1;
    min-width: 140px;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const BaseField = css`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  outline: none;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentMuted};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const TextInput = styled.input`
  ${BaseField}
`;

const SelectInput = styled.select`
  ${BaseField};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238888a8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${({ theme }) => theme.spacing.md} center;
  padding-right: ${({ theme }) => theme.spacing.xl};
`;

const TextAreaField = styled.textarea`
  ${BaseField};
  min-height: 120px;
  resize: vertical;
  line-height: 1.5;
`;

const PasswordWrap = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: stretch;
`;

const PasswordInput = styled(TextInput)`
  flex: 1;
`;

const IconButton = styled.button`
  flex-shrink: 0;
  padding: 0 ${({ theme }) => theme.spacing.md};
  font-size: 0.75rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.font.sans};
  color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transition.fast},
    border-color ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    border-color: ${({ theme }) => theme.colors.borderLight};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const NavRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Btn = styled.button<{
  $variant?: "primary" | "secondary" | "ghost";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  min-height: 44px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background ${({ theme }) => theme.transition.fast},
    border-color ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast},
    opacity ${({ theme }) => theme.transition.fast};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  ${({ theme, $variant = "secondary" }) =>
    $variant === "primary"
      ? css`
          background: ${theme.colors.accent};
          color: ${theme.colors.text};
          &:hover:not(:disabled) {
            background: ${theme.colors.accentHover};
          }
        `
      : $variant === "ghost"
        ? css`
            background: transparent;
            color: ${theme.colors.textSecondary};
            border-color: transparent;
            &:hover:not(:disabled) {
              color: ${theme.colors.text};
              background: ${theme.colors.accentMuted};
            }
          `
        : css`
            background: ${theme.colors.surface};
            color: ${theme.colors.text};
            border-color: ${theme.colors.border};
            &:hover:not(:disabled) {
              background: ${theme.colors.surfaceHover};
              border-color: ${theme.colors.borderLight};
            }
          `}
`;

const NoteBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  font-size: 0.8125rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  margin-top: ${({ theme }) => theme.spacing.sm};

  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const StatusPill = styled.span<{ $ok?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme, $ok }) => ($ok ? theme.colors.success : theme.colors.error)};
`;

const InlineActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

/* ——— Stepper ——— */

const Stepper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StepItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
`;

const StepTrack = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const StepCircle = styled.div<{ $state: "done" | "current" | "todo" }>`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.8125rem;
  font-weight: 700;
  z-index: 1;
  transition:
    background ${({ theme }) => theme.transition.fast},
    border-color ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  ${({ theme, $state }) =>
    $state === "current"
      ? css`
          background: ${theme.colors.accent};
          border: 2px solid ${theme.colors.accent};
          color: ${theme.colors.text};
          box-shadow: ${theme.shadow.glow};
        `
      : $state === "done"
        ? css`
            background: ${theme.colors.accentMuted};
            border: 2px solid ${theme.colors.accent};
            color: ${theme.colors.accent};
          `
        : css`
            background: transparent;
            border: 2px solid ${theme.colors.border};
            color: ${theme.colors.textMuted};
          `}
`;

const StepLine = styled.div<{ $filled: boolean }>`
  flex: 1;
  height: 2px;
  margin: 0 -2px;
  background: ${({ theme, $filled }) => ($filled ? theme.colors.accent : theme.colors.border)};
  align-self: center;
  min-width: 8px;
  transition: background ${({ theme }) => theme.transition.normal};
`;

const StepLabel = styled.span<{ $active: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
  color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.textMuted)};
  line-height: 1.2;
`;

function ProgressStepper({ currentStep }: { currentStep: number }) {
  return (
    <Stepper role="navigation" aria-label="Setup progress">
      {STEPS.map((s, i) => {
        const stepNum = s.id;
        const state = stepNum < currentStep ? "done" : stepNum === currentStep ? "current" : "todo";
        const isLast = i === STEPS.length - 1;
        return (
          <StepItem key={s.id}>
            <StepTrack>
              <StepCircle $state={state} aria-current={state === "current" ? "step" : undefined}>
                {stepNum < currentStep ? <Icon name="check" size={14} /> : stepNum}
              </StepCircle>
              {!isLast ? <StepLine $filled={stepNum < currentStep} aria-hidden /> : null}
            </StepTrack>
            <StepLabel $active={stepNum <= currentStep}>{s.label}</StepLabel>
          </StepItem>
        );
      })}
    </Stepper>
  );
}

/* ——— Step 1: Provider cards ——— */

const ProviderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ProviderCard = styled.button<{ $selected: boolean }>`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  cursor: pointer;
  font-family: ${({ theme }) => theme.font.sans};
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.accent : theme.colors.border)};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.accentMuted : theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    background ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderLight};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  ${({ theme, $selected }) =>
    $selected &&
    css`
      box-shadow: 0 0 0 3px ${theme.colors.accentMuted};
    `}

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const ProviderName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProviderDesc = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.4;
`;

/* ——— Toggle switch ——— */

const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  user-select: none;
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

const ToggleLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ToggleTitle = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const ToggleDesc = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.4;
`;

/* ——— Help guide ——— */

const HelpToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 0;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  margin-top: ${({ theme }) => theme.spacing.xs};

  &:hover {
    text-decoration: underline;
  }
`;

const HelpPanel = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.8125rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};

  a {
    color: ${({ theme }) => theme.colors.accent};
    &:hover { text-decoration: underline; }
  }
`;

const HelpStepList = styled.ol`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  padding-left: 1.25rem;
`;

const HelpStepItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const HelpHeading = styled.strong`
  color: ${({ theme }) => theme.colors.text};
`;

/* ——— Step 2: option cards & chips ——— */

const PlayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const OptionCard = styled.button<{ $selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.accent : theme.colors.border)};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.accentMuted : theme.colors.surface};
  cursor: pointer;
  font-family: ${({ theme }) => theme.font.sans};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    background ${({ theme }) => theme.transition.fast},
    transform ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0) scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const SliderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SliderField = styled.div``;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SliderName = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const SliderValue = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  font-variant-numeric: tabular-nums;
`;

const RangeInput = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  appearance: none;
  background: ${({ theme }) => theme.colors.border};
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accent};
    border: 2px solid ${({ theme }) => theme.colors.surfaceElevated};
    box-shadow: ${({ theme }) => theme.shadow.sm};
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accent};
    border: 2px solid ${({ theme }) => theme.colors.surfaceElevated};
  }
`;

const ChipGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Chip = styled.button<{ $on: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.8125rem;
  font-family: ${({ theme }) => theme.font.sans};
  text-align: left;
  cursor: pointer;
  border: 1px solid ${({ theme, $on }) => ($on ? theme.colors.accent : theme.colors.border)};
  background: ${({ theme, $on }) => ($on ? theme.colors.accentMuted : theme.colors.surface)};
  color: ${({ theme }) => theme.colors.text};
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    background ${({ theme }) => theme.transition.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderLight};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const OptionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PillBtn = styled.button<{ $selected: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.accent : theme.colors.border)};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.accentMuted : theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    background ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

/* ——— Custom dealbreakers ——— */

const CustomDealbreakersRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: stretch;
`;

const CustomChipWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const CustomChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  font-size: 0.8125rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentMuted};
  color: ${({ theme }) => theme.colors.text};
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

/* ——— Step 3: dropzone ——— */

const DropZone = styled.div<{ $active: boolean }>`
  border: 2px dashed
    ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  cursor: pointer;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentMuted : theme.colors.surface};
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    background ${({ theme }) => theme.transition.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderLight};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const DropTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const DropHint = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;

const PreviewBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const PreviewTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PreviewList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
`;

const BucketRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ——— Step 4 ——— */

const SummaryList = styled.ul`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SummaryItem = styled.li`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }
`;

const InstructionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const InstructionsTextArea = styled.textarea<{ $readOnly?: boolean }>`
  ${BaseField};
  min-height: 280px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 0.8125rem;
  line-height: 1.55;
  resize: vertical;
  opacity: ${({ $readOnly }) => ($readOnly ? 0.92 : 1)};
`;

/* ——— Step content components ——— */

function ApiKeyGuide({ provider }: { provider: AIProviderType }) {
  const [open, setOpen] = useState(false);

  if (provider === "custom") return null;

  const guides: Record<Exclude<AIProviderType, "custom">, React.ReactNode> = {
    anthropic: (
      <HelpPanel>
        <HelpHeading>How to get an Anthropic (Claude) API key</HelpHeading>
        <HelpStepList>
          <HelpStepItem>
            Go to{" "}
            <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer">
              console.anthropic.com
            </a>{" "}
            and click <strong>Sign up</strong>. You can use your Google account or email.
          </HelpStepItem>
          <HelpStepItem>
            Once logged in, click <strong>API Keys</strong> in the left sidebar (or go to{" "}
            <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">
              Settings &rarr; API Keys
            </a>
            ).
          </HelpStepItem>
          <HelpStepItem>
            Click <strong>Create Key</strong>, give it a name (e.g. &quot;GameFit&quot;), and click{" "}
            <strong>Create</strong>.
          </HelpStepItem>
          <HelpStepItem>
            Copy the key that starts with <code>sk-ant-...</code> and paste it above.{" "}
            <em>You won&apos;t be able to see it again</em>, so save it somewhere safe.
          </HelpStepItem>
          <HelpStepItem>
            You&apos;ll need to add credit to your account. Go to{" "}
            <a href="https://console.anthropic.com/settings/billing" target="_blank" rel="noreferrer">
              Settings &rarr; Billing
            </a>{" "}
            and add a payment method. $5–10 is plenty to get started.
          </HelpStepItem>
        </HelpStepList>
        <div style={{ marginTop: 8 }}>
          <strong>Recommended model:</strong> <code>claude-sonnet-4-6</code> — fast, smart,
          and affordable ($3/M input tokens). Use <code>claude-opus-4-6</code> for the most
          intelligent analysis ($5/M input tokens).
        </div>
      </HelpPanel>
    ),
    openai: (
      <HelpPanel>
        <HelpHeading>How to get an OpenAI API key</HelpHeading>
        <HelpStepList>
          <HelpStepItem>
            Go to{" "}
            <a href="https://platform.openai.com/signup" target="_blank" rel="noreferrer">
              platform.openai.com
            </a>{" "}
            and create an account (or sign in with Google / Microsoft / Apple).
          </HelpStepItem>
          <HelpStepItem>
            In the dashboard, click your profile icon (top-right) and select{" "}
            <strong>API Keys</strong>, or go directly to{" "}
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">
              platform.openai.com/api-keys
            </a>
            .
          </HelpStepItem>
          <HelpStepItem>
            Click <strong>Create new secret key</strong>, name it (e.g. &quot;GameFit&quot;), and
            click <strong>Create</strong>.
          </HelpStepItem>
          <HelpStepItem>
            Copy the key that starts with <code>sk-...</code> and paste it above.{" "}
            <em>This is shown only once</em>, so save it somewhere safe.
          </HelpStepItem>
          <HelpStepItem>
            You&apos;ll need to add credit. Go to{" "}
            <a
              href="https://platform.openai.com/account/billing"
              target="_blank"
              rel="noreferrer"
            >
              Billing
            </a>{" "}
            and add a payment method. $5–10 is more than enough to start.
          </HelpStepItem>
        </HelpStepList>
        <div style={{ marginTop: 8 }}>
          <strong>Recommended model:</strong> <code>gpt-5.4</code> — the latest and most capable
          frontier model. Use <code>gpt-5.4-mini</code> for a cheaper, faster alternative, or{" "}
          <code>gpt-5.4-nano</code> for the cheapest option.
        </div>
      </HelpPanel>
    ),
    google: (
      <HelpPanel>
        <HelpHeading>How to get a Google (Gemini) API key</HelpHeading>
        <HelpStepList>
          <HelpStepItem>
            Go to{" "}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
              aistudio.google.com/apikey
            </a>{" "}
            and sign in with your Google account.
          </HelpStepItem>
          <HelpStepItem>
            Click <strong>Create API key</strong>. You may be asked to select a Google Cloud project
            — if you don&apos;t have one, it will create one for you automatically.
          </HelpStepItem>
          <HelpStepItem>
            Copy the generated key and paste it above. It starts with <code>AIza...</code>.
          </HelpStepItem>
          <HelpStepItem>
            Google offers a generous free tier for Gemini. For higher usage, you can enable billing
            in your{" "}
            <a href="https://console.cloud.google.com/billing" target="_blank" rel="noreferrer">
              Google Cloud Console
            </a>
            .
          </HelpStepItem>
        </HelpStepList>
        <div style={{ marginTop: 8 }}>
          <strong>Recommended model:</strong> <code>gemini-3.1-pro</code> — the most advanced,
          great for complex analysis. Use <code>gemini-3-flash</code> for frontier-class performance
          at a fraction of the cost, or <code>gemini-2.5-flash</code> for the best budget option.
        </div>
      </HelpPanel>
    ),
  };

  return (
    <div>
      <HelpToggle type="button" onClick={() => setOpen(!open)}>
        {open ? "▾ Hide" : "▸ How do I get an API key?"} step-by-step guide
      </HelpToggle>
      {open ? guides[provider] : null}
    </div>
  );
}

function StepAiProvider({
  config,
  setConfig,
  showKey,
  setShowKey,
  testStatus,
  testLoading,
  onTest,
}: {
  config: AIProviderConfig;
  setConfig: React.Dispatch<React.SetStateAction<AIProviderConfig>>;
  showKey: boolean;
  setShowKey: (v: boolean) => void;
  testStatus: "idle" | "ok" | "err";
  testLoading: boolean;
  onTest: () => void;
}) {
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
      <div>
        <SectionTitle>AI provider</SectionTitle>
        <SectionHint>Choose a provider and connect your API key. GameFit supports all major AI providers.</SectionHint>
        <ProviderGrid>
          <ProviderCard
            type="button"
            $selected={config.type === "anthropic"}
            onClick={() => setType("anthropic")}
          >
            <ProviderName>Anthropic</ProviderName>
            <ProviderDesc>Claude Sonnet 4.6, Opus 4.6, Haiku 4.5</ProviderDesc>
          </ProviderCard>
          <ProviderCard
            type="button"
            $selected={config.type === "openai"}
            onClick={() => setType("openai")}
          >
            <ProviderName>OpenAI</ProviderName>
            <ProviderDesc>GPT-5.4, GPT-5, o3, and more</ProviderDesc>
          </ProviderCard>
          <ProviderCard
            type="button"
            $selected={config.type === "google"}
            onClick={() => setType("google")}
          >
            <ProviderName>Google</ProviderName>
            <ProviderDesc>Gemini 3.1 Pro, 3 Flash, 2.5 Pro</ProviderDesc>
          </ProviderCard>
          <ProviderCard
            type="button"
            $selected={config.type === "custom"}
            onClick={() => setType("custom")}
          >
            <ProviderName>Custom</ProviderName>
            <ProviderDesc>Any OpenAI-compatible endpoint</ProviderDesc>
          </ProviderCard>
        </ProviderGrid>
      </div>

      <div>
        <Label htmlFor="gf-api-key">API key</Label>
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
              <option key={m} value={m}>
                {m}
              </option>
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

      <ToggleRow onClick={() => setConfig((c) => ({ ...c, extendedThinking: !c.extendedThinking }))}>
        <ToggleTrack $on={!!config.extendedThinking}>
          <ToggleThumb $on={!!config.extendedThinking} />
        </ToggleTrack>
        <ToggleLabel>
          <ToggleTitle>Think More mode</ToggleTitle>
          <ToggleDesc>
            The AI will reason more deeply before responding — produces more thorough analysis but
            takes longer and costs more per request.
          </ToggleDesc>
        </ToggleLabel>
      </ToggleRow>

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
    </FieldGroup>
  );
}

export function StepPreferences({
  answers,
  setAnswers,
}: {
  answers: SetupAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<SetupAnswers>>;
}) {
  const toggleDealbreaker = (id: string) => {
    setAnswers((a) => {
      const has = a.dealbreakers.includes(id);
      return {
        ...a,
        dealbreakers: has ? a.dealbreakers.filter((x) => x !== id) : [...a.dealbreakers, id],
      };
    });
  };

  const setSlider = (key: keyof SetupAnswers, value: number) => {
    setAnswers((a) => ({ ...a, [key]: value }));
  };

  return (
    <FieldGroup>
      <div>
        <SectionTitle>Play style</SectionTitle>
        <PlayGrid>
          {(
            [
              { v: "singleplayer" as const, t: "Single-player", d: "Solo campaigns & stories" },
              { v: "multiplayer" as const, t: "Multiplayer", d: "MP, co-op, live games" },
              { v: "both" as const, t: "Both", d: "Mix of SP and MP" },
            ] as const
          ).map((opt) => (
            <OptionCard
              key={opt.v}
              type="button"
              $selected={answers.playStyle === opt.v}
              onClick={() => setAnswers((a) => ({ ...a, playStyle: opt.v }))}
            >
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{opt.t}</div>
              <div style={{ fontSize: "0.75rem", color: "inherit", opacity: 0.75 }}>{opt.d}</div>
            </OptionCard>
          ))}
        </PlayGrid>
      </div>

      <div>
        <SectionTitle>What matters most? (1–5)</SectionTitle>
        <SliderGrid>
          {(
            [
              ["storyImportance", "Story & narrative"],
              ["gameplayImportance", "Gameplay mechanics"],
              ["explorationImportance", "Exploration"],
              ["combatImportance", "Combat"],
              ["puzzleImportance", "Puzzles"],
              ["strategyImportance", "Strategy"],
            ] as const
          ).map(([key, label]) => (
            <SliderField key={key}>
              <SliderLabels>
                <SliderName>{label}</SliderName>
                <SliderValue>{answers[key]}</SliderValue>
              </SliderLabels>
              <RangeInput
                type="range"
                min={1}
                max={5}
                step={1}
                value={answers[key]}
                onChange={(e) => setSlider(key, Number(e.target.value))}
              />
            </SliderField>
          ))}
        </SliderGrid>
      </div>

      <div>
        <SectionTitle>Dealbreakers</SectionTitle>
        <SectionHint>
          Tap anything you want the assistant to treat as a strong negative signal.
        </SectionHint>
        <ChipGrid>
          {DEALBREAKER_OPTIONS.map((opt) => (
            <Chip
              key={opt.id}
              type="button"
              $on={answers.dealbreakers.includes(opt.id)}
              onClick={() => toggleDealbreaker(opt.id)}
            >
              {opt.label}
            </Chip>
          ))}
        </ChipGrid>

        <div style={{ marginTop: 16 }}>
          <Label>Custom dealbreakers</Label>
          <SectionHint style={{ margin: "0 0 8px" }}>
            Add your own — press Enter or click Add after each one.
          </SectionHint>
          <CustomDealbreakersRow>
            <TextInput
              id="gf-custom-dealbreaker"
              placeholder="e.g. No underwater levels"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val && !answers.customDealbreakers.includes(val)) {
                    setAnswers((a) => ({ ...a, customDealbreakers: [...a.customDealbreakers, val] }));
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
            />
            <Btn
              type="button"
              $variant="secondary"
              onClick={() => {
                const input = document.getElementById("gf-custom-dealbreaker") as HTMLInputElement;
                const val = input?.value.trim();
                if (val && !answers.customDealbreakers.includes(val)) {
                  setAnswers((a) => ({ ...a, customDealbreakers: [...a.customDealbreakers, val] }));
                  input.value = "";
                }
              }}
            >
              Add
            </Btn>
          </CustomDealbreakersRow>
          {answers.customDealbreakers.length > 0 && (
            <CustomChipWrap>
              {answers.customDealbreakers.map((d) => (
                <CustomChip key={d}>
                  {d}
                  <RemoveBtn
                    type="button"
                    onClick={() =>
                      setAnswers((a) => ({
                        ...a,
                        customDealbreakers: a.customDealbreakers.filter((x) => x !== d),
                      }))
                    }
                  >
                    ×
                  </RemoveBtn>
                </CustomChip>
              ))}
            </CustomChipWrap>
          )}
        </div>
      </div>

      <div>
        <SectionTitle>Voice acting</SectionTitle>
        <OptionRow>
          {(
            [
              ["essential", "Essential"],
              ["preferred", "Preferred"],
              ["indifferent", "Indifferent"],
              ["fine_with_text", "Fine with text"],
            ] as const
          ).map(([v, label]) => (
            <PillBtn
              key={v}
              type="button"
              $selected={answers.voiceActingPreference === v}
              onClick={() => setAnswers((a) => ({ ...a, voiceActingPreference: v }))}
            >
              {label}
            </PillBtn>
          ))}
        </OptionRow>
      </div>

      <div>
        <SectionTitle>Difficulty appetite</SectionTitle>
        <OptionRow>
          {(
            [
              ["easy", "Easy"],
              ["moderate", "Moderate"],
              ["challenging", "Challenging"],
              ["soulslike", "Souls-like"],
            ] as const
          ).map(([v, label]) => (
            <PillBtn
              key={v}
              type="button"
              $selected={answers.difficultyPreference === v}
              onClick={() => setAnswers((a) => ({ ...a, difficultyPreference: v }))}
            >
              {label}
            </PillBtn>
          ))}
        </OptionRow>
      </div>

      <div>
        <SectionTitle>Ideal campaign length</SectionTitle>
        <OptionRow>
          {(
            [
              ["short", "Short (<10h)"],
              ["medium", "Medium (10–25h)"],
              ["long", "Long (25h+)"],
              ["any", "Any"],
            ] as const
          ).map(([v, label]) => (
            <PillBtn
              key={v}
              type="button"
              $selected={answers.idealLength === v}
              onClick={() => setAnswers((a) => ({ ...a, idealLength: v }))}
            >
              {label}
            </PillBtn>
          ))}
        </OptionRow>
      </div>

      <Row>
        <div>
          <Label htmlFor="gf-currency">Currency</Label>
          <TextInput
            id="gf-currency"
            value={answers.currency}
            onChange={(e) => setAnswers((a) => ({ ...a, currency: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="gf-region">Region</Label>
          <TextInput
            id="gf-region"
            value={answers.region}
            onChange={(e) => setAnswers((a) => ({ ...a, region: e.target.value }))}
          />
        </div>
      </Row>

      <div>
        <Label htmlFor="gf-notes">Additional notes (optional)</Label>
        <TextAreaField
          id="gf-notes"
          rows={3}
          placeholder="Anything else the assistant should know about your taste…"
          value={answers.additionalNotes}
          onChange={(e) => setAnswers((a) => ({ ...a, additionalNotes: e.target.value }))}
        />
      </div>
    </FieldGroup>
  );
}

function StepImportLibrary({
  importedGames,
  setImportedGames,
  pasteText,
  setPasteText,
  parseError,
  setParseError,
}: {
  importedGames: Game[];
  setImportedGames: React.Dispatch<React.SetStateAction<Game[]>>;
  pasteText: string;
  setPasteText: (v: string) => void;
  parseError: string | null;
  setParseError: (v: string | null) => void;
}) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setParseError(null);
      try {
        const texts = await Promise.all(acceptedFiles.map((f) => f.text()));
        let combined: Game[] = [];
        for (const raw of texts) {
          const parsed = parseAnyFormat(raw);
          combined = mergeGameLists(combined, parsed);
        }
        setImportedGames((prev) => mergeGameLists(prev, combined));
      } catch {
        setParseError("Could not read one or more files.");
      }
    },
    [setImportedGames, setParseError],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/*": [".csv", ".txt", ".json"], "application/json": [".json"] },
    multiple: true,
  });

  const applyPaste = () => {
    setParseError(null);
    try {
      const parsed = parseAnyFormat(pasteText);
      setImportedGames((prev) => mergeGameLists(prev, parsed));
    } catch {
      setParseError("Could not parse pasted content.");
    }
  };

  const buckets = useMemo(() => computeScoreBuckets(importedGames), [importedGames]);
  const previewNames = importedGames.slice(0, 6);

  return (
    <FieldGroup>
      <SectionTitle>Import your library</SectionTitle>
      <SectionHint>
        Drop a CSV export, JSON list, or plain text (one game per line). You can skip and add games
        later.
      </SectionHint>

      <DropZone {...getRootProps()} $active={isDragActive}>
        <input {...getInputProps()} />
        <DropTitle>{isDragActive ? "Drop files here" : "Drag & drop files"}</DropTitle>
        <DropHint>
          CSV, JSON, or plain text · multiple files merge and de-duplicate by title
        </DropHint>
      </DropZone>

      <div>
        <Label htmlFor="gf-paste">Or paste data</Label>
        <TextAreaField
          id="gf-paste"
          rows={5}
          placeholder="Paste CSV, JSON array, or one game per line…"
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
        />
        <InlineActions>
          <Btn type="button" $variant="secondary" onClick={applyPaste}>
            Parse pasted text
          </Btn>
          <Btn type="button" $variant="ghost" onClick={() => setImportedGames([])}>
            Clear imported games
          </Btn>
        </InlineActions>
        {parseError ? <StatusPill>{parseError}</StatusPill> : null}
      </div>

      {importedGames.length > 0 ? (
        <PreviewBox>
          <PreviewTitle>
            Preview · {importedGames.length} game{importedGames.length === 1 ? "" : "s"}
          </PreviewTitle>
          <PreviewList>
            {previewNames.map((g) => (
              <li key={g.id}>
                {g.name}
                {g.score !== null && g.score !== undefined ? ` — ${g.score}/100` : ""}
              </li>
            ))}
            {importedGames.length > previewNames.length ? (
              <li>…and {importedGames.length - previewNames.length} more</li>
            ) : null}
          </PreviewList>
          <BucketRow>
            <span>Scores: 0–25: {buckets.b0_25}</span>
            <span>26–50: {buckets.b26_50}</span>
            <span>51–75: {buckets.b51_75}</span>
            <span>76–100: {buckets.b76_100}</span>
            <span>Unscored: {buckets.unscored}</span>
          </BucketRow>
        </PreviewBox>
      ) : null}
    </FieldGroup>
  );
}

function StepReview({
  aiConfig,
  importedGames,
  answers,
  instructionsDraft,
  setInstructionsDraft,
  editingInstructions,
  setEditingInstructions,
}: {
  aiConfig: AIProviderConfig;
  importedGames: Game[];
  answers: SetupAnswers;
  instructionsDraft: string;
  setInstructionsDraft: (v: string) => void;
  editingInstructions: boolean;
  setEditingInstructions: (v: boolean) => void;
}) {
  const providerLabel =
    aiConfig.type === "anthropic"
      ? "Anthropic (Claude)"
      : aiConfig.type === "openai"
        ? "OpenAI"
        : aiConfig.type === "google"
          ? "Google (Gemini)"
          : "Custom endpoint";

  return (
    <FieldGroup>
      <SectionTitle>Summary</SectionTitle>
      <SummaryList>
        <SummaryItem>
          <strong>Provider:</strong> {providerLabel} · model {aiConfig.model || "—"}
          {aiConfig.extendedThinking ? " · Think More enabled" : ""}
        </SummaryItem>
        <SummaryItem>
          <strong>Games:</strong> {importedGames.length} imported
        </SummaryItem>
        <SummaryItem>
          <strong>Play style:</strong> {answers.playStyle} · <strong>Difficulty:</strong>{" "}
          {answers.difficultyPreference} · <strong>Length:</strong> {answers.idealLength}
        </SummaryItem>
        <SummaryItem>
          <strong>Pricing context:</strong> {answers.currency} · {answers.region}
        </SummaryItem>
      </SummaryList>

      <div>
        <InstructionsHeader>
          <SectionTitle style={{ margin: 0 }}>Generated instructions</SectionTitle>
          <Btn
            type="button"
            $variant="ghost"
            onClick={() => setEditingInstructions(!editingInstructions)}
          >
            {editingInstructions ? "Done editing" : "Edit instructions"}
          </Btn>
        </InstructionsHeader>
        <InstructionsTextArea
          $readOnly={!editingInstructions}
          readOnly={!editingInstructions}
          value={instructionsDraft}
          onChange={(e) => setInstructionsDraft(e.target.value)}
          spellCheck={false}
        />
      </div>
    </FieldGroup>
  );
}

/* ——— Main wizard ——— */

export function SetupWizard() {
  const router = useRouter();
  const { setAIProvider, setGames, setInstructions, setSetupAnswers, completeSetup } = useApp();

  const [step, setStep] = useState(1);
  const [aiConfig, setAiConfig] = useState<AIProviderConfig>(defaultAiConfig);
  const [answers, setAnswers] = useState<SetupAnswers>(defaultSetupAnswers);
  const [importedGames, setImportedGames] = useState<Game[]>([]);
  const [pasteText, setPasteText] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [instructionsDraft, setInstructionsDraft] = useState("");
  const [editingInstructions, setEditingInstructions] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "ok" | "err">("idle");
  const [testLoading, setTestLoading] = useState(false);
  const [step1Error, setStep1Error] = useState<string | null>(null);

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
      await client.analyze("Connection test", 0, "Reply with exactly: OK", []);
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
    if (step === 1 && !validateStep1()) return;
    if (step === 3) {
      setInstructionsDraft(generateInstructions(answers));
      setEditingInstructions(false);
    }
    setStep((s) => Math.min(4, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const skipLibrary = () => {
    setInstructionsDraft(generateInstructions(answers));
    setEditingInstructions(false);
    setStep(4);
  };

  const finish = () => {
    const cfg: AIProviderConfig = {
      type: aiConfig.type,
      apiKey: aiConfig.apiKey.trim(),
      model: aiConfig.model.trim(),
      ...(aiConfig.type === "custom" && aiConfig.baseUrl?.trim()
        ? { baseUrl: aiConfig.baseUrl.trim() }
        : {}),
      extendedThinking: !!aiConfig.extendedThinking,
    };
    setAIProvider(cfg);
    setSetupAnswers(answers);
    setGames(importedGames);
    setInstructions(instructionsDraft.trim() || generateInstructions(answers));
    completeSetup();
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
                />
                {step1Error ? <StatusPill style={{ marginTop: 16 }}>{step1Error}</StatusPill> : null}
              </>
            ) : null}
            {step === 2 ? <StepPreferences answers={answers} setAnswers={setAnswers} /> : null}
            {step === 3 ? (
              <StepImportLibrary
                importedGames={importedGames}
                setImportedGames={setImportedGames}
                pasteText={pasteText}
                setPasteText={setPasteText}
                parseError={parseError}
                setParseError={setParseError}
              />
            ) : null}
            {step === 4 ? (
              <StepReview
                aiConfig={aiConfig}
                importedGames={importedGames}
                answers={answers}
                instructionsDraft={instructionsDraft}
                setInstructionsDraft={setInstructionsDraft}
                editingInstructions={editingInstructions}
                setEditingInstructions={setEditingInstructions}
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
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
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
            </div>
          </NavRow>
        </Card>
      </Center>
    </Page>
  );
}
