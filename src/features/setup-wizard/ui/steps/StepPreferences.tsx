"use client";

import React from "react";
import type { SetupAnswers } from "@/shared/types";
import { DEALBREAKER_OPTIONS } from "@/shared/types";
import { CurrencySearch } from "./CurrencySearch";
import {
  FieldGroup,
  SectionTitle,
  SectionHint,
  SectionHintTightBottom,
  Label,
  TextInput,
  TextAreaField,
  Row,
  PlayGrid,
  OptionCard,
  OptionCardTitle,
  OptionCardDesc,
  SliderGrid,
  SliderField,
  SliderLabels,
  SliderName,
  SliderValue,
  RangeInput,
  ChipGrid,
  Chip,
  OptionRow,
  PillBtn,
  CustomDealbreakersRow,
  SpacingTopMd,
  CustomChipWrap,
  CustomChip,
  RemoveBtn,
  Btn,
} from "../SetupWizard.styles";

export function StepPreferences({
  answers,
  setAnswers,
}: {
  answers: SetupAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<SetupAnswers>>;
}) {
  const toggleDealbreaker = (id: string) => {
    setAnswers((a) => {
      const has = a.dealbreakers.includes(id);
      return {
        ...a,
        dealbreakers: has ? a.dealbreakers.filter((x) => x !== id) : [...a.dealbreakers, id],
      };
    });
  };

  const setSlider = (key: keyof SetupAnswers, value: number) => {
    setAnswers((a) => ({ ...a, [key]: value }));
  };

  return (
    <FieldGroup>
      <div>
        <SectionTitle>Play style</SectionTitle>
        <PlayGrid>
          {(
            [
              { v: "singleplayer" as const, t: "Single-player", d: "Solo campaigns & stories" },
              { v: "multiplayer" as const, t: "Multiplayer", d: "MP, co-op, live games" },
              { v: "both" as const, t: "Both", d: "Mix of SP and MP" },
            ] as const
          ).map((opt) => (
            <OptionCard
              key={opt.v}
              type="button"
              $selected={answers.playStyle === opt.v}
              onClick={() => setAnswers((a) => ({ ...a, playStyle: opt.v }))}
            >
              <OptionCardTitle>{opt.t}</OptionCardTitle>
              <OptionCardDesc>{opt.d}</OptionCardDesc>
            </OptionCard>
          ))}
        </PlayGrid>
      </div>

      <div>
        <SectionTitle>What matters most? (1–5)</SectionTitle>
        <SliderGrid>
          {(
            [
              ["storyImportance", "Story & narrative"],
              ["gameplayImportance", "Gameplay mechanics"],
              ["explorationImportance", "Exploration"],
              ["combatImportance", "Combat"],
              ["puzzleImportance", "Puzzles"],
              ["strategyImportance", "Strategy"],
            ] as const
          ).map(([key, label]) => (
            <SliderField key={key}>
              <SliderLabels>
                <SliderName>{label}</SliderName>
                <SliderValue>{answers[key]}</SliderValue>
              </SliderLabels>
              <RangeInput
                type="range"
                min={1}
                max={5}
                step={1}
                value={answers[key]}
                onChange={(e) => setSlider(key, Number(e.target.value))}
              />
            </SliderField>
          ))}
        </SliderGrid>
      </div>

      <div>
        <SectionTitle>Dealbreakers</SectionTitle>
        <SectionHint>
          Tap anything you want the assistant to treat as a strong negative signal.
        </SectionHint>
        <ChipGrid>
          {DEALBREAKER_OPTIONS.map((opt) => (
            <Chip
              key={opt.id}
              type="button"
              $on={answers.dealbreakers.includes(opt.id)}
              onClick={() => toggleDealbreaker(opt.id)}
            >
              {opt.label}
            </Chip>
          ))}
        </ChipGrid>

        <SpacingTopMd>
          <Label>Custom dealbreakers</Label>
          <SectionHintTightBottom>
            Add your own — press Enter or click Add after each one.
          </SectionHintTightBottom>
          <CustomDealbreakersRow>
            <TextInput
              id="gf-custom-dealbreaker"
              placeholder="e.g. No underwater levels"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val && !answers.customDealbreakers.includes(val)) {
                    setAnswers((a) => ({
                      ...a,
                      customDealbreakers: [...a.customDealbreakers, val],
                    }));
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
            />
            <Btn
              type="button"
              $variant="secondary"
              onClick={() => {
                const input = document.getElementById("gf-custom-dealbreaker") as HTMLInputElement;
                const val = input?.value.trim();
                if (val && !answers.customDealbreakers.includes(val)) {
                  setAnswers((a) => ({ ...a, customDealbreakers: [...a.customDealbreakers, val] }));
                  input.value = "";
                }
              }}
            >
              Add
            </Btn>
          </CustomDealbreakersRow>
          {answers.customDealbreakers.length > 0 && (
            <CustomChipWrap>
              {answers.customDealbreakers.map((d) => (
                <CustomChip key={d}>
                  {d}
                  <RemoveBtn
                    type="button"
                    onClick={() =>
                      setAnswers((a) => ({
                        ...a,
                        customDealbreakers: a.customDealbreakers.filter((x) => x !== d),
                      }))
                    }
                  >
                    ×
                  </RemoveBtn>
                </CustomChip>
              ))}
            </CustomChipWrap>
          )}
        </SpacingTopMd>
      </div>

      <div>
        <SectionTitle>Voice acting</SectionTitle>
        <OptionRow>
          {(
            [
              ["essential", "Essential"],
              ["preferred", "Preferred"],
              ["indifferent", "Indifferent"],
              ["fine_with_text", "Fine with text"],
              ["any", "Any"],
            ] as const
          ).map(([v, label]) => (
            <PillBtn
              key={v}
              type="button"
              $selected={answers.voiceActingPreference === v}
              onClick={() => setAnswers((a) => ({ ...a, voiceActingPreference: v }))}
            >
              {label}
            </PillBtn>
          ))}
        </OptionRow>
      </div>

      <div>
        <SectionTitle>Difficulty appetite</SectionTitle>
        <OptionRow>
          {(
            [
              ["easy", "Easy"],
              ["moderate", "Moderate"],
              ["challenging", "Challenging"],
              ["soulslike", "Souls-like"],
              ["any", "Any"],
            ] as const
          ).map(([v, label]) => (
            <PillBtn
              key={v}
              type="button"
              $selected={answers.difficultyPreference === v}
              onClick={() => setAnswers((a) => ({ ...a, difficultyPreference: v }))}
            >
              {label}
            </PillBtn>
          ))}
        </OptionRow>
      </div>

      <div>
        <SectionTitle>Ideal campaign length</SectionTitle>
        <OptionRow>
          {(
            [
              ["short", "Short (<10h)"],
              ["medium", "Medium (10–25h)"],
              ["long", "Long (25h+)"],
              ["any", "Any"],
            ] as const
          ).map(([v, label]) => (
            <PillBtn
              key={v}
              type="button"
              $selected={answers.idealLength === v}
              onClick={() => setAnswers((a) => ({ ...a, idealLength: v }))}
            >
              {label}
            </PillBtn>
          ))}
        </OptionRow>
      </div>

      <Row>
        <div>
          <Label htmlFor="gf-currency">Currency</Label>
          <CurrencySearch
            value={answers.currency}
            onChange={(code) => setAnswers((a) => ({ ...a, currency: code }))}
          />
        </div>
        <div>
          <Label htmlFor="gf-region">Region</Label>
          <TextInput
            id="gf-region"
            value={answers.region}
            onChange={(e) => setAnswers((a) => ({ ...a, region: e.target.value }))}
          />
        </div>
      </Row>

      <div>
        <Label htmlFor="gf-notes">Additional notes (optional)</Label>
        <TextAreaField
          id="gf-notes"
          rows={3}
          placeholder="Anything else the assistant should know about your taste, your likes and dislikes... Use this for soft preferences, context, and 'I'd rather not' items. For absolute dealbreakers, use the tag list above."
          value={answers.additionalNotes}
          onChange={(e) => setAnswers((a) => ({ ...a, additionalNotes: e.target.value }))}
        />
      </div>
    </FieldGroup>
  );
}
