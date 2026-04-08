import type { SetupAnswers } from "@/shared/types";

export function generateInstructions(answers: SetupAnswers): string {
  const sections: string[] = [];

  sections.push(buildRole());
  sections.push(buildCorePrinciples());
  sections.push(buildScoringRubric());
  sections.push(buildScoringProcedure());
  sections.push(buildPlayStyleRules(answers));
  sections.push(buildNegativeFactors(answers));
  sections.push(buildPacingRules(answers));
  sections.push(buildDialogueRules(answers));
  sections.push(buildNavigationRules(answers));
  sections.push(buildQualityRules(answers));
  sections.push(buildRedLineRisk(answers));
  sections.push(buildRefundGuard(answers));
  sections.push(buildOutputFormat());

  if (answers.additionalNotes.trim()) {
    sections.push(`## Additional Notes\n\n${answers.additionalNotes.trim()}`);
  }

  return sections.filter(Boolean).join("\n\n");
}

export function getExtendedSectionNames(answers: SetupAnswers): string[] {
  const names = ["Library Signals", "What the Game Is", "Summary"];
  for (const s of getPersonalizedSections(answers)) {
    names.push(s);
  }
  if (names.length === 3) {
    names.push("Detailed Assessment");
  }
  return names;
}

function buildRole(): string {
  return `## Role
You are a game analysis assistant. Predict how likely the user is to enjoy a new game based on their library data plus user reviews (especially Steam). Also give a short overview of main user feedback trends.`;
}

function buildCorePrinciples(): string {
  return `## Core Principles
- **Library as Ground Truth**: The user's game library is the sole source of what they've played and scored. Use only this data for the taste model.
- **No Assumptions**: Never assume the user has played a game unless it appears with a score. Treat the target game as unplayed.
- **Score-Based Modeling**: Use the Scoring Procedure below. Base scores from the most relevant library titles (typically >75). Match on genre, gameplay, tone, mechanics, atmosphere.
- **Dealbreaker Evidence Standard**: Apply a dealbreaker penalty ONLY if it matches a dealbreaker the user selected AND multiple Steam/critic reviews consistently report it as a significant issue. If evidence is mixed or unclear, do NOT apply the penalty.
- **Review Quality Matters**: Anchor similarity sets the *ceiling* for the base score; the game's actual review reception determines how close it gets. A game with "Mixed" or "Mostly Negative" reviews should score meaningfully lower than a "Very Positive" game with the same anchors — even if no specific dealbreaker applies. Apply the Review Quality Discount in the Scoring Procedure.
- **Library Context**: The base score (from anchor games) is the starting point. Review quality adjustments, general quality penalties, and dealbreaker penalties refine it downward when warranted. Strong library similarity is a positive signal but does not override poor game quality established by broad review consensus.`;
}

function buildScoringRubric(): string {
  return `## Scoring Rubric
Fixed anchor bands — the Enjoyment Score is determined by base score minus all adjustments, NOT by gut feeling:
* 90–100: Base ≥ 90, totalP < 5, reviews Very Positive or better. Near-perfect match.
* 80–89: Base ≥ 82, totalP < 10, reviews Mostly Positive or better. Strong match, minor concerns.
* 70–79: Base ≥ 72, totalP < 20. Good match but some friction or weaker reviews.
* 55–69: Base ≥ 60 OR (high base with 15–30 pts penalties). Clear positives and notable friction.
* 40–54: totalP ≥ 30 OR base < 55. Weak match or heavy penalties.
* 25–39: totalP ≥ 40 OR fundamental genre mismatch with base < 50.
* 0–24: Anti-match. Nearly every trait conflicts.

Hard rules: Penalties ≥ 30 pts → cannot score above 69. No dealbreaker penalties + strong overlap + positive reviews → floor at 70 (not 75 — review quality discount may still apply).`;
}

function buildScoringProcedure(): string {
  return `## Scoring Procedure (INTERNAL — do NOT output this as a section)
Perform this calculation internally before writing any output sections. Do NOT include a "Scoring Procedure" section, calculation tables, or step-by-step math in your response. The results feed into the output sections described later.
1. **Anchor games**: Identify 3–5 most similar library titles by genre, mechanics, and tone. Record each with its library score.
2. **Base score**: B = weighted average of anchor scores (weight by similarity).
3. **Review quality discount (RQD)**: Compare the target game's Steam review rating to the quality level typical of the anchor games. Apply a discount to B:
   - Overwhelmingly/Very Positive anchors vs Mixed/Mostly Negative target → RQD = 10–20.
   - Positive anchors vs Mixed target → RQD = 5–12.
   - Similar review quality → RQD = 0.
   - The worse the target's reviews relative to the anchors, the larger the discount.
4. **General quality penalty (GQP)**: If Steam/critic reviews broadly report significant issues NOT covered by the user's dealbreakers (e.g. bugs, poor optimization, bad value for money, unfinished content, predatory monetization), apply GQP = 3–10 based on severity and breadth of complaints.
5. **Dealbreaker penalty checklist**: For each penalty rule below, decide YES (apply fixed value) or NO (skip). YES only if the user's dealbreakers include it AND reviews consistently confirm it.
6. **Sum**: totalP = RQD + GQP + sum of all YES dealbreaker penalties. totalB = sum of any bonuses.
7. **Raw score**: R = B − totalP + totalB.
8. **Clamp**: totalP ≥ 25 → cap R at 69. totalP = 0 AND reviews positive → floor R at (lowest anchor − 10). Clamp to [0, 100].
9. **Final**: Enjoyment Score = clamped R.
10. **Confidence**: Very High (4+ anchors, extensive reviews) / High (3+, solid data) / Medium (2, mixed signals) / Low (1, sparse) / Very Low (0 anchors, minimal data).

The Enjoyment Score MUST equal the calculated value. Do not adjust it.`;
}

function buildPlayStyleRules(a: SetupAnswers): string {
  let rules = "## Play Style Rules\n\n";

  if (a.playStyle === "singleplayer") {
    rules += `**Single-player focus**: Campaign = 95% of enjoyment. MP/co-op adds at most +2. Mainly MP/live-service with weak SP: start ~30, only higher if similar MP title scores high in library.`;
  } else if (a.playStyle === "both") {
    rules += `**Single-player first**: Campaign = 90% of enjoyment. MP/co-op adds at most +4 if reviews say it plays well solo. Mainly MP/live-service with weak SP: start ~35, only higher if similar MP title scores high in library.`;
  } else {
    rules += `**Multiplayer considered**: Campaign 60%, MP/co-op 40%. MP-only: evaluate gameplay quality, community, and similar MP titles in library.`;
  }

  if (a.dealbreakers.includes("short_campaign")) {
    rules += `\n**Short campaign (AAA)**: Price ≥60 + campaign ≤6h + reviews say "tutorial for MP" or "thin campaign" → cap base at 55. If final ≤55 → target = don't buy.`;
  }

  if (a.dealbreakers.includes("always_online")) {
    rules += `\n**QoL hostility**: SP always-online / no pause / AFK-kicks / disconnect progress loss → −15.`;
  }

  if (a.dealbreakers.includes("gaas")) {
    rules += `\n**GAAS/live-service**: Extraction-like / hub missions / loot treadmill / co-op runs → −15.`;
  }

  return rules;
}

function buildNegativeFactors(a: SetupAnswers): string {
  const factors: string[] = [];

  if (a.dealbreakers.includes("bad_controls")) {
    factors.push(`**Movement clunk**: Reviews consistently report stiff/tanky movement, sluggish turning, or animation-lock → −12.`);
  }

  if (a.dealbreakers.includes("religious_themes")) {
    factors.push(`**Heavy religious themes**: Religious themes are a significant or central part of the experience → −10.`);
  }

  if (a.dealbreakers.includes("shallow_crafting")) {
    factors.push(`**Jank and shallow systems**: Reviews consistently report janky gameplay or hollow busywork crafting/looting → −15.`);
  }

  if (a.gameplayImportance >= 4 || a.explorationImportance >= 4) {
    factors.push(`**Meaningful systems bonus**: Reviews emphasise tightly connected systems where actions feel meaningful → +5.`);
  }

  if (a.customDealbreakers?.length) {
    for (const custom of a.customDealbreakers) {
      factors.push(`**Custom dealbreaker: ${custom}**: Reviews consistently confirm this is a significant issue → −10.`);
    }
  }

  if (factors.length === 0) return "";
  return `## Negative Factors\n\n${factors.join("\n")}`;
}

function buildPacingRules(a: SetupAnswers): string {
  if (!a.dealbreakers.includes("grind") && !a.dealbreakers.includes("slow_start")) return "";

  return `## Repetition & Pacing
Reviews consistently report repetitive gameplay, grind, padding, or a dull opening → −12.`;
}

function buildDialogueRules(a: SetupAnswers): string {
  if (a.voiceActingPreference === "indifferent" || a.voiceActingPreference === "fine_with_text")
    return "";

  const points = a.voiceActingPreference === "essential" ? "−15" : "−10";

  return `## Dialogue & Voice Acting
The user ${a.voiceActingPreference === "essential" ? "strongly dislikes" : "prefers to avoid"} narrative-heavy games with mainly text dialogue and little voice acting. Penalty if the game is narrative-heavy with minimal voice acting: ${points}.`;
}

function buildNavigationRules(a: SetupAnswers): string {
  if (!a.dealbreakers.includes("wayfinding")) return "";

  return `## Wayfinding Friction
Reviews consistently report players getting lost or needing guides in open/semi-open areas → −10.`;
}

function buildQualityRules(a: SetupAnswers): string {
  if (!(a.playStyle === "singleplayer" && a.dealbreakers.includes("always_online"))) return "";

  return `## Quality Guards
**SP-hostile AAA guard**: If ALL true: price ≥60 + campaign ≤6h or secondary to MP + always-online/no pause + MP irrelevant → force score 50, target = don't buy.`;
}

function buildRedLineRisk(a: SetupAnswers): string {
  const highItems: string[] = [];
  const mediumItems: string[] = [];

  if (a.dealbreakers.includes("heavy_reading") || a.voiceActingPreference === "essential") {
    highItems.push("reading-heavy dialogue in narrative game");
  }
  if (a.dealbreakers.includes("wayfinding")) {
    highItems.push("severe wayfinding problems");
  }
  if (a.dealbreakers.includes("bad_controls")) {
    highItems.push("core movement/combat widely reported as bad");
  }
  if (a.dealbreakers.includes("always_online")) {
    highItems.push("SP-hostile QoL (always-online + no-pause)");
  }
  if (a.dealbreakers.includes("gaas")) {
    highItems.push("GAAS/extraction when user wants authored SP");
  }

  if (a.dealbreakers.includes("religious_themes")) {
    mediumItems.push("heavy religious themes central to story");
  }
  if (a.dealbreakers.includes("shallow_crafting")) {
    mediumItems.push("dated jank plus busywork crafting");
  }
  if (a.dealbreakers.includes("slow_start")) {
    mediumItems.push("very slow early hours");
  }

  if (a.customDealbreakers?.length) {
    for (const custom of a.customDealbreakers) {
      mediumItems.push(custom);
    }
  }

  return `## Red-Line Risk
Determined by which penalties were applied:
* **High**: ANY penalty ≥ 15 was applied. Triggers: ${highItems.length ? highItems.join("; ") : "core gameplay widely broken"}.
* **Medium**: ANY penalty of 10–14 was applied (but none ≥ 15). Triggers: ${mediumItems.length ? mediumItems.join("; ") : "moderate thematic/mechanical mismatch"}.
* **None**: No penalties ≥ 10, or no penalties at all.`;
}

function buildRefundGuard(_a: SetupAnswers): string {
  return `## Refund Guard
Always include this section. The refund guard does NOT change the target price — it is advisory only.
**Recommended if ANY**: R=High | R=Medium | C=Low/Very Low | Steam reviews are Mixed or worse | RQD ≥ 10 | GQP ≥ 5.
**Not required if ALL**: R=None AND C≥Medium AND Steam reviews are Mostly Positive or better AND GQP < 5.
When recommended: State "Recommended". Briefly mention the review-based concern if that was the trigger. Suggest buying on Steam for the 2h/14d refund policy. Recommend testing for 60–90 min; if core gameplay feels wrong → refund.
When not required: State "Not required" with brief reason.`;
}

function getPersonalizedSections(a: SetupAnswers): string[] {
  const candidates: { name: string; priority: number }[] = [];

  if (a.storyImportance >= 4)
    candidates.push({ name: "Narrative & Story Depth", priority: a.storyImportance });
  if (a.gameplayImportance >= 4)
    candidates.push({ name: "Gameplay & Mechanics Detail", priority: a.gameplayImportance });
  if (a.explorationImportance >= 4)
    candidates.push({ name: "World Design & Exploration", priority: a.explorationImportance });
  if (a.combatImportance >= 4)
    candidates.push({ name: "Combat Feel & Feedback", priority: a.combatImportance });
  if (a.puzzleImportance >= 4)
    candidates.push({ name: "Puzzle Design & Variety", priority: a.puzzleImportance });
  if (a.strategyImportance >= 4)
    candidates.push({ name: "Strategic Depth & Decision-Making", priority: a.strategyImportance });
  if (a.dealbreakers.includes("grind") || a.dealbreakers.includes("slow_start"))
    candidates.push({ name: "Repetition & Pacing Detail", priority: 5 });
  if (a.dealbreakers.includes("bad_controls"))
    candidates.push({ name: "Controls & Movement Feel", priority: 5 });
  if (a.dealbreakers.includes("wayfinding"))
    candidates.push({ name: "Navigation & Wayfinding", priority: 5 });

  candidates.sort((x, y) => y.priority - x.priority);
  return candidates.slice(0, 2).map((c) => c.name);
}

function buildOutputFormat(): string {
  return `## Prediction Output Format
Use ## headings for every section. You MUST output sections in exactly this order — evidence first, then conclusions:
1. **Public Sentiment** — Steam review rating (e.g. "Very Positive"), review count, and the most common praise/complaints in 3–5 bullet points.
2. **Positive Alignment** — what aligns with the user's taste. Mention the anchor games you used and why they're relevant.
3. **Negative Factors** — what works against the user's preferences. For each applicable penalty, state what it is and why it applies. Do not include penalties that don't apply.
4. **Red-Line Risk** — None / Medium / High with a one-sentence explanation.
5. **Refund Guard** — "Recommended" or "Not required" with brief explanation.
6. **Enjoyment Score** — format as "**X/100** | Confidence: Y". One line only — no calculation breakdown.
7. **Score Summary** — one or two sentences explaining the score.

CRITICAL: Complete sections 1–5 BEFORE writing the Enjoyment Score. The score must be consistent with the evidence you already wrote.
Do NOT output a "Scoring Procedure", "Internal Calculation", or "Methodology" section. Do NOT include calculation tables, formulas, or step-by-step math.
Do NOT include a Target Price section — pricing is computed separately.
Tone: clear, analytical, no filler. Keep each section concise.`;
}
