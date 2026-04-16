"use client";

import React from "react";
import styled from "styled-components";
import { HashLink } from "@/shared/ui";

const Card = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  box-shadow: ${({ theme }) => theme.shadow.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Desc = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StepList = styled.ol`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  padding-left: 1.3rem;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};

  li {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  strong {
    color: ${({ theme }) => theme.colors.text};
  }

  code {
    padding: 1px 5px;
    border-radius: 4px;
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 0.78rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const ActionLink = styled(HashLink)<{ $variant?: "primary" | "secondary" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  min-height: 40px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.md};
  text-decoration: none;
  transition:
    background ${({ theme }) => theme.transition.fast},
    border-color ${({ theme }) => theme.transition.fast};

  ${({ theme, $variant = "secondary" }) =>
    $variant === "primary"
      ? `
          background: ${theme.colors.accent};
          color: ${theme.colors.text};
          border: 1px solid transparent;
          &:hover { background: ${theme.colors.accentHover}; }
        `
      : `
          background: ${theme.colors.surface};
          color: ${theme.colors.text};
          border: 1px solid ${theme.colors.border};
          &:hover { background: ${theme.colors.surfaceHover}; border-color: ${theme.colors.borderLight}; }
        `}
`;

export function TrialExhaustedCard() {
  return (
    <Card>
      <Title>All 5 starter analyses used</Title>
      <Desc>
        To keep using GameFit, set up your own API key — it takes about 2
        minutes and most providers include starter credits.
      </Desc>

      <StepList>
        <li>
          <strong>Pick a provider</strong> — we recommend{" "}
          <strong>Anthropic (Claude)</strong> for the best results, but OpenAI and
          Google work great too.
        </li>
        <li>
          <strong>Anthropic:</strong> Go to <code>console.anthropic.com</code>,
          create an account, navigate to API Keys, and create a new key. New
          accounts get free credits.
        </li>
        <li>
          <strong>OpenAI:</strong> Go to <code>platform.openai.com</code>, sign
          up, go to API Keys, and create a new secret key.
        </li>
        <li>
          <strong>Google:</strong> Go to <code>aistudio.google.com</code>, sign in
          with your Google account, and create an API key.
        </li>
        <li>
          <strong>Add the key</strong> in{" "}
          <HashLink href="/settings" style={{ textDecoration: "underline", color: "inherit" }}>
            Settings &rarr; AI Provider
          </HashLink>{" "}
          and you&apos;re good to go. Each analysis costs a fraction of a cent.
        </li>
      </StepList>

      <Actions>
        <ActionLink href="/settings" $variant="primary">
          Go to Settings
        </ActionLink>
        <ActionLink href="/help#api-key" $variant="secondary">
          Learn More
        </ActionLink>
      </Actions>
    </Card>
  );
}
