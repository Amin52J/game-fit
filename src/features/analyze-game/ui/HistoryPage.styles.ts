"use client";

import styled, { keyframes } from "styled-components";
import { PageWrapper } from "@/shared/ui";

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Page = styled(PageWrapper)`
  padding: ${({ theme }) => theme.spacing.sm} 0;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: 0;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: 0;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

export const SearchRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 10px 16px 10px 40px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  outline: none;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentMuted};
  }
`;

export const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textMuted};
    pointer-events: none;
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  flex-shrink: 0;
`;

export const ViewBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: none;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentMuted : theme.colors.surface};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.textMuted};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  & + & {
    border-left: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    gap: ${({ theme }) => theme.spacing.md};
    padding: 0;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

export const FilterLabel = styled.span`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;
`;

export const ResultCount = styled.span`
  width: 100%;
  margin-left: 0;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    width: auto;
    margin-left: auto;
    font-size: 0.8125rem;
  }
`;

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const HistoryCard = styled.li<{ $expanded: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: none;
  border-right: none;
  border-radius: 0;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  overflow: hidden;
  animation: ${fadeUp} ${({ theme }) => theme.transition.normal};
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  ${({ $expanded, theme }) =>
    $expanded
      ? `
    border-color: ${theme.colors.borderLight};
    box-shadow: ${theme.shadow.md};
  `
      : ""};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    border: 1px solid ${({ theme, $expanded }) =>
      $expanded ? theme.colors.borderLight : theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.lg};
  }
`;

export const CardMain = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  margin: 0;
  text-align: left;
  cursor: pointer;
  font: inherit;
  color: inherit;
  background: transparent;
  border: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: -2px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  }
`;

export const CardTitleBlock = styled.div`
  min-width: 0;
  flex: 1;
`;

export const CardTitle = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.35;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    font-size: 1.05rem;
  }
`;

export const CardMeta = styled.span`
  display: block;
  margin-top: 6px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    font-size: 0.8125rem;
    margin-top: ${({ theme }) => theme.spacing.xs};
  }
`;

export const DeleteBtn = styled.button`
  flex-shrink: 0;
  padding: 3px 8px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.error};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.errorMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    font-size: 0.8125rem;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  }
`;

export const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
  align-self: flex-start;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    align-self: auto;
  }
`;

export const ReanalyzeBtn = styled.button`
  flex-shrink: 0;
  padding: 3px 8px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentMuted};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast};

  &:hover {
    filter: brightness(1.08);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    font-size: 0.8125rem;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  }
`;

export const PreviewContent = styled.div`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.sm}`};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  }
`;

export const PreviewBody = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => `0 ${theme.spacing.lg} ${theme.spacing.md}`};
  }
`;

export const ExpandHint = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ExpandedSection = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.lg}`};
  }
`;

export const ListTable = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: none;
  border-right: none;
  border-radius: 0;
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    border-left: 1px solid ${({ theme }) => theme.colors.border};
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.lg};
  }
`;

export const ListHeader = styled.div`
  display: none;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    display: grid;
    grid-template-columns: 48px 1fr 80px 60px;

    & > :nth-child(3),
    & > :nth-child(4) {
      display: none;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    grid-template-columns: 56px 1fr 90px 140px 80px 60px;

    & > :nth-child(3),
    & > :nth-child(4) {
      display: revert;
    }
  }
`;

export const ListItem = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const ListRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  & > :nth-child(3),
  & > :nth-child(4),
  & > :nth-child(5) {
    display: none;
  }
  & > :nth-child(6) {
    margin-left: auto;
    flex-shrink: 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    display: grid;
    grid-template-columns: 48px 1fr 80px 60px;
    padding: 8px 16px;
    gap: 0;

    & > :nth-child(3),
    & > :nth-child(4) {
      display: none;
    }
    & > :nth-child(5) {
      display: revert;
    }
    & > :nth-child(6) {
      margin-left: 0;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    grid-template-columns: 56px 1fr 90px 140px 80px 60px;

    & > :nth-child(3),
    & > :nth-child(4) {
      display: revert;
    }
  }
`;

export const ListExpandedSection = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.lg}`};
  }
`;

export const ListExpandedToolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const MiniScore = styled.span<{ $score: number | null }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 700;
  background: ${({ theme, $score }) => {
    if ($score === null) return theme.colors.surfaceElevated;
    if ($score >= 80) return theme.colors.successMuted;
    if ($score >= 60) return theme.colors.accentMuted;
    if ($score >= 40) return theme.colors.warningMuted;
    return theme.colors.errorMuted;
  }};
  color: ${({ theme, $score }) => {
    if ($score === null) return theme.colors.textMuted;
    if ($score >= 80) return theme.colors.success;
    if ($score >= 60) return theme.colors.accent;
    if ($score >= 40) return theme.colors.warning;
    return theme.colors.error;
  }};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    width: 40px;
    height: 40px;
    font-size: 0.8rem;
  }
`;

export const InlineMiniScore = styled(MiniScore)`
  width: auto;
  height: auto;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 1px ${({ theme }) => theme.spacing.sm};
  font-size: 0.75rem;
  margin-right: 6px;
  display: inline-flex;
`;

export const ListRowActionsCell = styled.div`
  text-align: right;
`;

export const ListGameName = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 1.3;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    white-space: nowrap;
    font-size: 0.875rem;
    line-height: normal;
  }
`;

export const ListMeta = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

export const RiskBadge = styled.span<{ $level: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  ${({ $level, theme }) => {
    if ($level === "none")
      return `background: ${theme.colors.successMuted}; color: ${theme.colors.success};`;
    if ($level === "medium")
      return `background: ${theme.colors.warningMuted}; color: ${theme.colors.warning};`;
    if ($level === "high")
      return `background: ${theme.colors.errorMuted}; color: ${theme.colors.error};`;
    return `background: ${theme.colors.surfaceElevated}; color: ${theme.colors.textMuted};`;
  }}
`;

export const EarlyAccessTag = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  padding: 1px 6px;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.warning};
  background: ${({ theme }) => theme.colors.warningMuted};
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.radius.sm};
  flex-shrink: 0;
  white-space: nowrap;
  vertical-align: middle;
`;

export const ListGameCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  flex: 1;
  min-width: 0;
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    flex-direction: row;
    align-items: center;
    gap: 6px;
    flex: initial;
  }
`;

export const ListGameTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  width: 100%;
`;

export const ListMobileMeta = styled.span`
  display: block;
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textMuted};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    display: none;
  }
`;

export const ListDeleteBtn = styled.button<{ $confirm?: boolean }>`
  padding: 4px 8px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme, $confirm }) => $confirm ? theme.colors.error : theme.colors.textMuted};
  background: ${({ theme, $confirm }) => $confirm ? theme.colors.errorMuted : "transparent"};
  border: 1px solid ${({ theme, $confirm }) => $confirm ? theme.colors.error : "transparent"};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.error};
    border-color: ${({ theme }) => theme.colors.error};
    background: ${({ theme }) => theme.colors.errorMuted};
  }
`;

export const Sentinel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const EmptyState = styled.div`
  text-align: center;
  margin: 0 ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    margin: 0;
    padding: ${({ theme }) => theme.spacing.xxl};
  }
`;
