"use client";

import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useApp } from "@/app/providers/AppProvider";
import { sessionCache } from "@/features/analyze-game/model/session-cache";
import { Button } from "@/shared/ui/Button";

const FormRoot = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`;

const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GameNameField = styled.input<{ $invalid?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $invalid }) => ($invalid ? theme.colors.error : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.lg};
  outline: none;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 500;
  }

  &:focus {
    border-color: ${({ theme, $invalid }) => ($invalid ? theme.colors.error : theme.colors.accent)};
    box-shadow: 0 0 0 3px
      ${({ theme, $invalid }) => ($invalid ? theme.colors.errorMuted : theme.colors.accentMuted)};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const PriceRow = styled.div<{ $invalid?: boolean }>`
  display: flex;
  align-items: stretch;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $invalid }) => ($invalid ? theme.colors.error : theme.colors.border)};
  overflow: hidden;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:focus-within {
    border-color: ${({ theme, $invalid }) => ($invalid ? theme.colors.error : theme.colors.accent)};
    box-shadow: 0 0 0 3px
      ${({ theme, $invalid }) => ($invalid ? theme.colors.errorMuted : theme.colors.accentMuted)};
  }
`;

const CurrencyPrefix = styled.span`
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const PriceField = styled.input`
  flex: 1;
  min-width: 0;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const ErrorBanner = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.8125rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.error};
  background: ${({ theme }) => theme.colors.errorMuted};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.error};
`;

const FieldError = styled.span`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.error};
`;

export interface AnalyzeFormProps {
  onSubmit: (gameName: string, price: number) => void;
  isLoading: boolean;
}

function currencyPrefixFromSettings(currencyCode: string | undefined): string {
  if (!currencyCode) return "$";
  try {
    const parts = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);
    const sym = parts.find((p) => p.type === "currency");
    return sym?.value ?? currencyCode;
  } catch {
    return currencyCode;
  }
}

export function AnalyzeForm({ onSubmit, isLoading }: AnalyzeFormProps) {
  const { state, hydrated } = useApp();
  const cached = sessionCache.get();
  const [gameName, setGameName] = useState(cached.gameName);
  const [priceRaw, setPriceRaw] = useState(cached.priceRaw);
  const [touched, setTouched] = useState(false);

  const hasProvider = Boolean(state.aiProvider);
  const showProviderError = hydrated && !hasProvider;
  const currencyPrefix = currencyPrefixFromSettings(state.setupAnswers?.currency);

  const priceNum = priceRaw.trim() === "" ? NaN : Number(priceRaw);
  const priceInvalid = touched && (Number.isNaN(priceNum) || priceNum < 0);
  const nameInvalid = touched && gameName.trim() === "";

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);

      if (!hasProvider) return;

      const name = gameName.trim();
      const price = Number(priceRaw);

      if (!name || Number.isNaN(price) || price < 0) return;

      onSubmit(name, price);
    },
    [gameName, priceRaw, hasProvider, onSubmit],
  );

  return (
    <FormRoot onSubmit={handleSubmit} noValidate>
      {showProviderError ? (
        <ErrorBanner role="alert">
          Configure an AI provider in settings before running an analysis.
        </ErrorBanner>
      ) : null}

      <FieldBlock>
        <Label htmlFor="analyze-game-name">Game name</Label>
        <GameNameField
          id="analyze-game-name"
          name="gameName"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="e.g. Hollow Knight"
          value={gameName}
          onChange={(e) => { setGameName(e.target.value); sessionCache.set({ gameName: e.target.value }); }}
          disabled={isLoading || showProviderError}
          $invalid={nameInvalid}
          aria-invalid={nameInvalid || undefined}
        />
        {nameInvalid ? <FieldError>Enter a game name.</FieldError> : null}
      </FieldBlock>

      <FieldBlock>
        <Label htmlFor="analyze-price">Price</Label>
        <PriceRow $invalid={priceInvalid}>
          <CurrencyPrefix aria-hidden>{currencyPrefix}</CurrencyPrefix>
          <PriceField
            id="analyze-price"
            name="price"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="0.00"
            value={priceRaw}
            onChange={(e) => { setPriceRaw(e.target.value); sessionCache.set({ priceRaw: e.target.value }); }}
            disabled={isLoading || showProviderError}
            aria-invalid={priceInvalid || undefined}
          />
        </PriceRow>
        {priceInvalid ? <FieldError>Enter a valid price (0 or greater).</FieldError> : null}
      </FieldBlock>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        disabled={showProviderError}
      >
        Analyze
      </Button>
    </FormRoot>
  );
}
