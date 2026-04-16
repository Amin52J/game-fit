"use client";

import styled, { keyframes } from "styled-components";
import { PageTitle, SectionTitle, ButtonRow } from "@/shared/ui";
import type { Theme } from "@/shared/config/theme";

export const SettingsPageTitle = styled(PageTitle)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const KeyFieldWrap = styled.div`
  position: relative;
`;

export const RevealKeyButton = styled.button`
  position: absolute;
  right: calc(${({ theme }) => theme.spacing.sm} + 2px);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  font-size: 0.8rem;
`;

export const MarginedButtonRow = styled(ButtonRow)`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const DangerSectionTitle = styled(SectionTitle)`
  color: ${({ theme }) => theme.colors.error};
`;

export const FormRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

export const FormGroup = styled.div`
  flex: 1;
  min-width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    min-width: 200px;
  }
`;

const toastSlideIn = (theme: Theme) => keyframes`
  from {
    opacity: 0;
    transform: translateX(-50%)
      translateY(calc(-1 * (${theme.spacing.sm} + ${theme.spacing.xs})));
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

export const Toast = styled.div<{ $type: "success" | "error" }>`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  left: 50%;
  transform: translateX(-50%);
  z-index: 900;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $type }) =>
    $type === "success" ? theme.colors.successMuted : theme.colors.errorMuted};
  border: 1px solid
    ${({ theme, $type }) => ($type === "success" ? theme.colors.success : theme.colors.error)};
  color: ${({ theme, $type }) => ($type === "success" ? theme.colors.success : theme.colors.error)};
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: ${({ theme }) => theme.shadow.md};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  animation: ${({ theme }) => toastSlideIn(theme)} 250ms ease;
  pointer-events: none;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    left: calc(50% + ${({ theme }) => theme.spacing.xl});
    padding: 10px ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    left: calc(50% + 120px);
  }
`;

export const TrialStatusBox = styled.div<{ $exhausted: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 0.8125rem;
  line-height: 1.55;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ theme, $exhausted }) =>
      $exhausted ? theme.colors.warning : theme.colors.accent};
  background: ${({ theme, $exhausted }) =>
    $exhausted ? theme.colors.warningMuted : theme.colors.accentMuted};
  color: ${({ theme }) => theme.colors.textSecondary};

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;
