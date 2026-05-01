import { describe, it, expect } from "vitest";
import { generateInstructions, getExtendedSectionNames } from "./prompt-generator";
import type { SetupAnswers } from "../../../shared/types";

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
    const result = generateInstructions(makeAnswers({ dealbreakers: ["bad_controls"] }));
    expect(result).toContain("Movement clunk");
  });

  it("adds grind/pacing rules for grind dealbreaker", () => {
    const result = generateInstructions(makeAnswers({ dealbreakers: ["grind"] }));
    expect(result).toContain("Repetition");
  });

  it("adds voice acting rules for essential preference", () => {
    const result = generateInstructions(makeAnswers({ voiceActingPreference: "essential" }));
    expect(result).toContain("strongly dislikes");
  });

  it("skips dialogue rules for indifferent preference", () => {
    const result = generateInstructions(makeAnswers({ voiceActingPreference: "indifferent" }));
    expect(result).not.toContain("## Dialogue & Voice Acting");
  });

  it("includes wayfinding rules when selected", () => {
    const result = generateInstructions(makeAnswers({ dealbreakers: ["wayfinding"] }));
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

  it("includes custom dealbreakers in Red-Line Risk", () => {
    const result = generateInstructions(
      makeAnswers({ customDealbreakers: ["excessive microtransactions"] }),
    );
    expect(result).toContain("excessive microtransactions");
  });

  it("includes heavy_reading dealbreaker", () => {
    const result = generateInstructions(makeAnswers({ dealbreakers: ["heavy_reading"] }));
    expect(result).toContain("reading-heavy");
  });

  it("includes gaas dealbreaker", () => {
    const result = generateInstructions(makeAnswers({ dealbreakers: ["gaas"] }));
    expect(result).toContain("GAAS");
  });

  it("includes religious_themes dealbreaker", () => {
    const result = generateInstructions(makeAnswers({ dealbreakers: ["religious_themes"] }));
    expect(result).toContain("religious themes");
  });

  it("includes shallow_crafting dealbreaker", () => {
    const result = generateInstructions(makeAnswers({ dealbreakers: ["shallow_crafting"] }));
    expect(result).toContain("busywork crafting");
  });

  it("includes slow_start dealbreaker", () => {
    const result = generateInstructions(makeAnswers({ dealbreakers: ["slow_start"] }));
    expect(result).toContain("slow early hours");
  });

  it("generates personalized sections for high combat importance", () => {
    const sections = getExtendedSectionNames(makeAnswers({ combatImportance: 5 }));
    expect(sections).toContain("Combat Feel & Feedback");
  });

  it("generates personalized sections for high puzzle importance", () => {
    const sections = getExtendedSectionNames(makeAnswers({ puzzleImportance: 5 }));
    expect(sections).toContain("Puzzle Design & Variety");
  });

  it("generates personalized sections for high strategy importance", () => {
    const sections = getExtendedSectionNames(makeAnswers({ strategyImportance: 5 }));
    expect(sections).toContain("Strategic Depth & Decision-Making");
  });

  it("generates personalized sections for high exploration importance", () => {
    const sections = getExtendedSectionNames(makeAnswers({ explorationImportance: 5 }));
    expect(sections).toContain("World Design & Exploration");
  });

  it("falls back to Detailed Assessment when no high-importance sections", () => {
    const sections = getExtendedSectionNames(
      makeAnswers({
        storyImportance: 2,
        gameplayImportance: 2,
        explorationImportance: 2,
        combatImportance: 2,
        puzzleImportance: 2,
        strategyImportance: 2,
        dealbreakers: [],
      }),
    );
    expect(sections).toContain("Detailed Assessment");
  });

  it("getExtendedSectionNames always includes base sections", () => {
    const sections = getExtendedSectionNames(makeAnswers());
    expect(sections).toContain("Library Signals");
    expect(sections).toContain("What the Game Is");
    expect(sections).toContain("Summary");
  });

  it("includes voice acting section for preferred", () => {
    const result = generateInstructions(makeAnswers({ voiceActingPreference: "preferred" }));
    expect(result).toContain("voice");
  });

  it("includes all dealbreakers combined", () => {
    const result = generateInstructions(
      makeAnswers({
        dealbreakers: [
          "grind",
          "always_online",
          "bad_controls",
          "wayfinding",
          "gaas",
          "heavy_reading",
          "religious_themes",
          "shallow_crafting",
          "slow_start",
        ],
        customDealbreakers: ["pay-to-win"],
        voiceActingPreference: "essential",
      }),
    );
    expect(result).toContain("always-online");
    expect(result).toContain("wayfinding");
    expect(result).toContain("GAAS");
    expect(result).toContain("reading-heavy");
    expect(result).toContain("religious themes");
    expect(result).toContain("busywork crafting");
    expect(result).toContain("slow early hours");
    expect(result).toContain("pay-to-win");
  });

  describe("custom dealbreakers magnitude", () => {
    it("uses the −8 / −12 / −15 dealbreaker scale (not a fixed −10)", () => {
      const result = generateInstructions(makeAnswers({ customDealbreakers: ["pay-to-win"] }));
      expect(result).toContain("pay-to-win");
      expect(result).toContain("−8");
      expect(result).toContain("−12");
      expect(result).toContain("−15");
      expect(result).not.toMatch(/Custom dealbreaker:[^.]*→ −10\./);
    });
  });

  describe("play-style mismatch", () => {
    it("emits hard MP-only mismatch rule for singleplayer users", () => {
      const result = generateInstructions(makeAnswers({ playStyle: "singleplayer" }));
      expect(result).toContain("Play-style mismatch");
      expect(result).toContain("MP-only");
      expect(result).toContain("−15");
    });

    it("emits hard SP-only mismatch rule for multiplayer users", () => {
      const result = generateInstructions(makeAnswers({ playStyle: "multiplayer" }));
      expect(result).toContain("Play-style mismatch");
      expect(result).toContain("single-player-only");
      expect(result).toContain("−15");
    });

    it("does not emit a hard mismatch for 'both' users", () => {
      const result = generateInstructions(makeAnswers({ playStyle: "both" }));
      const playStyleSection = result.match(/## Play Style Rules\n\n([^]*?)(?=\n## )/)?.[1] ?? "";
      expect(playStyleSection).toContain("Play-style guidance");
      expect(playStyleSection).not.toContain("Play-style mismatch");
    });

    it("includes play-style triggers in High Red-Line list", () => {
      const sp = generateInstructions(makeAnswers({ playStyle: "singleplayer" }));
      expect(sp).toContain("game is MP-only / MP-primary (single-player user)");

      const mp = generateInstructions(makeAnswers({ playStyle: "multiplayer" }));
      expect(mp).toContain("game is single-player-only (multiplayer user)");
    });
  });

  describe("voice acting matrix", () => {
    it("essential: emits no-VA −15, no penalty when VA present", () => {
      const result = generateInstructions(makeAnswers({ voiceActingPreference: "essential" }));
      expect(result).toContain("## Dialogue & Voice Acting");
      expect(result).toContain("strongly dislikes");
      expect(result).toContain("−15");
      expect(result).toContain("no change");
    });

    it("preferred: emits +5 bonus for VA and −5 for no-VA", () => {
      const result = generateInstructions(makeAnswers({ voiceActingPreference: "preferred" }));
      expect(result).toContain("## Dialogue & Voice Acting");
      expect(result).toContain("+5");
      expect(result).toContain("−5");
    });

    it.each(["indifferent", "fine_with_text", "any"] as const)(
      "%s: emits no Dialogue & Voice Acting section",
      (pref) => {
        const result = generateInstructions(makeAnswers({ voiceActingPreference: pref }));
        expect(result).not.toContain("## Dialogue & Voice Acting");
      },
    );
  });

  describe("length fit", () => {
    it("does not emit Length Fit when idealLength is 'any'", () => {
      const result = generateInstructions(makeAnswers({ idealLength: "any" }));
      expect(result).not.toContain("## Length Fit");
    });

    it("medium preference: short and long both → −12", () => {
      const result = generateInstructions(makeAnswers({ idealLength: "medium" }));
      expect(result).toContain("## Length Fit");
      expect(result).toContain("medium-length");
      expect(result).toContain("undershoots");
      expect(result).toContain("overshoots");
      expect(result).toContain("−12");
    });

    it("short preference: medium → −8, long → −12", () => {
      const result = generateInstructions(makeAnswers({ idealLength: "short" }));
      expect(result).toContain("## Length Fit");
      expect(result).toMatch(/medium \(15–40h\)[^]*?−8/);
      expect(result).toMatch(/long \(40h\+\)[^]*?−12/);
    });

    it("long preference: medium → −8, short → −12", () => {
      const result = generateInstructions(makeAnswers({ idealLength: "long" }));
      expect(result).toContain("## Length Fit");
      expect(result).toMatch(/medium \(15–40h\)[^]*?−8/);
      expect(result).toMatch(/short \(≤ 15h\)[^]*?−12/);
    });

    it("triggers High Red-Line Risk override for any length penalty", () => {
      const result = generateInstructions(makeAnswers({ idealLength: "medium" }));
      expect(result).toContain("Length Fit penalty was applied");
      expect(result).toContain("campaign length strongly mismatches user's ideal length");
    });
  });

  describe("difficulty appetite", () => {
    it("does not emit Difficulty Appetite when difficultyPreference is 'any'", () => {
      const result = generateInstructions(makeAnswers({ difficultyPreference: "any" }));
      expect(result).not.toContain("## Difficulty Appetite");
    });

    it("challenging: easy +3, moderate +5, challenging +8, soulslike −8", () => {
      const result = generateInstructions(makeAnswers({ difficultyPreference: "challenging" }));
      expect(result).toContain("## Difficulty Appetite");
      expect(result).toMatch(/challenging difficulty[^]*?\+8/);
      expect(result).toMatch(/moderate difficulty[^]*?\+5/);
      expect(result).toMatch(/easy \/ accessible[^]*?\+3/);
      expect(result).toMatch(/soulslike[^]*?−8/);
    });

    it("moderate: easy +5, moderate +8, challenging −5, soulslike −8", () => {
      const result = generateInstructions(makeAnswers({ difficultyPreference: "moderate" }));
      expect(result).toContain("## Difficulty Appetite");
      expect(result).toMatch(/moderate difficulty[^]*?\+8/);
      expect(result).toMatch(/easy \/ accessible[^]*?\+5/);
      expect(result).toMatch(/challenging difficulty[^]*?−5/);
      expect(result).toMatch(/soulslike[^]*?−8/);
    });

    it("easy: easy +8, others negative", () => {
      const result = generateInstructions(makeAnswers({ difficultyPreference: "easy" }));
      expect(result).toMatch(/easy \/ accessible[^]*?\+8/);
      expect(result).toMatch(/moderate difficulty[^]*?−5/);
      expect(result).toMatch(/challenging difficulty[^]*?−8/);
      expect(result).toMatch(/soulslike[^]*?−8/);
    });

    it("soulslike: soulslike +8, challenging +5, moderate/easy −3", () => {
      const result = generateInstructions(makeAnswers({ difficultyPreference: "soulslike" }));
      expect(result).toMatch(/soulslike difficulty[^]*?\+8/);
      expect(result).toMatch(/challenging difficulty[^]*?\+5/);
      expect(result).toMatch(/moderate difficulty[^]*?−3/);
      expect(result).toMatch(/easy \/ accessible[^]*?−3/);
    });
  });

  describe("axis sensitivity", () => {
    it("emits no Axis Sensitivity section when all sliders are 1", () => {
      const result = generateInstructions(
        makeAnswers({
          storyImportance: 1,
          gameplayImportance: 1,
          explorationImportance: 1,
          combatImportance: 1,
          puzzleImportance: 1,
          strategyImportance: 1,
        }),
      );
      expect(result).not.toContain("## Axis Sensitivity");
    });

    it("scales magnitudes with slider values", () => {
      const result = generateInstructions(
        makeAnswers({
          storyImportance: 5,
          gameplayImportance: 4,
          explorationImportance: 3,
          combatImportance: 2,
          puzzleImportance: 1,
          strategyImportance: 1,
        }),
      );
      expect(result).toContain("## Axis Sensitivity");
      expect(result).toMatch(/Story & Narrative[^]*?-12[^]*?\+8/);
      expect(result).toMatch(/Gameplay & Mechanics[^]*?-8[^]*?\+5/);
      expect(result).toMatch(/Exploration & World Design[^]*?-5[^]*?\+3/);
      expect(result).toMatch(/Combat Feel[^]*?-3[^]*?no bonus/);
      expect(result).not.toContain("Puzzle Design (importance");
      expect(result).not.toContain("Strategic Depth (importance");
    });

    it("removes the legacy boolean +5 'Meaningful systems bonus' rule", () => {
      const result = generateInstructions(
        makeAnswers({ gameplayImportance: 4, explorationImportance: 4 }),
      );
      expect(result).not.toContain("Meaningful systems bonus");
    });

    it("caps Axis Sensitivity total contribution at ±12", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("capped at ±12");
    });
  });

  describe("score caps and floors", () => {
    it("caps totalB at +15 overall in the Scoring Procedure", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("Cap totalB at +15");
    });

    it("includes hard caps tied to Red-Line Risk and totalP", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("Red-Line Risk = High → R ≤ 69");
      expect(result).toContain("Red-Line Risk = Medium → R ≤ 79");
      expect(result).toMatch(/totalP ≥ 30 → R ≤ 59/);
      expect(result).toMatch(/totalP ≥ 20 → R ≤ 69/);
      expect(result).toMatch(/totalP ≥ 10 → R ≤ 79/);
      expect(result).toMatch(/totalP ≥ 5 → R ≤ 89/);
    });

    it("includes the consistency check between Red-Line Risk and Enjoyment Score", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("Consistency check");
      expect(result).toContain("no scenario where Red-Line Risk is Medium and the score is 80+");
    });

    it("explicitly states bonuses cannot override hard caps", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("Bonuses (totalB) cannot override these caps");
    });
  });

  describe("frictionLoad stacking escalation", () => {
    it("defines frictionLoad in the Red-Line Risk section", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("frictionLoad");
      expect(result).toContain("EXCLUDES RQD and GQP");
    });

    it("escalates Red-Line Risk to High when frictionLoad ≥ 25", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("frictionLoad ≥ 25");
      expect(result).toContain("stacked-penalty escalation");
    });

    it("places Medium at frictionLoad 12-24", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("frictionLoad is in the 12–24 range");
    });

    it("None requires frictionLoad < 12", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("frictionLoad < 12");
    });

    it("defines frictionLoad as a separate metric from totalP in Scoring Procedure", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("frictionLoad represents user-specific friction");
      expect(result).toContain("totalP** = RQD + GQP + frictionLoad");
    });

    it("requires citing the cumulative load when stacking escalates", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("briefly state the cumulative load");
    });
  });

  describe("refund guard triggers", () => {
    it("triggers refund guard on Enjoyment Score ≤ 59", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("The Enjoyment Score is ≤ 59");
      expect(result).toContain("weak match or heavy penalties");
    });

    it("does not use ≤ 69 as the score-based threshold", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).not.toContain("The Enjoyment Score is ≤ 69");
    });

    it("triggers refund guard when an anchor game scored ≤ 50 in the library", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("anchor game used in the score calculation has a library score ≤ 50");
      expect(result).toContain("documented direct evidence");
    });

    it("keeps the anchor-score precondition in the Not-required list", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("No anchor game scored ≤ 50");
    });

    it("does NOT include the Enjoyment Score as a Not-required precondition", () => {
      const result = generateInstructions(makeAnswers());
      const notRequiredSection =
        result.match(/refund guard is \*\*Not required\*\* ONLY if ALL of these are true:([^]*?)If ANY one/)?.[1] ?? "";
      expect(notRequiredSection).not.toMatch(/Enjoyment Score ≥/);
    });

    it("explains that scores in the 60–69 range rely on other triggers", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("score in the 60–69 range is not automatically safe");
    });

    it("auto-triggers refund guard on High Red-Line Risk only (not Medium)", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain('Red-Line Risk section above states "High" → Recommended');
      expect(result).not.toContain('Red-Line Risk section above states "High" or "Medium"');
    });

    it("explicitly notes that Medium does NOT auto-trigger", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain("Medium does NOT auto-trigger");
    });

    it("only High R-L Risk is mandatory for Recommended", () => {
      const result = generateInstructions(makeAnswers());
      expect(result).toContain('If you wrote "High" in the Red-Line Risk section above, you MUST mark the refund guard as Recommended');
      expect(result).not.toContain('If you wrote "Medium" or "High" in the Red-Line Risk section above, you MUST mark the refund guard as Recommended');
    });
  });

  describe("axis prominence gate", () => {
    it("describes the prominence gate at section level", () => {
      const result = generateInstructions(makeAnswers({ storyImportance: 5 }));
      expect(result).toContain("Prominence gate (applies to NEGATIVE penalties only)");
      expect(result).toContain("If the axis is **NOT prominent**, do NOT apply the negative penalty");
    });

    it("explicitly says bonuses bypass the prominence gate", () => {
      const result = generateInstructions(makeAnswers({ storyImportance: 5 }));
      expect(result).toContain("Bonuses always apply (no prominence gate)");
    });

    it("includes per-axis prominence criteria for active axes", () => {
      const result = generateInstructions(
        makeAnswers({
          storyImportance: 5,
          gameplayImportance: 4,
          combatImportance: 4,
        }),
      );
      expect(result).toContain("Per-axis prominence criteria");
      expect(result).toContain("Story & Narrative**: Prominent in narrative-driven games");
      expect(result).toContain("Combat Feel**: Prominent when combat is a core pillar");
    });

    it("marks Gameplay & Mechanics as always prominent in the active list", () => {
      const result = generateInstructions(makeAnswers({ gameplayImportance: 4 }));
      expect(result).toMatch(/Gameplay & Mechanics[^\n]*always prominent — penalty applies in every game/);
    });

    it("does not mark non-universal axes as always prominent", () => {
      const result = generateInstructions(
        makeAnswers({
          storyImportance: 5,
          gameplayImportance: 1,
        }),
      );
      expect(result).not.toMatch(/Story & Narrative[^\n]*always prominent/);
    });

    it("uses 2D action platformer as the worked example for skipping story penalty", () => {
      const result = generateInstructions(makeAnswers({ storyImportance: 5 }));
      expect(result).toContain(
        "weak story in a 2D action platformer that doesn't promise narrative is not a penalty",
      );
    });

    it("requires conservative default when prominence is unclear", () => {
      const result = generateInstructions(makeAnswers({ storyImportance: 5 }));
      expect(result).toContain(
        "When unclear whether an axis is prominent, default to NOT applying the penalty",
      );
    });

    it("requires AI to note when the prominence gate skips a penalty", () => {
      const result = generateInstructions(makeAnswers({ storyImportance: 5 }));
      expect(result).toContain(
        "When the prominence gate skips a penalty that would otherwise apply, briefly note this",
      );
    });

    it("excludes prominence section when no axes are active", () => {
      const result = generateInstructions(
        makeAnswers({
          storyImportance: 1,
          gameplayImportance: 1,
          explorationImportance: 1,
          combatImportance: 1,
          puzzleImportance: 1,
          strategyImportance: 1,
        }),
      );
      expect(result).not.toContain("Prominence gate");
    });

    it("only includes prominence criteria for active axes (not all six)", () => {
      const result = generateInstructions(
        makeAnswers({
          storyImportance: 5,
          gameplayImportance: 1,
          explorationImportance: 1,
          combatImportance: 1,
          puzzleImportance: 1,
          strategyImportance: 1,
        }),
      );
      expect(result).toContain("Story & Narrative**: Prominent in narrative-driven games");
      expect(result).not.toContain("Strategic Depth**: Prominent in strategy games");
      expect(result).not.toContain("Combat Feel**: Prominent when combat");
    });
  });
});
