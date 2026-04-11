"use client";

import { useState } from "react";
import Image from "next/image";
import styled, { keyframes } from "styled-components";
import { AuthPage } from "@/features/auth";

const DOWNLOAD_URL =
  "https://github.com/Amin52J/game-fit/releases/latest";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  overflow-x: hidden;
`;

/* ── Nav ── */

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(8, 8, 14, 0.7);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 640px) {
    padding: 12px 20px;
  }
`;

const LogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoImg = styled(Image)`
  border-radius: 8px;
`;

const LogoText = styled.span`
  font-weight: 700;
  font-size: 1.2rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.text} 0%,
    ${({ theme }) => theme.colors.textSecondary} 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const NavActions = styled.div`
  display: flex;
  gap: 12px;
`;

const NavBtn = styled.button<{ $primary?: boolean }>`
  padding: 8px 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ $primary, theme }) =>
      $primary ? "transparent" : theme.colors.border};
  background: ${({ $primary, theme }) =>
    $primary ? theme.colors.accent : "transparent"};
  color: ${({ $primary, theme }) =>
    $primary ? "#fff" : theme.colors.textSecondary};
  font-size: 0.85rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ $primary, theme }) =>
      $primary ? theme.colors.accentHover : theme.colors.surfaceHover};
    border-color: ${({ $primary, theme }) =>
      $primary ? "transparent" : theme.colors.borderLight};
  }

  &:active {
    transform: scale(0.97);
  }
`;

/* ── Hero ── */

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 160px 24px 80px;
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeUp} 0.6s ease;
`;

const HeroBadge = styled.span`
  display: inline-block;
  padding: 6px 16px;
  border-radius: 100px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.accentMuted};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 24px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 800;
  line-height: 1.15;
  margin: 0 0 20px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.text} 0%,
    ${({ theme }) => theme.colors.accent} 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const HeroSub = styled.p`
  font-size: clamp(1rem, 2vw, 1.15rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0 0 36px;
  max-width: 580px;
`;

const HeroCTA = styled.button`
  padding: 14px 36px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  box-shadow: 0 0 24px ${({ theme }) => theme.colors.accentMuted};

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 32px ${({ theme }) => theme.colors.accentGlow};
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const DownloadBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  text-decoration: none;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    border-color: ${({ theme }) => theme.colors.borderLight};
    color: ${({ theme }) => theme.colors.text};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const WinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M0 2.3l6.5-.9v6.3H0zm7.3-.9L16 0v7.7H7.3zM16 8.4v7.6l-8.7-1.2V8.4zM6.5 14.7L0 13.8V8.4h6.5z"
      fill="currentColor"
    />
  </svg>
);

/* ── Features ── */

const Features = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 100px;
  animation: ${fadeUp} 0.6s ease 0.15s both;
`;

const FeatureCard = styled.div`
  padding: 28px 24px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  transition: all ${({ theme }) => theme.transition.normal};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderLight};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`;

const FeatureIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.accentMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 1.25rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 8px;
`;

const FeatureDesc = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

/* ── How it Works ── */

const Section = styled.section`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px 100px;
  text-align: center;
  animation: ${fadeUp} 0.6s ease 0.3s both;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  font-weight: 800;
  margin: 0 0 48px;
`;

const Steps = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
  text-align: left;
`;

const Step = styled.li`
  display: flex;
  gap: 20px;
  align-items: flex-start;
`;

const StepNum = styled.span`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentMuted};
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepContent = styled.div``;

const StepTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 4px;
`;

const StepDesc = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

/* ── Footer ── */

const Footer = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 32px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
`;

/* ── Component ── */

const FEATURES = [
  {
    icon: "🎮",
    title: "AI-Powered Analysis",
    desc: "Get a detailed enjoyment prediction with confidence score, risk assessment, and price recommendation for any game.",
  },
  {
    icon: "📚",
    title: "Your Game Library",
    desc: "Import your library from CSV, JSON, or plain text. Rate your games and let the AI learn your taste.",
  },
  {
    icon: "🧠",
    title: "Personalized Taste Profile",
    desc: "Answer a few preference questions and GameFit builds a custom taste profile that shapes every analysis.",
  },
  {
    icon: "🔌",
    title: "Multi-Provider Support",
    desc: "Works with Anthropic (Claude), OpenAI (ChatGPT), or any OpenAI-compatible API endpoint you configure.",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "Your API keys and data stay in your browser. Nothing is sent anywhere except the AI provider you choose.",
  },
  {
    icon: "🖥️",
    title: "Desktop & Web",
    desc: "Use it in the browser or download the native Windows app for a faster, always-ready experience.",
  },
];

const STEPS = [
  {
    title: "Create an account",
    desc: "Sign up with email, GitHub, or your Steam account in seconds.",
  },
  {
    title: "Set up your profile",
    desc: "Connect your AI provider, answer taste questions, and import your game library.",
  },
  {
    title: "Analyze any game",
    desc: "Type a game name and get an in-depth, personalized analysis of how much you'd enjoy it.",
  },
];

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
          {STEPS.map((s, i) => (
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

      <Footer>&copy; {new Date().getFullYear()} GameFit. All rights reserved.</Footer>
    </Page>
  );
}

export function LandingOrAuth() {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) return <AuthPage />;
  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
}
