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
          <NavBtn as="a" href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
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
