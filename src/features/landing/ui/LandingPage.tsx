"use client";

import { useState } from "react";
import { AuthPage } from "@/features/auth";
import { DOWNLOAD_URL, FEATURES, HOW_IT_WORKS_STEPS, WinIcon } from "./LandingPage.utils";
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
  LandingFooter,
} from "./LandingPage.styles";

export function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
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
          <NavBtn onClick={onGetStarted}>Log In</NavBtn>
          <NavBtn $primary onClick={onGetStarted}>
            Sign Up
          </NavBtn>
        </NavActions>
      </Nav>

      <Hero>
        <HeroBadge>Your Personal AI-Powered Game Reviewer</HeroBadge>
        <HeroTitle>Find out if a game is right for you before you buy</HeroTitle>
        <HeroSub>
          GameFit analyzes any game against your personal library and taste
          preferences to predict how much you&apos;ll enjoy it — complete with a
          confidence score, risk assessment, and price recommendation.
        </HeroSub>
        <HeroActions>
          <HeroCTA onClick={onGetStarted}>Get Started — It&apos;s Free</HeroCTA>
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

      <LandingFooter>&copy; {new Date().getFullYear()} GameFit. All rights reserved.</LandingFooter>
    </Page>
  );
}

export function LandingOrAuth() {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) return <AuthPage />;
  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
}
