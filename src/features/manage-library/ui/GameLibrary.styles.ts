"use client";

import styled from "styled-components";
import { ButtonRow } from "@/shared/ui/Layout";

export const Toolbar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ToolbarSearchWrap = styled.div`
  flex: 1 1 auto;
  max-width: min(400px, 100%);
  width: 100%;
  min-width: 0;
`;

export const TableHeaderActionsLabel = styled.span`
  text-align: right;
`;

export const Stats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 767px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  flex: 1;
  min-width: 120px;

  @media (max-width: 767px) {
    padding: ${({ theme }) => theme.spacing.sm};
    min-width: 0;
  }
`;

export const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
`;

export const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const Table = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px 80px;
  padding: 12px 20px;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 767px) {
    grid-template-columns: 1fr 50px 50px;
    padding: ${({ theme }) => theme.spacing.sm} 10px;
    font-size: 0.7rem;
  }
`;

export const SortableCol = styled.button<{ $active: boolean }>`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.textSecondary)};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  user-select: none;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const SortArrow = styled.span<{ $dir: "asc" | "desc" | null }>`
  display: inline-flex;
  align-items: center;
  opacity: ${({ $dir }) => ($dir ? 1 : 0.3)};
`;

export const FilterBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  align-items: center;
`;

export const FilterLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-right: 2px;
`;

export const Row = styled.div<{ $editing?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 100px 80px;
  padding: 10px 20px;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background ${({ theme }) => theme.transition.fast};
  background: ${({ theme, $editing }) => ($editing ? theme.colors.accentMuted : "transparent")};

  &:hover {
    background: ${({ theme, $editing }) =>
      $editing ? theme.colors.accentMuted : theme.colors.surfaceHover};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr 50px 50px;
    padding: ${({ theme }) => theme.spacing.sm} 10px;
    font-size: 0.8rem;
  }
`;

export const GameName = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 767px) {
    font-size: 0.8125rem;
    word-break: break-word;
  }
`;

export const ScoreBadge = styled.span<{ $score: number | null }>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ theme, $score }) => {
    if ($score === null) return theme.colors.surfaceElevated;
    if ($score >= 80) return theme.colors.successMuted;
    if ($score >= 60) return theme.colors.warningMuted;
    return theme.colors.errorMuted;
  }};
  color: ${({ theme, $score }) => {
    if ($score === null) return theme.colors.textMuted;
    if ($score >= 80) return theme.colors.success;
    if ($score >= 60) return theme.colors.warning;
    return theme.colors.error;
  }};
`;

export const InlineInput = styled.input`
  width: 60px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  text-align: center;
  outline: none;
`;

export const InlineNameInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  outline: none;

  @media (max-width: 767px) {
    font-size: 0.8125rem;
  }
`;

export const RowActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;

export const IconBtn = styled.button<{ $danger?: boolean }>`
  background: none;
  border: none;
  color: ${({ theme, $danger }) => $danger ? theme.colors.error : theme.colors.textMuted};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  font-size: 1rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition:
    color ${({ theme }) => theme.transition.fast},
    background ${({ theme }) => theme.transition.fast},
    transform ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme, $danger }) => $danger ? theme.colors.error : theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  &:active {
    transform: scale(0.9);
  }
`;

export const DropZone = styled.div<{ $active: boolean; $marginTop?: boolean; $flushBottom?: boolean }>`
  border: 2px dashed
    ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.textSecondary)};
  margin-top: ${({ theme, $marginTop }) => ($marginTop ? theme.spacing.sm : 0)};
  margin-bottom: ${({ theme, $flushBottom }) => ($flushBottom ? 0 : theme.spacing.lg)};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.normal};
  background: ${({ theme, $active }) => ($active ? theme.colors.accentMuted : "transparent")};

  @media (max-width: 767px) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

export const Empty = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ImportSectionRoot = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const PlatformRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const PlatformBtn = styled.button<{ $connected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 10px ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ $connected, theme }) => ($connected ? theme.colors.success : theme.colors.border)};
  background: ${({ $connected, theme }) => ($connected ? "transparent" : theme.colors.surface)};
  color: ${({ $connected, theme }) => ($connected ? theme.colors.success : theme.colors.text)};
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.surfaceHover};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 1024px) {
    &:hover:not(:disabled) { transform: none; }
  }

  img { flex-shrink: 0; }
`;

export const PlatformGuide = styled.details`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};

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

  img { flex-shrink: 0; }
`;

export const PlatformGuideBody = styled.div`
  padding: 0 14px 14px;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;

  ol { margin: 0; padding-left: 1.2rem; }
  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; &:hover { text-decoration: underline; } }
`;

export const StatusText = styled.span`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ErrorText = styled.span`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.error};
`;

export const SectionLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const ImportBlock = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const EpicAuthStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const EpicCodeRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

export const EpicInputWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

export const DropZoneTitle = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: 1.1rem;
`;

export const DropZoneHint = styled.p`
  margin: 0;
  font-size: 0.8rem;
`;

export const PasteButtonRow = styled(ButtonRow)`
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  backdrop-filter: blur(2px);
`;

export const ModalCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85rem;
`;
