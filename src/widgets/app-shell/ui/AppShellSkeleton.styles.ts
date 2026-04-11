"use client";

import styled from "styled-components";
import { Skeleton } from "@/shared/ui";

export const Root = styled.div`
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.bg};
  background-image:
    radial-gradient(
      ellipse 120% 80% at 50% -30%,
      ${({ theme }) => theme.colors.accentGlow} 0%,
      transparent 55%
    ),
    radial-gradient(
      ellipse 90% 60% at 100% 100%,
      ${({ theme }) => theme.colors.accentMuted} 0%,
      transparent 50%
    ),
    ${({ theme }) => theme.colors.bgGradient};
`;

/* ——— Sidebar skeleton ——— */

export const SidebarSkeleton = styled.aside`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    display: flex;
    flex-direction: column;
    width: 64px;
    height: 100vh;
    height: 100dvh;
    position: sticky;
    top: 0;
    background: ${({ theme }) => theme.colors.surface};
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    flex-shrink: 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    width: 240px;
  }
`;

export const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    justify-content: flex-start;
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

export const SidebarLogoText = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    display: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    display: block;
  }
`;

export const SidebarNav = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const NavItemSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.sm};
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    justify-content: flex-start;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }
`;

export const NavItemLabel = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    display: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    display: block;
  }
`;

export const SidebarFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => theme.spacing.sm};
    align-items: center;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    padding: ${({ theme }) => theme.spacing.md};
    align-items: stretch;
  }
`;

export const SidebarFooterDesktop = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    display: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    display: flex;
  }
`;

/* ——— Mobile menu button skeleton ——— */

export const MobileMenuSkeleton = styled.div`
  display: block;
  position: fixed;
  left: ${({ theme }) => theme.spacing.md};
  top: ${({ theme }) => theme.spacing.md};
  z-index: 250;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    display: none;
  }
`;

/* ——— Content skeleton ——— */

export const Content = styled.div`
  flex: 1;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.sm};
  padding-top: calc(${({ theme }) => theme.spacing.sm} + 64px);
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const ContentInner = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

export const FormBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 0 ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: 0;
  }
`;

export const CardBlock = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: none;
  border-right: none;
  border-radius: 0;
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    border-left: 1px solid ${({ theme }) => theme.colors.border};
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.lg};
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

/* ——— Centered spinner for auth loading ——— */

export const CenteredRoot = styled(Root)`
  align-items: center;
  justify-content: center;
`;

export const PulseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const SidebarFooterSkeleton = styled(Skeleton)`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;
