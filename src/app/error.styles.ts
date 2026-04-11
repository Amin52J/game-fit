"use client";

import styled from "styled-components";

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const Code = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 6rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.error} 0%,
    ${({ theme }) => theme.colors.textMuted} 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const Title = styled.h1`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const Description = styled.p`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  max-width: 420px;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const Digest = styled.code`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export const Btn = styled.button<{ $primary?: boolean }>`
  padding: 10px 28px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid
    ${({ theme, $primary }) => ($primary ? theme.colors.accent : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transition.fast},
    transform ${({ theme }) => theme.transition.fast};
  background: ${({ theme, $primary }) =>
    $primary ? theme.colors.accent : theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: ${({ theme, $primary }) =>
      $primary ? theme.colors.accentHover : theme.colors.surfaceHover};
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    &:hover {
      transform: translateY(-1px);
    }
  }
`;
