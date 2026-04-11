"use client";

import styled, { css, keyframes } from "styled-components";

const stepSlideIn = keyframes`
  from { opacity: 0; transform: translateX(12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

export const Page = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bg};
  font-family: ${({ theme }) => theme.font.sans};

  @media (max-width: 767px) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm};
  }
`;

export const Center = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

export const Hero = styled.header`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 767px) {
    font-size: 1.4rem;
  }
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadow.lg};

  @media (max-width: 767px) {
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radius.lg};
  }
`;

export const StepContent = styled.div`
  animation: ${stepSlideIn} 250ms ease;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: 1.0625rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const SectionHint = styled.p`
  margin: ${({ theme }) => `-${theme.spacing.sm}`} 0 ${({ theme }) => theme.spacing.md};
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const SectionHintTightBottom = styled(SectionHint)`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  & > * {
    flex: 1;
    min-width: 140px;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const BaseField = css`
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

export const TextInput = styled.input`
  ${BaseField}
`;

export const FlexGrowTextInput = styled(TextInput)`
  flex: 1;
`;

export const SelectInput = styled.select`
  ${BaseField};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238888a8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${({ theme }) => theme.spacing.md} center;
  padding-right: ${({ theme }) => theme.spacing.xl};
`;

export const TextAreaField = styled.textarea`
  ${BaseField};
  min-height: 120px;
  resize: vertical;
  line-height: 1.5;
`;

export const PasswordWrap = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: stretch;
`;

export const PasswordInput = styled(TextInput)`
  flex: 1;
`;

export const IconButton = styled.button`
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

export const NavRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 767px) {
    margin-top: ${({ theme }) => theme.spacing.lg};
    padding-top: ${({ theme }) => theme.spacing.md};
  }
`;

export const NavRowActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: calc(${({ theme }) => theme.spacing.sm} + ${({ theme }) => theme.spacing.xs});
`;

export const Btn = styled.button<{
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

export const NoteBox = styled.div`
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

export const StatusPill = styled.span<{ $ok?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme, $ok }) => ($ok ? theme.colors.success : theme.colors.error)};
`;

export const StatusPillTopMd = styled(StatusPill)`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const InlineActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

/* Stepper */

export const Stepper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 767px) {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

export const StepItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
`;

export const StepTrack = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const StepCircle = styled.div<{ $state: "done" | "current" | "todo" }>`
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

  @media (max-width: 767px) {
    width: 30px;
    height: 30px;
    font-size: 0.75rem;
  }
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

export const StepLine = styled.div<{ $filled: boolean }>`
  flex: 1;
  height: 2px;
  margin: 0 -2px;
  background: ${({ theme, $filled }) => ($filled ? theme.colors.accent : theme.colors.border)};
  align-self: center;
  min-width: 8px;
  transition: background ${({ theme }) => theme.transition.normal};
`;

export const StepLabel = styled.span<{ $active: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
  color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.textMuted)};
  line-height: 1.2;

  @media (max-width: 767px) {
    font-size: 0.5625rem;
  }
`;

/* Provider cards */

export const ProviderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const ProviderCard = styled.button<{ $selected: boolean }>`
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

export const ProviderName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const ProviderDesc = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.4;
`;

/* Help guide */

export const HelpToggle = styled.button`
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

export const HelpPanel = styled.div`
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

export const HelpStepList = styled.ol`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  padding-left: 1.25rem;
`;

export const HelpStepItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const HelpHeading = styled.strong`
  color: ${({ theme }) => theme.colors.text};
`;

export const HelpRecommendNote = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

/* Preferences */

export const PlayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const OptionCard = styled.button<{ $selected: boolean }>`
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

  @media (max-width: 1024px) {
    &:hover, &:active { transform: none; }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const OptionCardTitle = styled.div`
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const OptionCardDesc = styled.div`
  font-size: 0.75rem;
  color: inherit;
  opacity: 0.75;
`;

export const SliderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const SliderField = styled.div``;

export const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const SliderName = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

export const SliderValue = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  font-variant-numeric: tabular-nums;
`;

export const RangeInput = styled.input`
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

export const ChipGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Chip = styled.button<{ $on: boolean }>`
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

export const OptionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const PillBtn = styled.button<{ $selected: boolean }>`
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

export const CustomDealbreakersRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: stretch;
`;

export const SpacingTopMd = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const CustomChipWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const CustomChip = styled.span`
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

export const RemoveBtn = styled.button`
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

/* Currency dropdown */

export const CurrencyWrap = styled.div`
  position: relative;
`;

export const CurrencyDropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 20;
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  list-style: none;
  max-height: 220px;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
`;

export const CurrencyOption = styled.li<{ $highlighted: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  background: ${({ theme, $highlighted }) =>
    $highlighted ? theme.colors.accentMuted : "transparent"};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

/* Library step */

export const DropZone = styled.div<{ $active: boolean }>`
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

export const DropTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const DropHint = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;

export const PreviewBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

export const PreviewTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const PreviewList = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
`;

export const BucketRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const PlatformSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const PlatformRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const EpicAuthStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const EpicAuthRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const PlatformBtn = styled.button<{ $color: string; $connected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 10px ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ $connected, theme }) => ($connected ? theme.colors.success : theme.colors.border)};
  background: ${({ $color, $connected }) => ($connected ? "transparent" : $color)};
  color: ${({ $connected, theme }) => ($connected ? theme.colors.success : theme.colors.text)};
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 1024px) {
    &:hover:not(:disabled) { transform: none; }
  }

  svg { fill: currentColor; }
`;

export const PlatformGuideBox = styled.details`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  padding: 0;

  &[open] summary { margin-bottom: ${({ theme }) => theme.spacing.sm}; }
`;

export const PlatformGuideSummary = styled.summary`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 10px 14px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker { display: none; }
  &::marker { content: ""; }
`;

export const PlatformGuideContent = styled.div`
  padding: 0 14px 14px;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;

  ol { margin: 0; padding-left: 1.2rem; }
  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; &:hover { text-decoration: underline; } }
`;

export const PlatformStatusText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  padding-left: ${({ theme }) => theme.spacing.xs};
`;

/* Review step */

export const SummaryList = styled.ul`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const SummaryItem = styled.li`
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

export const InstructionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const InstructionsTextArea = styled.textarea<{ $readOnly?: boolean }>`
  ${BaseField};
  min-height: 280px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 0.8125rem;
  line-height: 1.55;
  resize: vertical;
  opacity: ${({ $readOnly }) => ($readOnly ? 0.92 : 1)};
`;
