"use client";

import { useState } from "react";
import { AuthPage } from "@/features/auth";
import {
  DOWNLOAD_URL,
  FEATURES,
  GITHUB_URL,
  GitHubIcon,
  HOW_IT_WORKS_STEPS,
  WinIcon,
} from "./LandingPage.utils";
import {
  Page,
  Nav,
  LogoGroup,
  LogoImg,
  LogoText,
  NavActions,
  NavBtn,
  Hero,
  HeroBadge,
  HeroTitle,
  HeroSub,
  HeroCTA,
  HeroActions,
  DownloadBtn,
  FreeTrialSection,
  FreeTrialCard,
  FreeTrialBadge,
  FreeTrialTitle,
  FreeTrialDesc,
  FreeTrialHighlights,
  FreeTrialHighlight,
  FreeTrialHighlightIcon,
  FreeTrialCTA,
  FreeTrialFootnote,
  WhatIsSection,
  WhatIsCard,
  WhatIsTitle,
  WhatIsText,
  WhatIsSteps,
  WhatIsTip,
  Features,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDesc,
  Section,
  SectionTitle,
  Steps,
  Step,
  StepNum,
  StepContent,
  StepTitle,
  StepDesc,
  ContributeSection,
  ContributeCard,
  ContributeIcon,
  ContributeTitle,
  ContributeDesc,
  LandingFooter,
} from "./LandingPage.styles";

export function LandingPage({
  onGetStarted,
}: {
  onGetStarted: (mode?: "login" | "signup") => void;
}) {
  return (
    <Page>
      <Nav>
        <LogoGroup>
          <LogoImg src="/icon.svg" alt="" width={32} height={32} />
          <LogoText>GameFit</LogoText>
        </LogoGroup>
        <NavActions>
          <NavBtn as="a" href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" $hideOnMobile>
            Download
          </NavBtn>
          <NavBtn onClick={() => onGetStarted("login")}>Log In</NavBtn>
          <NavBtn $primary onClick={() => onGetStarted("signup")}>
            Sign Up
          </NavBtn>
        </NavActions>
      </Nav>

      <Hero>
        <HeroBadge>Your Personal AI-Powered Game Reviewer</HeroBadge>
        <HeroTitle>Find out if a game is right for you before you buy</HeroTitle>
        <HeroSub>
          GameFit analyzes any game against your personal library and taste preferences to predict
          how much you&apos;ll enjoy it, complete with a confidence score, risk assessment, and
          price recommendation.
        </HeroSub>
        <HeroActions>
          <HeroCTA onClick={() => onGetStarted()}>Get Started — It&apos;s Free</HeroCTA>
          <DownloadBtn href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
            <WinIcon /> Download for Windows
          </DownloadBtn>
        </HeroActions>
      </Hero>

      <FreeTrialSection>
        <FreeTrialCard>
          <FreeTrialBadge>No credit card · No API key · No setup</FreeTrialBadge>
          <FreeTrialTitle>5 analyses on us, then bring your own key</FreeTrialTitle>
          <FreeTrialDesc>
            Not sure if GameFit is for you? Sign up and get 5 game analyses instantly — no
            API key required. Experience the full AI-powered analysis before deciding to continue.
          </FreeTrialDesc>
          <FreeTrialHighlights>
            <FreeTrialHighlight>
              <FreeTrialHighlightIcon>&#10003;</FreeTrialHighlightIcon>
              Full AI analysis with web search
            </FreeTrialHighlight>
            <FreeTrialHighlight>
              <FreeTrialHighlightIcon>&#10003;</FreeTrialHighlightIcon>
              Personalized to your taste profile
            </FreeTrialHighlight>
            <FreeTrialHighlight>
              <FreeTrialHighlightIcon>&#10003;</FreeTrialHighlightIcon>
              Confidence score &amp; price recommendation
            </FreeTrialHighlight>
          </FreeTrialHighlights>
          <FreeTrialCTA onClick={() => onGetStarted()}>
            Get Started
          </FreeTrialCTA>
          <FreeTrialFootnote>
            After 5 analyses, set up your own API key (takes ~2 min) for unlimited use.
          </FreeTrialFootnote>
        </FreeTrialCard>
      </FreeTrialSection>

      <WhatIsSection>
        <WhatIsCard>
          <WhatIsTitle>What is GameFit?</WhatIsTitle>
          <WhatIsText>
            GameFit is your personal game purchasing assistant. It uses AI to analyze whether a game
            is a good fit <strong>for you specifically</strong> — based on your gaming taste, play
            history, and preferences — rather than giving a generic review score.
          </WhatIsText>
          <WhatIsSteps>
            <Step>
              <StepNum>1</StepNum>
              <StepContent>
                <StepTitle>Define your taste</StepTitle>
                <StepDesc>
                  Tell GameFit what you like — play style, difficulty preference, dealbreakers, and
                  what matters most to you in a game (story, combat, exploration, etc.).
                </StepDesc>
              </StepContent>
            </Step>
            <Step>
              <StepNum>2</StepNum>
              <StepContent>
                <StepTitle>Build your library</StepTitle>
                <StepDesc>
                  Add games you&apos;ve played and score them. This becomes the AI&apos;s reference
                  point for understanding your taste.
                </StepDesc>
              </StepContent>
            </Step>
            <Step>
              <StepNum>3</StepNum>
              <StepContent>
                <StepTitle>Get personalized verdicts</StepTitle>
                <StepDesc>
                  Enter any game and its price. The AI searches the web for reviews, compares them
                  against your taste profile and library, and gives you a personalized enjoyment
                  prediction with a target price.
                </StepDesc>
              </StepContent>
            </Step>
          </WhatIsSteps>
          <WhatIsTip>
            <strong>The more games you score, the smarter it gets.</strong> Even 10–15 scored games
            make a noticeable difference in accuracy.
          </WhatIsTip>
        </WhatIsCard>
      </WhatIsSection>

      <Features>
        {FEATURES.map((f) => (
          <FeatureCard key={f.title}>
            <FeatureIcon>{f.icon}</FeatureIcon>
            <FeatureTitle>{f.title}</FeatureTitle>
            <FeatureDesc>{f.desc}</FeatureDesc>
          </FeatureCard>
        ))}
      </Features>

      <Section>
        <SectionTitle>How It Works</SectionTitle>
        <Steps>
          {HOW_IT_WORKS_STEPS.map((s, i) => (
            <Step key={s.title}>
              <StepNum>{i + 1}</StepNum>
              <StepContent>
                <StepTitle>{s.title}</StepTitle>
                <StepDesc>{s.desc}</StepDesc>
              </StepContent>
            </Step>
          ))}
        </Steps>
      </Section>

      <ContributeSection>
        <SectionTitle>Contribute</SectionTitle>
        <ContributeCard href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          <ContributeIcon>
            <GitHubIcon />
          </ContributeIcon>
          <ContributeTitle>Open Source on GitHub</ContributeTitle>
          <ContributeDesc>
            GameFit is free and open source. Report bugs, suggest features, or contribute code —
            every bit helps make the project better.
          </ContributeDesc>
        </ContributeCard>
      </ContributeSection>

      <LandingFooter>&copy; {new Date().getFullYear()} GameFit. All rights reserved.</LandingFooter>
    </Page>
  );
}

export function LandingOrAuth() {
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  if (authMode) return <AuthPage initialMode={authMode} onBack={() => setAuthMode(null)} />;
  return <LandingPage onGetStarted={(mode) => setAuthMode(mode ?? "signup")} />;
}
