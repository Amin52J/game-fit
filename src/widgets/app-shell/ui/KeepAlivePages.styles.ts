"use client";

import Link from "next/link";
import styled, { keyframes } from "styled-components";

export const pageFadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const PageSlot = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? "block" : "none")};
  animation: ${pageFadeIn} 250ms ease;
`;

export const NotFoundRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const NotFoundCode = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 6rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent} 0%,
    ${({ theme }) => theme.colors.textMuted} 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const NotFoundTitle = styled.h1`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const NotFoundDesc = styled.p`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  max-width: 380px;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const NotFoundLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: 10px 28px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius.md};
  text-decoration: none;
  transition:
    background ${({ theme }) => theme.transition.fast},
    transform ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-1px);
  }

  @media (max-width: 1024px) {
    &:hover { transform: none; }
  }
`;
