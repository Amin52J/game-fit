"use client";

import React, { useEffect, useRef, useState } from "react";
import { CURRENCIES } from "../SetupWizard.utils";
import {
  CurrencyWrap,
  TextInput,
  CurrencyDropdown,
  CurrencyOption,
} from "../SetupWizard.styles";

export function CurrencySearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIdx, setHighlightIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayLabel = CURRENCIES.find((c) => c.code === value)?.label ?? value;

  const filtered = query
    ? CURRENCIES.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()),
      )
    : CURRENCIES;

  useEffect(() => {
    setHighlightIdx(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const select = (code: string) => {
    onChange(code);
    setOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlightIdx]) select(filtered[highlightIdx].code);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <CurrencyWrap ref={wrapRef}>
      <TextInput
        ref={inputRef}
        id="gf-currency"
        value={open ? query : displayLabel}
        placeholder="Search currency..."
        onChange={(e) => {
          setQuery(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <CurrencyDropdown>
          {filtered.map((c, i) => (
            <CurrencyOption
              key={c.code}
              $highlighted={i === highlightIdx}
              onMouseDown={(e) => {
                e.preventDefault();
                select(c.code);
              }}
            >
              {c.label}
            </CurrencyOption>
          ))}
        </CurrencyDropdown>
      )}
    </CurrencyWrap>
  );
}
