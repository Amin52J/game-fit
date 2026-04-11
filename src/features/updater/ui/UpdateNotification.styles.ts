"use client";

import styled, { keyframes } from "styled-components";

export const slideIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Banner = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 340px;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: rgba(26, 26, 48, 0.92);
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  animation: ${slideIn} 300ms ease;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;
`;

export const Body = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: 4px;
`;

export const Btn = styled.button<{ $primary?: boolean }>`
  flex: 1;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ $primary, theme }) =>
      $primary ? theme.colors.accent : theme.colors.border};
  background: ${({ $primary, theme }) =>
    $primary ? theme.colors.accent : "transparent"};
  color: ${({ $primary, theme }) =>
    $primary ? theme.colors.text : theme.colors.textSecondary};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ $primary, theme }) =>
      $primary ? theme.colors.accentHover : theme.colors.surfaceHover};
  }

  &:active {
    transform: scale(0.97);
  }
`;
