"use client";

import React from "react";
import {
  HelpRoot,
  HelpHeader,
  HelpTitle,
  HelpSubtitle,
  TOC,
  TOCLink,
  Section,
  SectionAnchor,
  SubHeading,
  P,
  OL,
  UL,
  Callout,
} from "./HelpPage.styles";

const SECTIONS = [
  { id: "what-is-gamefit", label: "What is GameFit?" },
  { id: "free-trial", label: "Starter analyses" },
  { id: "api-key", label: "API keys explained" },
  { id: "library", label: "Your game library" },
  { id: "scoring", label: "How scoring works" },
  { id: "importing", label: "Importing from apps" },
  { id: "analyzing", label: "Running an analysis" },
  { id: "results", label: "Reading your results" },
  { id: "faq", label: "FAQ" },
] as const;

export function HelpPage() {
  return (
    <HelpRoot>
      <HelpHeader>
        <HelpTitle>Help &amp; Guide</HelpTitle>
        <HelpSubtitle>
          Everything you need to know about using GameFit, from initial setup to getting the most
          out of your game analyses.
        </HelpSubtitle>
      </HelpHeader>

      <TOC aria-label="Table of contents">
        {SECTIONS.map(({ id, label }) => (
          <TOCLink key={id} href={`#${id}`}>
            {label}
          </TOCLink>
        ))}
      </TOC>

      {/* ───── What is GameFit? ───── */}
      <Section>
        <SectionAnchor id="what-is-gamefit">What is GameFit?</SectionAnchor>
        <P>
          GameFit is your personal game purchasing assistant. It uses AI to analyze whether a game
          is a good fit <strong>for you specifically</strong> — based on your gaming taste, play
          history, and preferences — rather than giving a generic review score.
        </P>
        <P>Here&apos;s how it works at a high level:</P>
        <OL>
          <li>
            You tell GameFit what you like — play style, difficulty preference, dealbreakers, and
            what matters most to you in a game (story, combat, exploration, etc.).
          </li>
          <li>
            You build a <strong>game library</strong> of titles you&apos;ve played and score them.
            This becomes the AI&apos;s reference point for your taste.
          </li>
          <li>
            When you&apos;re considering buying a game, enter its name and price. The AI searches
            the web for reviews, compares them against your personal taste profile and library, and
            gives you a personalized enjoyment prediction with a target price.
          </li>
        </OL>
        <Callout $variant="tip">
          <strong>
            The more games you score in your library, the better the AI understands your taste.
          </strong>{" "}
          Even 10–15 scored games make a noticeable difference in accuracy.
        </Callout>
      </Section>

      {/* ───── Starter analyses ───── */}
      <Section>
        <SectionAnchor id="free-trial">Starter analyses</SectionAnchor>
        <P>
          Every new account comes with <strong>5 starter analyses</strong> using our API key, so you
          can test the full AI-powered analysis without setting up anything first.
        </P>

        <SubHeading>How it works</SubHeading>
        <OL>
          <li>
            During setup, click <strong>&quot;Skip — use our key&quot;</strong> on the AI Provider
            step to skip the API key configuration entirely.
          </li>
          <li>
            Complete the rest of setup — set your taste preferences and import your game library as
            normal.
          </li>
          <li>
            Go to the Analyze page and run your first analysis. You&apos;ll see a badge showing how
            many starter analyses you have remaining.
          </li>
          <li>
            Each analysis uses one of your 5 starter slots. Starter analyses use the same AI model
            (Claude) and web search as BYOK analyses — there&apos;s no quality difference.
          </li>
        </OL>

        <SubHeading>What happens after 5 analyses?</SubHeading>
        <P>
          Once you&apos;ve used all 5 starter analyses, you&apos;ll see a message on the Analyze
          page with step-by-step instructions for adding your own API key. You can also add a key at
          any time from <strong>Settings &rarr; AI Provider</strong>.
        </P>
        <P>
          Adding your own API key unlocks <strong>unlimited analyses</strong> with no restrictions.
          You can choose any supported provider (Anthropic, OpenAI, Google, or a custom endpoint)
          and any model. Most providers offer free starter credits, so you can keep going without
          paying anything.
        </P>

        <Callout $variant="tip">
          <strong>Starter analyses are identical to regular ones.</strong> They use Claude with web
          search enabled, personalized to your taste profile and scored library — the same quality
          you&apos;d get with your own API key.
        </Callout>

        <SubHeading>Can I get more starter analyses?</SubHeading>
        <P>
          The 5 starter analyses are a one-time allowance per account. They cannot be reset or
          replenished. However, setting up your own API key is quick (about 2 minutes) and each
          analysis costs only a fraction of a cent.
        </P>
      </Section>

      {/* ───── API keys explained ───── */}
      <Section>
        <SectionAnchor id="api-key">API keys explained</SectionAnchor>
        <P>
          GameFit doesn&apos;t have its own AI — instead, it connects to an AI provider of your
          choice (Anthropic, OpenAI, Google, or a custom endpoint). To do this, you need an{" "}
          <strong>API key</strong>.
        </P>

        <SubHeading>What is an API key?</SubHeading>
        <P>
          An API key is like a password that lets GameFit talk to the AI service on your behalf. You
          get it from the AI provider&apos;s website and paste it into GameFit during setup. Each
          analysis uses a tiny amount of the provider&apos;s credit (usually fractions of a cent).
        </P>

        <SubHeading>How to get one</SubHeading>
        <OL>
          <li>
            <strong>Anthropic (Claude):</strong> Go to <code>console.anthropic.com</code>, create an
            account, navigate to API Keys, and create a new key. You&apos;ll get some free credits
            to start.
          </li>
          <li>
            <strong>OpenAI (GPT):</strong> Go to <code>platform.openai.com</code>, sign up, go to
            API Keys in your dashboard, and create a new secret key.
          </li>
          <li>
            <strong>Google (Gemini):</strong> Go to <code>aistudio.google.com</code>, sign in with
            your Google account, and create an API key from the API keys section.
          </li>
        </OL>

        <Callout $variant="info">
          <strong>Your key stays private.</strong> GameFit stores your API key only in your browser
          — it is never sent to GameFit&apos;s servers. Requests go directly from your browser to
          the AI provider. You are billed by the provider, not by GameFit.
        </Callout>

        <SubHeading>How much does it cost?</SubHeading>
        <P>
          A single game analysis typically costs between $0.01 and $0.05 depending on the model.
          Most providers offer free starter credits. A &quot;More Details&quot; expansion adds
          roughly the same cost again.
        </P>
      </Section>

      {/* ───── Your game library ───── */}
      <Section>
        <SectionAnchor id="library">Your game library</SectionAnchor>
        <P>
          Your game library is the foundation of accurate analyses. It tells the AI what kinds of
          games you enjoy (and how much), so it can predict whether a new game will suit you.
        </P>

        <SubHeading>Why it matters</SubHeading>
        <P>
          When you run an analysis, <strong>only games that have a score</strong> are sent to the AI
          as reference points. If your library is empty or no games are scored, the AI has no
          personal context and will give generic recommendations — it won&apos;t know that you loved
          Hollow Knight but hated Fortnite.
        </P>

        <Callout $variant="warning">
          <strong>Imported but unscored games are invisible to the AI.</strong> After importing your
          library, make sure to score your games. Even a rough score is far better than no score at
          all.
        </Callout>

        <SubHeading>How many games should I score?</SubHeading>
        <P>
          Aim for at least <strong>10–15 scored games</strong> across a range of genres. Include
          games you loved (high scores), games you thought were okay (mid scores), and games you
          disliked (low scores). This gives the AI contrast to work with.
        </P>
      </Section>

      {/* ───── How scoring works ───── */}
      <Section>
        <SectionAnchor id="scoring">How scoring works</SectionAnchor>
        <P>
          GameFit uses a 0–100 scoring scale. There are two different ways to score a game,
          depending on how much you liked it:
        </P>

        <SubHeading>Games scored 76 and above — score them yourself</SubHeading>
        <P>
          If you genuinely loved a game — it left an impression, you&apos;d recommend it to others,
          or you&apos;d replay it — you should score it <strong>manually</strong> in the 76–100
          range. This is intentional:
        </P>
        <UL>
          <li>
            <strong>76+</strong> represents a personal endorsement. Only you know the difference
            between a game you loved (92) and one you merely enjoyed (78).
          </li>
          <li>
            The AI weighs high-scored games more heavily as positive taste anchors, so{" "}
            <strong>accuracy here matters the most</strong>.
          </li>
          <li>
            Time played alone can&apos;t capture whether you truly loved a game — some short
            masterpieces deserve a 95, while some 100-hour games were just &quot;fine.&quot;
          </li>
        </UL>

        <Callout $variant="tip">
          <strong>How to compare and prioritize:</strong> Pick your all-time favorite game and give
          it 95–100. Then ask yourself for each other game: &quot;Did I enjoy this as much?&quot;
          Rank them relative to your top pick. A game you loved but not quite as much might be an
          85. One you really liked but wouldn&apos;t replay might be a 78.
        </Callout>

        <SubHeading>Games scored 75 and below — use the Score Calculator</SubHeading>
        <P>
          For games you didn&apos;t love — ones you thought were okay, mediocre, or bad — use the{" "}
          <strong>Score Calculator</strong> (available in the sidebar and inside your library). It
          turns your playtime into a 0–75 score:
        </P>
        <UL>
          <li>Enter how long you played the game</li>
          <li>Check whether you finished it or not</li>
          <li>
            Finished games get their time doubled and can reach the maximum calculator score of 75.
            Unfinished games cap at 74.
          </li>
        </UL>
        <P>
          The idea:{" "}
          <strong>
            the more time you voluntarily put into a game, the more you probably enjoyed it
          </strong>{" "}
          — but if you didn&apos;t love it enough to score it 76+, the calculator handles the rest
          automatically.
        </P>

        <SubHeading>Why is the cutoff at 76?</SubHeading>
        <P>
          The 76 boundary separates &quot;games you should think about and rank personally&quot;
          from &quot;games where time played is a good enough proxy.&quot; It ensures the AI gets
          precise taste signals for the games that matter most to you, while still having useful
          data for everything else.
        </P>
      </Section>

      {/* ───── Importing from apps ───── */}
      <Section>
        <SectionAnchor id="importing">Importing from apps</SectionAnchor>
        <P>
          You can import your game library from several sources. GameFit accepts CSV, JSON, and
          plain text files.
        </P>

        <SubHeading>From Playnite</SubHeading>
        <OL>
          <li>Open Playnite and go to your library view</li>
          <li>Select all games (Ctrl+A) or the ones you want to export</li>
          <li>
            Right-click → <strong>Export</strong> (or use the menu: Main menu → Library → Export
            Library)
          </li>
          <li>
            Choose <strong>CSV</strong> as the format
          </li>
          <li>
            Make sure the <strong>Name</strong> column is included (and optionally a score/rating
            column if you&apos;ve rated games in Playnite)
          </li>
          <li>Save the file and drag it into GameFit&apos;s import area</li>
        </OL>

        <SubHeading>From GOG Galaxy</SubHeading>
        <OL>
          <li>
            GOG Galaxy doesn&apos;t have a built-in export, but you can use the community tool{" "}
            <code>gog-galaxy-export</code> (search GitHub)
          </li>
          <li>Export your library as CSV</li>
          <li>Drag the CSV into GameFit&apos;s import area</li>
        </OL>

        <SubHeading>From Steam</SubHeading>
        <P>
          GameFit can import directly from Steam during setup or from the Library page. You just
          need your Steam ID (the number in your profile URL) and your game list must be set to
          public in Steam&apos;s privacy settings.
        </P>

        <SubHeading>From Epic Games</SubHeading>
        <P>
          GameFit can import your Epic Games library during setup or from the Library page. Click
          &quot;Connect Epic Games&quot;, log in on the tab that opens, then copy the authorization
          code shown on the page and paste it back into GameFit. Your owned games will be imported
          automatically.
        </P>

        <SubHeading>Manual entry</SubHeading>
        <P>
          You can also paste a list of game names (one per line) or add games individually using the
          &quot;+ Add Game&quot; button in your library. You can optionally include scores in the
          format <code>Game Name 85</code> or <code>Game Name: 85</code>.
        </P>

        <Callout $variant="info">
          <strong>Duplicate handling:</strong> When importing, GameFit automatically detects
          duplicates by name and keeps the entry with the higher score. You won&apos;t end up with
          duplicate entries.
        </Callout>
      </Section>

      {/* ───── Running an analysis ───── */}
      <Section>
        <SectionAnchor id="analyzing">Running an analysis</SectionAnchor>
        <P>
          To analyze a game, go to the <strong>Analyze</strong> page and enter:
        </P>
        <UL>
          <li>
            <strong>Game name</strong> — the title you&apos;re considering buying
          </li>
          <li>
            <strong>Price</strong> — what the game currently costs on your preferred storefront
          </li>
        </UL>
        <P>
          The AI will search the web for recent reviews and community sentiment, then compare
          everything against your taste profile and scored library to produce a personalized report.
        </P>
        <P>
          After the initial analysis, you can click <strong>More Details</strong> to get an expanded
          breakdown with additional sections tailored to your preferences (e.g., a deeper story
          analysis if story is important to you).
        </P>

        <Callout $variant="tip">
          <strong>For the best results:</strong> Make sure you have at least 10 scored games in your
          library, your preferences are up to date in Settings.
        </Callout>
      </Section>

      {/* ───── Reading your results ───── */}
      <Section>
        <SectionAnchor id="results">Reading your results</SectionAnchor>
        <P>An analysis report includes several key pieces:</P>
        <UL>
          <li>
            <strong>Enjoyment Score (0–100):</strong> A personalized prediction of how much{" "}
            <em>you</em> will enjoy the game, not a general quality rating. A game with a 90 on
            Metacritic might score 45 for you if it clashes with your preferences.
          </li>
          <li>
            <strong>Target Price:</strong> What the AI thinks the game is worth <em>to you</em>{" "}
            based on your predicted enjoyment. If the target price is lower than the asking price,
            it might be worth waiting for a sale.
          </li>
          <li>
            <strong>Confidence level:</strong> How sure the AI is about its prediction. Lower
            confidence means fewer data points (fewer reviews, fewer similar games in your library).
          </li>
          <li>
            <strong>Risk assessment:</strong> Flags potential dealbreakers or red flags specific to
            your preferences.
          </li>
          <li>
            <strong>Refund Guard:</strong> Whether the AI recommends keeping the refund window in
            mind based on risk level.
          </li>
        </UL>
        <P>
          Each section of the report (Positive Alignment, Negative Factors, Red-Line Risk, etc.)
          explains how specific aspects of the game interact with your preferences and library.
        </P>
      </Section>

      {/* ───── FAQ ───── */}
      <Section>
        <SectionAnchor id="faq">Frequently asked questions</SectionAnchor>

        <SubHeading>Do I need an API key to use GameFit?</SubHeading>
        <P>
          Not right away. Every new account includes <strong>5 starter analyses</strong> using
          our key — no setup needed. After that, you&apos;ll set up your own key from Anthropic,
          OpenAI, or Google. See the <a href="#free-trial">Starter analyses</a> and{" "}
          <a href="#api-key">API keys explained</a> sections for details.
        </P>

        <SubHeading>Can I change my preferences after setup?</SubHeading>
        <P>
          Yes — go to <strong>Settings</strong> and update your taste preferences at any time.
          Saving regenerates the AI instructions, so future analyses will reflect your changes. Past
          analyses in History are not affected.
        </P>

        <SubHeading>Why do results differ between AI providers?</SubHeading>
        <P>
          Each AI model has different strengths. Anthropic (Claude) and OpenAI (GPT) models include
          web search for up-to-date review data. Google Gemini and custom endpoints may not have web
          search, which can affect the accuracy of public sentiment information.
        </P>

        <SubHeading>Do I need to score every game in my library?</SubHeading>
        <P>
          No, but <strong>only scored games count</strong>. Unscored games exist in your library for
          bookkeeping but the AI never sees them. Prioritize scoring games you feel strongly about —
          both loved and disliked.
        </P>

        <SubHeading>Can I export my library?</SubHeading>
        <P>
          Yes — click <strong>Export CSV</strong> on the Library page to download your full library
          with scores as a CSV file.
        </P>

        <SubHeading>How do I delete my data?</SubHeading>
        <P>
          Go to <strong>Settings</strong> and use the reset option at the bottom of the page. This
          clears all your data including your API key, library, preferences, and analysis history.
        </P>
      </Section>
    </HelpRoot>
  );
}
