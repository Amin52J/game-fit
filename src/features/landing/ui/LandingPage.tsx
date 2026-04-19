"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { AuthPage } from "@/features/auth";
import {
  DISCUSSIONS_URL,
  DOWNLOAD_URL,
  FEATURES,
  GITHUB_URL,
  GitHubIcon,
  DiscussionsIcon,
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
  VideoSection,
  VideoWrapper,
  VideoPlayOverlay,
  VideoOverlayBrand,
  VideoBrandName,
  VideoPlayButton,
  VideoNativePlayer,
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
  ContributeCards,
  ContributeCard,
  ContributeIcon,
  ContributeTitle,
  ContributeDesc,
  LandingFooter,
} from "./LandingPage.styles";

function DemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);

  const handleFirstPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    setEnded(false);
    video.play();
  }, []);

  const handleReplay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play();
    setEnded(false);
  }, []);

  const handleEnded = useCallback(() => {
    setEnded(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setEnded(false);
    video.addEventListener("play", onPlay);
    return () => video.removeEventListener("play", onPlay);
  }, []);

  return (
    <VideoSection>
      <VideoWrapper>
        <VideoNativePlayer
          ref={videoRef}
          src="https://assets.gameorwait.com/GameOrWait.mp4"
          preload="none"
          playsInline
          controls={started && !ended}
          onEnded={handleEnded}
          $visible={started && !ended}
        />
        {!started && (
          <VideoPlayOverlay onClick={handleFirstPlay}>
            <VideoOverlayBrand>
              <LogoImg src="/icon.svg" alt="" width={48} height={48} priority />
              <VideoBrandName>GameOrWait</VideoBrandName>
            </VideoOverlayBrand>
            <VideoPlayButton />
          </VideoPlayOverlay>
        )}
        {started && ended && (
          <VideoPlayOverlay $ended onClick={handleReplay}>
            <VideoOverlayBrand>
              <LogoImg src="/icon.svg" alt="" width={48} height={48} priority />
              <VideoBrandName>GameOrWait</VideoBrandName>
            </VideoOverlayBrand>
            <VideoPlayButton />
          </VideoPlayOverlay>
        )}
      </VideoWrapper>
    </VideoSection>
  );
}

export function LandingPage({
  onGetStarted,
}: {
  onGetStarted: (mode?: "login" | "signup") => void;
}) {
  return (
    <Page>
      <Nav>
        <LogoGroup>
          <LogoImg src="/icon.svg" alt="" width={32} height={32} priority />
          <LogoText>GameOrWait</LogoText>
        </LogoGroup>
        <NavActions>
          <NavBtn
            as="a"
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            $hideOnMobile
          >
            Download
          </NavBtn>
          <NavBtn onClick={() => onGetStarted("login")}>Log In</NavBtn>
          <NavBtn $primary onClick={() => onGetStarted("signup")}>
            Sign Up
          </NavBtn>
        </NavActions>
      </Nav>

      <Hero>
        <HeroBadge>Your Personal Game Reviewer</HeroBadge>
        <HeroTitle>Never regret a game purchase again</HeroTitle>
        <HeroSub>
          Tired of buying games you never finish? GameOrWait uses AI to predict whether you&apos;ll
          actually enjoy a game and at what price point — based on your taste, not generic reviews.
        </HeroSub>
        <HeroActions>
          <HeroCTA onClick={() => onGetStarted()}>Get Started — It&apos;s Free</HeroCTA>
          <DownloadBtn href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
            <WinIcon /> Download for Windows
          </DownloadBtn>
        </HeroActions>
      </Hero>

      <DemoVideo />

      <FreeTrialSection>
        <FreeTrialCard>
          <FreeTrialBadge>No credit card · No API key · No setup</FreeTrialBadge>
          <FreeTrialTitle>5 analyses on us, then bring your own key</FreeTrialTitle>
          <FreeTrialDesc>
            Not sure if GameOrWait is for you? Sign up and get 5 game analyses instantly — no API
            key required. Experience the full AI-powered analysis before deciding to continue.
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
          <FreeTrialCTA onClick={() => onGetStarted()}>Get Started</FreeTrialCTA>
          <FreeTrialFootnote>
            After 5 analyses, set up your own API key (takes ~2 min) for unlimited use.
          </FreeTrialFootnote>
        </FreeTrialCard>
      </FreeTrialSection>

      <WhatIsSection>
        <WhatIsCard>
          <WhatIsTitle>What is GameOrWait?</WhatIsTitle>
          <WhatIsText>
            GameOrWait is your personal game purchasing assistant. It uses AI to analyze whether a
            game is a good fit <strong>for you specifically</strong> — based on your gaming taste,
            play history, and preferences — rather than giving a generic review score.
          </WhatIsText>
          <WhatIsSteps>
            <Step>
              <StepNum>1</StepNum>
              <StepContent>
                <StepTitle>Define your taste</StepTitle>
                <StepDesc>
                  Tell GameOrWait what you like — play style, difficulty preference, dealbreakers,
                  and what matters most to you in a game (story, combat, exploration, etc.).
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
                  Enter any game and its full price. The AI searches the web for reviews, compares
                  them against your taste profile and library, and gives you a personalized
                  enjoyment prediction with a target price.
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
        <ContributeCards>
          <ContributeCard href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <ContributeIcon>
              <GitHubIcon />
            </ContributeIcon>
            <ContributeTitle>Open Source on GitHub</ContributeTitle>
            <ContributeDesc>
              GameOrWait is free and open source. Report bugs, suggest features, or contribute code
              — every bit helps make the project better.
            </ContributeDesc>
          </ContributeCard>
          <ContributeCard href={DISCUSSIONS_URL} target="_blank" rel="noopener noreferrer">
            <ContributeIcon>
              <DiscussionsIcon />
            </ContributeIcon>
            <ContributeTitle>Join the Discussion</ContributeTitle>
            <ContributeDesc>
              Share your feedback, ask questions, or suggest ideas on our GitHub Discussions page —
              we&apos;d love to hear from you.
            </ContributeDesc>
          </ContributeCard>
        </ContributeCards>
      </ContributeSection>

      <LandingFooter>
        &copy; {new Date().getFullYear()} GameOrWait. All rights reserved.
      </LandingFooter>
    </Page>
  );
}

export function LandingOrAuth() {
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  if (authMode) return <AuthPage initialMode={authMode} onBack={() => setAuthMode(null)} />;
  return <LandingPage onGetStarted={(mode) => setAuthMode(mode ?? "signup")} />;
}
