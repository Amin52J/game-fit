"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/app/providers/AppProvider";
import { sessionCache } from "@/features/analyze-game/model/session-cache";
import { Button } from "@/shared/ui/Button";
import {
  FormRoot,
  FieldBlock,
  Label,
  GameNameField,
  PriceRow,
  CurrencyPrefix,
  PriceField,
  ErrorBanner,
  FieldError,
} from "./AnalyzeForm.styles";
import { currencyPrefixFromSettings } from "./AnalyzeForm.utils";

export interface AnalyzeFormProps {
  onSubmit: (gameName: string, price: number) => void;
  isLoading: boolean;
}

export function AnalyzeForm({ onSubmit, isLoading }: AnalyzeFormProps) {
  const { state, hydrated } = useApp();
  const pathname = usePathname();
  const nameRef = useRef<HTMLInputElement>(null);
  const cached = sessionCache.get();
  const [gameName, setGameName] = useState(cached.gameName);
  const [priceRaw, setPriceRaw] = useState(cached.priceRaw);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (pathname === "/" || pathname === "/analyze") {
      nameRef.current?.focus();
    }
  }, [pathname]);

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
          ref={nameRef}
          id="analyze-game-name"
          name="gameName"
          type="text"
          autoComplete="off"
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

      <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading} disabled={showProviderError}>
        Analyze
      </Button>
    </FormRoot>
  );
}
