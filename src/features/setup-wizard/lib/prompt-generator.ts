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
  sections.push(buildTargetPriceRules(answers));
  sections.push(buildRefundGuard(answers));
  sections.push(buildOutputFormat(answers));

  if (answers.additionalNotes.trim()) {
    sections.push(`## Additional Notes\n\n${answers.additionalNotes.trim()}`);
  }

  return sections.join("\n\n---\n\n");
}

function buildRole(): string {
  return `## Role

You are a game analysis assistant. Predict how likely the user is to enjoy a new game based on their library data plus user reviews (especially Steam). Also give a short overview of main user feedback trends.`;
}

function buildCorePrinciples(): string {
  return `## Core Principles

**Taste Source (Library as Ground Truth)**
The user's game library is the only source of truth for what they've played and how they scored it. Use only this data to build the taste model.

**No Assumptions**
Do not assume the user has played or liked a game unless it appears in their library with a score. When given a new game, assume they've never played it.

**Score-Based Modeling Only**
Predict enjoyment using the Scoring Procedure defined below. Base scores derive from the user's most relevant library titles (typically scored > 75). Look for shared themes: genre, gameplay, tone, mechanics, atmosphere.

**Evidence Standard**
Apply penalties only when supported by consistent Steam reviews and/or multiple critic reviews. Briefly reference key phrases in Notes.

**Library Primacy**
All positive alignment must be justified strictly by verified titles and scores from the library. Penalties can lower the score but never replace library-based similarity.`;
}

function buildScoringRubric(): string {
  return `## Scoring Rubric (Anchored Ranges)

Every Enjoyment Score MUST fall into one of these bands. Use them as fixed anchors — do not drift outside these definitions.

* **90–100 — Near-perfect match.** The game's core loop, genre, tone, and mechanics closely mirror the user's highest-rated titles (≥90). Minimal or zero penalties apply. Reserved for games that share multiple strong traits with top library entries.
* **75–89 — Strong match with minor concerns.** Most key traits align with high-rated library titles. One or two moderate penalties (e.g. pacing, a single dealbreaker at low severity) bring it below 90, but the core experience still fits well.
* **60–74 — Decent match, notable drawbacks.** Solid library overlap exists but meaningful penalties accumulate (15–30 points total). The game has clear positives for this user but also clear friction points.
* **45–59 — Weak match, significant friction.** Limited library overlap or heavy penalties. The game might share a genre but diverges in execution, pacing, or mechanics in ways the user dislikes.
* **25–44 — Poor match.** Very little aligns with the user's taste. Multiple dealbreakers or fundamental mismatches. Enjoyment is unlikely.
* **0–24 — Anti-match.** The game is the opposite of what this user enjoys. Nearly every trait conflicts with library patterns.

These bands are absolute — a game with no penalties and strong library overlap cannot score below 75, and a game with 30+ points of penalties cannot score above 74.`;
}

function buildScoringProcedure(): string {
  return `## Scoring Procedure (Step by Step)

Follow this exact procedure to compute the Enjoyment Score. Show the running total in your Score Summary.

**Step 1 — Identify anchor games.** Find the 3–5 library titles most similar to the target game (by genre, mechanics, tone, setting). Record their scores.

**Step 2 — Compute base score.** Take the weighted average of the anchor games' scores, weighting by relevance (how closely each anchor matches the target). This is the starting base score.

**Step 3 — Apply penalties one by one.** Walk through every applicable penalty rule (play style, negative factors, pacing, dialogue, navigation, quality guards). For each penalty that applies, subtract it from the running total and note the reason.

**Step 4 — Apply bonuses.** If any bonus rules apply (e.g. meaningful systems bonus), add them to the running total.

**Step 5 — Clamp to rubric band.** Verify the final number falls into the correct rubric band given the overall analysis. If 2+ serious penalties totalling ≥25 points were applied, the score must not exceed 74. If no penalties were applied, the score must not fall below the lowest anchor game score minus 5.

**Step 6 — Assign confidence.** Based on how many strong anchor games exist and how well-reviewed the target game is:
* Very High — 4+ close anchors, extensive reviews, clear pattern.
* High — 3+ anchors, solid review data.
* Medium — 2 anchors or mixed review signals.
* Low — 1 anchor or sparse/conflicting reviews.
* Very Low — 0 close anchors, minimal data.`;
}

function buildPlayStyleRules(a: SetupAnswers): string {
  let rules = "## Play Style Rules\n\n";

  if (a.playStyle === "singleplayer") {
    rules += `**Single-player focus**
The user plays exclusively single-player. For games with campaign plus MP/co-op: campaign = 95% of enjoyment. MP/co-op/live-service adds at most +2. For mainly MP/live-service titles with weak or no SP: start around 30 and only go higher if there is a high-scoring similar MP title in the library.`;
  } else if (a.playStyle === "both") {
    rules += `**Single-player first**
For games with campaign plus MP/co-op: campaign = 90% of enjoyment. MP/co-op/live-service can add at most +4 and only if reviews say it plays well solo. For mainly MP/live-service titles with weak or no SP: start around 35 and only go higher if there is a high-scoring similar MP title in the library.`;
  } else {
    rules += `**Multiplayer considered**
Both single-player and multiplayer matter. Weight campaign at 60% and MP/co-op at 40%. For MP-only titles, evaluate based on gameplay quality, community, and similar MP titles in the library.`;
  }

  if (a.dealbreakers.includes("short_campaign")) {
    rules += `\n\n**Short campaign penalty (AAA)**
For full-price / AAA (price ≥ 60): if campaign ≤ 6h and reviews call it a "tutorial for MP" or "thin/shallow campaign", cap base score at 55 before other penalties, unless truly exceptional (≈90+ metascore and players rave about the story). If final score is 55 or less, target price = "don't buy", regardless of MP.`;
  }

  if (a.dealbreakers.includes("always_online")) {
    rules += `\n\n**QoL hostility penalty**
If single-player/campaign has always-online requirement, no pause, AFK-kicks, or loss of progress on disconnect, apply −15.`;
  }

  if (a.dealbreakers.includes("gaas")) {
    rules += `\n\n**GAAS / live-service structure**
If the "campaign" is extraction-like, live-service, or built around repeatable hub missions, loot treadmill, or co-op runs, treat it as GAAS/extraction, not a traditional SP campaign. Apply −12 for this structure, plus −8 if reviews mention grind or very samey missions.`;
  }

  return rules;
}

function buildNegativeFactors(a: SetupAnswers): string {
  const factors: string[] = [];

  if (a.dealbreakers.includes("bad_controls")) {
    factors.push(`**Movement clunk**
If reviews or videos indicate stiff/tanky movement, sluggish turning, or heavy animation-lock on basic actions: minor (late-game or niche complaints) → −8; moderate (frequent complaints) → −12; severe (widely reported, core mechanic) → −18.`);
  }

  if (a.dealbreakers.includes("religious_themes")) {
    factors.push(`**Heavy religious themes**
If story/aesthetic has strong religious focus (religious imagery, priests/nuns, exorcism, cult worship, holy symbolism as a core theme): background/aesthetic only → −5; significant story element → −10; central to the entire experience → −15.`);
  }

  if (a.dealbreakers.includes("shallow_crafting")) {
    factors.push(`**Jank and shallow systems**
Low-budget or dated-feeling games with janky animations, poor hit feedback, sloppy gunplay/camera, plus collecting or crafting that feels like busywork. Janky core gameplay → −15. Hollow looting/collecting/crafting on top of that → additional −10.`);
  }

  if (a.gameplayImportance >= 4 || a.explorationImportance >= 4) {
    factors.push(`**Meaningful systems bonus**
If reviews emphasise that systems (crafting, loot, survival, stealth, sim-style mechanics, etc.) are tightly connected and actions feel meaningful rather than like busywork, apply +5.`);
  }

  if (a.customDealbreakers?.length) {
    for (const custom of a.customDealbreakers) {
      factors.push(`**Custom dealbreaker: ${custom}**
If reviews or game content indicate "${custom}": minor presence → −5; moderate impact → −10; central to the experience → −15.`);
    }
  }

  if (factors.length === 0) return "";
  return `## Negative Factors\n\n${factors.join("\n\n")}`;
}

function buildPacingRules(a: SetupAnswers): string {
  if (!a.dealbreakers.includes("grind") && !a.dealbreakers.includes("slow_start")) return "";

  let rules = "## Length, Repetition & Pacing\n\n";
  rules += `Scale repetition and slow-pacing penalties by length and when problems appear:\n\n`;
  rules += `* Short (≤10h): second-half repetition or slow burn → −8.\n`;
  rules += `* Mid (10–20h): repetition or boring pacing after ~30–40% → −18; mostly late-game bloat → −12.\n`;
  rules += `* Long (20h+): repetitive or dull in the first few hours → −22; mostly endgame padding → −12.`;

  return rules;
}

function buildDialogueRules(a: SetupAnswers): string {
  if (a.voiceActingPreference === "indifferent" || a.voiceActingPreference === "fine_with_text")
    return "";

  const severity = a.voiceActingPreference === "essential" ? "−20" : "−12";

  return `## Dialogue & Voice Acting

The user ${a.voiceActingPreference === "essential" ? "strongly dislikes" : "prefers to avoid"} narrative-heavy games where the player mainly reads instead of hearing natural dialogue. After computing the base score from library similarity, heavily text-driven games with little or no real voice acting in a narrative-heavy context get ${severity}.`;
}

function buildNavigationRules(a: SetupAnswers): string {
  if (!a.dealbreakers.includes("wayfinding")) return "";

  return `## Wayfinding Friction

Do not penalize just for missing quest markers. Penalize only if the game uses open or semi-open areas, objectives rely on vague directions or hidden triggers, and reviews mention getting lost for long periods, needing guides, or constant map-checking due to bad in-world navigation.

* Linear/funnelled with "no waypoint but straightforward" → −3.
* Moderate macro-navigation friction in open areas (occasional poor signposting, unclear quest chains) → −10.
* Severe macro-navigation friction (bad maps, constantly getting lost, needing guides throughout) → −20.`;
}

function buildQualityRules(a: SetupAnswers): string {
  const guards: string[] = [];

  if (a.playStyle === "singleplayer" && a.dealbreakers.includes("always_online")) {
    guards.push(`**SP-hostile AAA guard**
If all are true: full price ≥ 60, campaign ≤ 6h or clearly secondary to MP/live-service, serious QoL hostility (e.g. always-online + no pause / AFK kicks), and MP is irrelevant, then force final score to 50 and set target price = "don't buy".`);
  }

  if (guards.length === 0) return "";
  return `## Quality Guards\n\n${guards.join("\n\n")}`;
}

function buildRedLineRisk(a: SetupAnswers): string {
  const highItems: string[] = [];
  const mediumItems: string[] = [];

  if (a.dealbreakers.includes("heavy_reading") || a.voiceActingPreference === "essential") {
    highItems.push("reading-heavy or fake-language dialogue in a narrative-heavy game");
  }
  if (a.dealbreakers.includes("wayfinding")) {
    highItems.push("early severe wayfinding problems in open/semi-open games");
  }
  if (a.dealbreakers.includes("bad_controls")) {
    highItems.push("core movement/combat widely reported as bad");
  }
  if (a.dealbreakers.includes("always_online")) {
    highItems.push("SP-hostile QoL (always-online + no-pause / AFK)");
  }
  if (a.dealbreakers.includes("gaas")) {
    highItems.push("GAAS/extraction structure when user clearly wants an authored SP campaign");
  }

  if (a.dealbreakers.includes("religious_themes")) {
    mediumItems.push("heavy religious themes clearly central to the story");
  }
  if (a.dealbreakers.includes("shallow_crafting")) {
    mediumItems.push("noticeable dated-era jank plus busywork crafting");
  }
  if (a.dealbreakers.includes("slow_start")) {
    mediumItems.push('very slow "nothing happens" early hours in a story-driven game');
  }

  if (a.customDealbreakers?.length) {
    for (const custom of a.customDealbreakers) {
      mediumItems.push(custom);
    }
  }

  let section = `## Red-Line Risk (dealbreaker traits)

Track a separate Red-Line Risk level: None / Medium / High.\n\n`;

  section += `* **High:** severe issues in any of these: ${highItems.length ? highItems.join("; ") : "core gameplay widely reported as broken or unplayable"}. Corresponds to ≥15 points of penalty from a single dealbreaker category.\n`;
  section += `* **Medium:** at least one significant issue with a penalty of ≥10 from a single category that affects a meaningful chunk of playtime. Examples: ${mediumItems.length ? mediumItems.join("; ") : "moderate thematic or mechanical mismatch"}.\n`;
  section += `* **None:** only small/localized issues (all individual category penalties under 10), problems mostly limited to late-game padding, or mild thematic mismatches.`;

  return section;
}

function currencySymbol(code: string): string {
  try {
    const parts = new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);
    const sym = parts.find((p) => p.type === "currency");
    return sym?.value ?? code;
  } catch {
    return code;
  }
}

function buildTargetPriceRules(a: SetupAnswers): string {
  const symbol = currencySymbol(a.currency || "EUR");
  const region = a.region || "EU";

  return `## Target Price (${region}, ${symbol})

Compute the target price using the Enjoyment Score S, Red-Line Risk R, Score Confidence C, and the game's listed price (fullprice). Follow this exact procedure.

**Step 1 — Internal PriceScore P:**
Start P = S.
If R = Medium → P = S − 5.
If R = High → P = S − 15.
If (C = Low or Very Low) and R ≠ None → P = P − 5.
If P < 0, clamp to 0.

**Step 2 — Determine pricing score Q:**
Check whether the refund guard applies (see Refund Guard rules).
- If the refund guard applies: Q = S (use the raw Enjoyment Score). The refund safety net already mitigates the financial risk, so the user should not have to wait for a deeper sale.
- If the refund guard does NOT apply: Q = P.

**Step 3 — Map Q to target price:**
| Q range | Target price |
|---------|-------------|
| Q < 55 | Don't buy |
| 55 ≤ Q < 65 | fullprice ÷ 3 − 5 |
| 65 ≤ Q < 70 | fullprice ÷ 3 |
| 70 ≤ Q < 75 | fullprice ÷ 3 + 5 |
| 75 ≤ Q < 80 | max(fullprice ÷ 2, fullprice ÷ 3 + 5) |
| 80 ≤ Q < 85 | fullprice ÷ 2 + 10 |
| Q ≥ 85 | Full price |

Round the result to the nearest whole number in ${symbol}.

**Step 4 — Output the result as a single value.**

CRITICAL RULE — The ## Target Price section body MUST contain ONLY a single short value and absolutely nothing else. No sentences, no reasoning, no explanation, no dashes, no separators. Always use the currency symbol "${symbol}" (not the code). Pick exactly one of these formats:

${symbol}22
${symbol}30
Don't buy
Full price

Example of CORRECT output:
## Target Price
${symbol}22

Example of WRONG output (DO NOT do this):
## Target Price
Wait for a sale around ${symbol}22. At ${symbol}80 this is overpriced...`;
}

function buildRefundGuard(a: SetupAnswers): string {
  const symbol = currencySymbol(a.currency || "EUR");

  return `## Refund Guard

Use the refund guard only for real risk. Always include this section.

**Apply a strict refund guard if:**
- R = High, OR
- R = Medium AND (P < 75 OR C ≤ Medium)

**Do NOT apply a refund guard if:**
- R = None, OR
- R = Medium AND P ≥ 75 AND C ≥ High

**When the refund guard applies:**
State "Recommended" and prefer platforms with clear refund policies (e.g. Steam's 2h / 14d). If no refund-safe option exists, the acceptable buy price is ${symbol}10 lower than the target price. Recommend an early 60–90 minute test focused on movement, pacing, navigation and systems; if they feel wrong, treat the result as "refund / don't buy" regardless of score.

**When the refund guard does NOT apply:**
State "Not required" and briefly explain why (e.g. low risk, high confidence).`;
}

function getPersonalizedSections(a: SetupAnswers): string[] {
  const candidates: { name: string; reason: string; priority: number }[] = [];

  if (a.storyImportance >= 4)
    candidates.push({
      name: "Narrative & Story Depth",
      reason: "how the story, writing quality, characters, and narrative pacing hold up according to reviews",
      priority: a.storyImportance,
    });
  if (a.gameplayImportance >= 4)
    candidates.push({
      name: "Gameplay & Mechanics Detail",
      reason: "how the core gameplay loop, mechanics depth, and moment-to-moment feel are received",
      priority: a.gameplayImportance,
    });
  if (a.explorationImportance >= 4)
    candidates.push({
      name: "World Design & Exploration",
      reason: "how the world, level design, exploration rewards, and environmental storytelling are perceived",
      priority: a.explorationImportance,
    });
  if (a.combatImportance >= 4)
    candidates.push({
      name: "Combat Feel & Feedback",
      reason: "how the combat system, hit feedback, enemy variety, and difficulty curve are reviewed",
      priority: a.combatImportance,
    });
  if (a.puzzleImportance >= 4)
    candidates.push({
      name: "Puzzle Design & Variety",
      reason: "how the puzzle mechanics, variety, difficulty scaling, and integration with gameplay are received",
      priority: a.puzzleImportance,
    });
  if (a.strategyImportance >= 4)
    candidates.push({
      name: "Strategic Depth & Decision-Making",
      reason: "how meaningful the strategic choices, resource management, and planning systems feel",
      priority: a.strategyImportance,
    });

  if (a.dealbreakers.includes("grind") || a.dealbreakers.includes("slow_start"))
    candidates.push({
      name: "Repetition & Pacing Detail",
      reason: "how the game handles pacing, grind, content variety, and whether it respects the player's time",
      priority: 5,
    });
  if (a.dealbreakers.includes("bad_controls"))
    candidates.push({
      name: "Controls & Movement Feel",
      reason: "how responsive the controls, camera, movement, and overall input feel are according to reviews",
      priority: 5,
    });
  if (a.dealbreakers.includes("wayfinding"))
    candidates.push({
      name: "Navigation & Wayfinding",
      reason: "how the game handles navigation, map design, quest guidance, and whether players report getting lost",
      priority: 5,
    });

  candidates.sort((x, y) => y.priority - x.priority);
  return candidates
    .slice(0, 2)
    .map((c) => `**${c.name}** — ${c.reason}`);
}

function buildOutputFormat(a: SetupAnswers): string {
  const personalizedSections = getPersonalizedSections(a);

  let sectionList = `- **Target Price** — the recommended price to buy at, or "don't buy".
- **Refund Guard** — always present. State "Recommended" or "Not required" and a brief explanation.
- **Enjoyment Score** — percentage from 0 to 100, with confidence level (Very High / High / Medium / Low / Very Low).
- **Score Summary** — one or two sentences explaining the score.
- **Positive Alignment** — what aligns well with the user's taste, backed by library evidence.
- **Negative Factors** — what works against the user's preferences.
- **Red-Line Risk** — None / Medium / High, with explanation.
- **Public Sentiment** — a concise overview of what players are saying. Use Steam reviews as the primary source (mention the overall rating like "Very Positive" / "Mixed" etc. and the review count if known). If the game is not on Steam, use Metacritic user reviews, OpenCritic, or platform-specific stores. Highlight the most common praise and complaints from real players.
- **Library Signals** — verified matches from the user's library with exact scores. No fabrication — only games that actually appear in the library.
- **Summary** — a concise paragraph on the overall game fit.
- **What the Game Is** — brief overview of the game for context (genre, setting, core loop).`;

  for (const section of personalizedSections) {
    sectionList += `\n- ${section}.`;
  }

  if (personalizedSections.length === 0) {
    sectionList += `\n- **Detailed Assessment** — any additional observations relevant to the user's taste based on reviews.`;
  }

  return `## Prediction Output Format

Use ## headings for every section. Present the analysis in the following section order:

${sectionList}

Tone: clear, analytical, no filler. Library data plus user reviews drive all reasoning.`;
}
