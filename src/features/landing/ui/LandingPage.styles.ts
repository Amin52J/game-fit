import styled, { keyframes } from "styled-components";
import Image from "next/image";

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  overflow-x: hidden;
`;

export const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(8, 8, 14, 0.7);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => theme.spacing.md} 40px;
  }
`;

export const LogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LogoImg = styled(Image)`
  border-radius: ${({ theme }) => theme.radius.sm};
`;

export const LogoText = styled.span`
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

export const NavActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    gap: 12px;
  }
`;

export const NavBtn = styled.button<{ $primary?: boolean; $hideOnMobile?: boolean }>`
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ $primary, theme }) => ($primary ? "transparent" : theme.colors.border)};
  background: ${({ $primary, theme }) => ($primary ? theme.colors.accent : "transparent")};
  color: ${({ $primary, theme }) => ($primary ? theme.colors.text : theme.colors.textSecondary)};
  font-size: 0.8rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  white-space: nowrap;

  ${({ $hideOnMobile }) =>
    $hideOnMobile &&
    `
    @media (max-width: 767px) {
      display: none;
    }
  `}

  &:hover {
    background: ${({ $primary, theme }) =>
      $primary ? theme.colors.accentHover : theme.colors.surfaceHover};
    border-color: ${({ $primary, theme }) => ($primary ? "transparent" : theme.colors.borderLight)};
  }

  &:active {
    transform: scale(0.97);
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => theme.spacing.sm} 20px;
    font-size: 0.85rem;
  }
`;

export const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 120px ${({ theme }) => theme.spacing.md} 60px;
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeUp} 0.6s ease;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: 140px ${({ theme }) => theme.spacing.lg} 80px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    padding-top: 160px;
  }
`;

export const HeroBadge = styled.span`
  display: inline-block;
  padding: 6px ${({ theme }) => theme.spacing.md};
  border-radius: 100px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.accentMuted};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const HeroTitle = styled.h1`
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

export const HeroSub = styled.p`
  font-size: clamp(1rem, 2vw, 1.15rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0 0 36px;
  max-width: 580px;
`;

export const HeroCTA = styled.button`
  width: 100%;
  padding: 14px 36px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.text};
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

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    width: auto;
  }
`;

export const HeroActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    flex-direction: row;
    width: auto;
  }
`;

export const DownloadBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
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
  width: 100%;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    border-color: ${({ theme }) => theme.colors.borderLight};
    color: ${({ theme }) => theme.colors.text};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    width: auto;
    justify-content: flex-start;
  }
`;

/* Demo video */

export const VideoSection = styled.section`
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 0 60px;
  animation: ${fadeUp} 0.6s ease 0.06s both;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.lg} 80px;
  }
`;

export const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #111120;
  aspect-ratio: 4 / 3;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    border-radius: ${({ theme }) => theme.radius.lg};
    border: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const VideoNativePlayer = styled.video<{ $visible?: boolean }>`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  background: #111120;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

export const VideoPlayOverlay = styled.div<{ $ended?: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background: #111120;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition.fast};

  &:hover > div:last-child {
    transform: scale(1.1);
  }
`;

export const VideoOverlayBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const VideoBrandName = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    font-size: 2rem;
  }
`;

export const VideoPlayButton = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 32px ${({ theme }) => theme.colors.accentGlow};
  transition: transform ${({ theme }) => theme.transition.fast};

  &::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 12px 0 12px 20px;
    border-color: transparent transparent transparent ${({ theme }) => theme.colors.text};
    margin-left: 3px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    width: 80px;
    height: 80px;

    &::after {
      border-width: 14px 0 14px 24px;
      margin-left: 4px;
    }
  }
`;

/* Starter analyses callout */

export const FreeTrialSection = styled.section`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md} 60px;
  animation: ${fadeUp} 0.6s ease 0.08s both;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.lg} 80px;
  }
`;

export const FreeTrialCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.surface};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at 50% 0%,
      ${({ theme }) => theme.colors.accentMuted} 0%,
      transparent 70%
    );
    pointer-events: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: 40px ${({ theme }) => theme.spacing.xxl};
  }
`;

export const FreeTrialBadge = styled.span`
  position: relative;
  display: inline-block;
  padding: 5px ${({ theme }) => theme.spacing.md};
  border-radius: 100px;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentMuted};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const FreeTrialTitle = styled.h2`
  position: relative;
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  font-weight: 800;
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
`;

export const FreeTrialDesc = styled.p`
  position: relative;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  max-width: 520px;
`;

export const FreeTrialHighlights = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 340px;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    flex-direction: row;
    max-width: 100%;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

export const FreeTrialHighlight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const FreeTrialHighlightIcon = styled.span`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.successMuted};
  color: ${({ theme }) => theme.colors.success};
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FreeTrialCTA = styled.button`
  position: relative;
  padding: 14px 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.text};
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

export const FreeTrialFootnote = styled.p`
  position: relative;
  margin: ${({ theme }) => theme.spacing.md} 0 0;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;

export const WhatIsSection = styled.section`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md} 60px;
  animation: ${fadeUp} 0.6s ease 0.1s both;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.lg} 80px;
  }
`;

export const WhatIsCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  text-align: left;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const WhatIsTitle = styled.h2`
  font-size: clamp(1.3rem, 3vw, 1.6rem);
  font-weight: 800;
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

export const WhatIsText = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0 0 ${({ theme }) => theme.spacing.lg};

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }
`;

export const WhatIsSteps = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const WhatIsTip = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.successMuted};
  border: 1px solid ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.success};
  font-size: 0.8125rem;
  line-height: 1.6;

  strong {
    font-weight: 700;
  }
`;

export const Features = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 960px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md} 60px;
  animation: ${fadeUp} 0.6s ease 0.15s both;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    gap: ${({ theme }) => theme.spacing.lg};
    padding: 0 ${({ theme }) => theme.spacing.lg} 80px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    padding-bottom: 100px;
  }
`;

export const FeatureCard = styled.div`
  padding: 28px ${({ theme }) => theme.spacing.lg};
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

export const FeatureIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.accentMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 1.25rem;
`;

export const FeatureTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
`;

export const FeatureDesc = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

export const Section = styled.section`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md} 60px;
  text-align: center;
  animation: ${fadeUp} 0.6s ease 0.3s both;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.lg} 100px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  font-weight: 800;
  margin: 0 0 ${({ theme }) => theme.spacing.xxl};
`;

export const Steps = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  text-align: left;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

export const Step = styled.li`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    gap: 20px;
  }
`;

export const StepNum = styled.span`
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

export const StepContent = styled.div``;

export const StepTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
`;

export const StepDesc = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

export const ContributeSection = styled.section`
  max-width: 640px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md} 60px;
  text-align: center;
  animation: ${fadeUp} 0.6s ease 0.45s both;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.lg} 80px;
  }
`;

export const ContributeCard = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transition.normal};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderLight};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`;

export const ContributeIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.accent};
`;

export const ContributeTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const ContributeDesc = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
  max-width: 420px;
`;

export const LandingFooter = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
`;
