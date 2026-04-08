import { describe, it, expect } from "vitest";
import { generateInstructions } from "./prompt-generator";
import type { SetupAnswers } from "@/shared/types";

function makeAnswers(overrides: Partial<SetupAnswers> = {}): SetupAnswers {
  return {
    playStyle: "singleplayer",
    storyImportance: 4,
    gameplayImportance: 4,
    explorationImportance: 3,
    combatImportance: 3,
    puzzleImportance: 2,
    strategyImportance: 2,
    dealbreakers: ["grind", "always_online", "bad_controls"],
    customDealbreakers: [],
    voiceActingPreference: "preferred",
    difficultyPreference: "moderate",
    idealLength: "medium",
    currency: "EUR",
    region: "Germany",
    additionalNotes: "",
    ...overrides,
  };
}

describe("prompt-generator", () => {
  it("generates non-empty instructions", () => {
    const result = generateInstructions(makeAnswers());
    expect(result.length).toBeGreaterThan(100);
  });

  it("includes role section", () => {
    const result = generateInstructions(makeAnswers());
    expect(result).toContain("Role");
    expect(result).toContain("game analysis assistant");
  });

  it("includes core principles", () => {
    const result = generateInstructions(makeAnswers());
    expect(result).toContain("Core Principles");
    expect(result).toContain("Ground Truth");
    expect(result).toContain("No Assumptions");
  });

  it("includes single-player rules for SP preference", () => {
    const result = generateInstructions(makeAnswers({ playStyle: "singleplayer" }));
    expect(result).toContain("Single-player focus");
  });

  it("includes multiplayer rules for MP preference", () => {
    const result = generateInstructions(makeAnswers({ playStyle: "multiplayer" }));
    expect(result).toContain("Multiplayer considered");
  });

  it("includes both rules for both preference", () => {
    const result = generateInstructions(makeAnswers({ playStyle: "both" }));
    expect(result).toContain("Single-player first");
  });

  it("adds movement clunk penalty for bad_controls dealbreaker", () => {
    const result = generateInstructions(
      makeAnswers({ dealbreakers: ["bad_controls"] }),
    );
    expect(result).toContain("Movement clunk");
  });

  it("adds grind/pacing rules for grind dealbreaker", () => {
    const result = generateInstructions(makeAnswers({ dealbreakers: ["grind"] }));
    expect(result).toContain("Repetition");
  });

  it("adds voice acting rules for essential preference", () => {
    const result = generateInstructions(
      makeAnswers({ voiceActingPreference: "essential" }),
    );
    expect(result).toContain("strongly dislikes");
  });

  it("skips dialogue rules for indifferent preference", () => {
    const result = generateInstructions(
      makeAnswers({ voiceActingPreference: "indifferent" }),
    );
    expect(result).not.toContain("Dialogue & Voice Acting");
  });

  it("includes wayfinding rules when selected", () => {
    const result = generateInstructions(
      makeAnswers({ dealbreakers: ["wayfinding"] }),
    );
    expect(result).toContain("Wayfinding");
  });

  it("does not include target price section (pricing is client-side)", () => {
    const result = generateInstructions(makeAnswers({ currency: "USD", region: "US" }));
    expect(result).not.toContain("## Target Price");
    expect(result).toContain("pricing is computed separately");
  });

  it("includes additional notes when provided", () => {
    const result = generateInstructions(
      makeAnswers({ additionalNotes: "I love open-world games" }),
    );
    expect(result).toContain("I love open-world games");
  });

  it("does not include additional notes section when empty", () => {
    const result = generateInstructions(makeAnswers({ additionalNotes: "" }));
    expect(result).not.toContain("Additional Notes");
  });

  it("includes Red-Line Risk section", () => {
    const result = generateInstructions(makeAnswers());
    expect(result).toContain("Red-Line Risk");
    expect(result).toContain("High");
    expect(result).toContain("Medium");
    expect(result).toContain("None");
  });

  it("includes output format section", () => {
    const result = generateInstructions(makeAnswers());
    expect(result).toContain("Prediction Output Format");
    expect(result).toContain("Enjoyment Score");
  });

  it("includes refund guard in pricing", () => {
    const result = generateInstructions(makeAnswers());
    expect(result).toContain("Refund");
  });
});
