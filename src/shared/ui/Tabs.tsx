"use client";

import React, { createContext, useCallback, useContext, useId, useMemo } from "react";
import styled, { keyframes } from "styled-components";

type TabsContextValue = {
  value: string;
  setValue: (next: string) => void;
  baseId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <Tabs>`);
  }
  return ctx;
}

const TabsRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TabButton = styled.button<{ $active: boolean }>`
  position: relative;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  margin-bottom: -1px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.textSecondary)};
  background: transparent;
  border: none;
  border-bottom: 2px solid
    ${({ theme, $active }) => ($active ? theme.colors.accent : "transparent")};
  cursor: pointer;
  transition:
    color ${({ theme }) => theme.transition.fast},
    border-color ${({ theme }) => theme.transition.fast},
    background ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.accentMuted};
    border-radius: ${({ theme }) => theme.radius.sm} ${({ theme }) => theme.radius.sm} 0 0;
  }

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const TabPanelsRoot = styled.div`
  min-height: 0;
`;

const panelFadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Panel = styled.div`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
  animation: ${panelFadeIn} 200ms ease;
`;

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onChange, children, className }: TabsProps) {
  const baseId = useId();
  const setValue = useCallback(
    (next: string) => {
      if (next !== value) onChange(next);
    },
    [onChange, value],
  );

  const ctx = useMemo(() => ({ value, setValue, baseId }), [value, setValue, baseId]);

  return (
    <TabsContext.Provider value={ctx}>
      <TabsRoot className={className}>{children}</TabsRoot>
    </TabsContext.Provider>
  );
}

export interface TabListProps {
  children?: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

export function TabList({ children, className, "aria-label": ariaLabel }: TabListProps) {
  return (
    <List role="tablist" aria-label={ariaLabel} className={className}>
      {children}
    </List>
  );
}

export interface TabProps {
  value: string;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tab({ value: tabValue, children, disabled, className }: TabProps) {
  const { value, setValue, baseId } = useTabsContext("Tab");
  const active = value === tabValue;
  const tabId = `${baseId}-tab-${tabValue}`;
  const panelId = `${baseId}-panel-${tabValue}`;

  return (
    <TabButton
      type="button"
      role="tab"
      id={tabId}
      aria-selected={active}
      aria-controls={panelId}
      tabIndex={active ? 0 : -1}
      disabled={disabled}
      className={className}
      $active={active}
      onClick={() => setValue(tabValue)}
    >
      {children}
    </TabButton>
  );
}

export interface TabPanelProps {
  value: string;
  children?: React.ReactNode;
  className?: string;
}

export function TabPanel({ value: panelValue, children, className }: TabPanelProps) {
  const { value, baseId } = useTabsContext("TabPanel");
  const visible = value === panelValue;
  const tabId = `${baseId}-tab-${panelValue}`;
  const panelId = `${baseId}-panel-${panelValue}`;

  if (!visible) return null;

  return (
    <Panel role="tabpanel" id={panelId} aria-labelledby={tabId} className={className}>
      {children}
    </Panel>
  );
}

export interface TabPanelsProps {
  children?: React.ReactNode;
  className?: string;
}

export function TabPanels({ children, className }: TabPanelsProps) {
  return <TabPanelsRoot className={className}>{children}</TabPanelsRoot>;
}
