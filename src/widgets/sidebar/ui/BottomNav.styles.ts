"use client";

import styled from "styled-components";

export const BottomNavRoot = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  height: 88px;
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.4);

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    display: none;
  }
`;

export const BottomNavItem = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex: 1;
  height: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.textMuted)};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition:
    color ${({ theme }) => theme.transition.fast},
    transform ${({ theme }) => theme.transition.fast};

  &:active {
    transform: scale(0.92);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: -2px;
  }
`;

export const BottomNavIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

export const BottomNavLabel = styled.span`
  line-height: 1;
`;
