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
  padding: ${({ theme }) => theme.spacing.md} 40px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(8, 8, 14, 0.7);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 640px) {
    padding: 12px 20px;
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
  gap: 12px;

  @media (max-width: 767px) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const NavBtn = styled.button<{ $primary?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ $primary, theme }) =>
      $primary ? "transparent" : theme.colors.border};
  background: ${({ $primary, theme }) =>
    $primary ? theme.colors.accent : "transparent"};
  color: ${({ $primary, theme }) =>
    $primary ? theme.colors.text : theme.colors.textSecondary};
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

  @media (max-width: 767px) {
    padding: 6px 14px;
    font-size: 0.8rem;
  }
`;

export const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 160px ${({ theme }) => theme.spacing.lg} 80px;
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeUp} 0.6s ease;

  @media (max-width: 1024px) {
    padding-top: 140px;
  }

  @media (max-width: 767px) {
    padding: 120px ${({ theme }) => theme.spacing.md} 60px;
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

  @media (max-width: 767px) {
    width: 100%;
  }
`;

export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 767px) {
    flex-direction: column;
    width: 100%;
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

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    border-color: ${({ theme }) => theme.colors.borderLight};
    color: ${({ theme }) => theme.colors.text};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  @media (max-width: 767px) {
    width: 100%;
    justify-content: center;
  }
`;

export const Features = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 960px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg} 100px;
  animation: ${fadeUp} 0.6s ease 0.15s both;

  @media (max-width: 1024px) {
    padding-bottom: 80px;
  }

  @media (max-width: 767px) {
    gap: ${({ theme }) => theme.spacing.md};
    padding: 0 ${({ theme }) => theme.spacing.md} 60px;
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
  padding: 0 ${({ theme }) => theme.spacing.lg} 100px;
  text-align: center;
  animation: ${fadeUp} 0.6s ease 0.3s both;

  @media (max-width: 767px) {
    padding: 0 ${({ theme }) => theme.spacing.md} 60px;
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
  gap: ${({ theme }) => theme.spacing.xl};
  text-align: left;

  @media (max-width: 767px) {
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

export const Step = styled.li`
  display: flex;
  gap: 20px;
  align-items: flex-start;

  @media (max-width: 767px) {
    gap: ${({ theme }) => theme.spacing.md};
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

export const LandingFooter = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
`;
