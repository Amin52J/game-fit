"use client";

import styled from "styled-components";
import { Skeleton } from "@/shared/ui";

export const MOBILE_MAX = "767px";
export const TABLET_MIN = "768px";
export const TABLET_MAX = "1024px";

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
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 100vh;
  height: 100dvh;
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;

  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    width: 64px;
  }

  @media (max-width: ${MOBILE_MAX}) {
    display: none;
  }
`;

export const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const SidebarLogoText = styled.div`
  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    display: none;
  }
`;

export const SidebarNav = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

export const NavItemSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};

  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

export const NavItemLabel = styled.div`
  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    display: none;
  }
`;

export const SidebarFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    padding: ${({ theme }) => theme.spacing.sm};
    align-items: center;
  }
`;

export const SidebarFooterDesktop = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;

  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    display: none;
  }
`;

/* ——— Mobile menu button skeleton ——— */

export const MobileMenuSkeleton = styled.div`
  display: none;

  @media (max-width: ${MOBILE_MAX}) {
    display: block;
    position: fixed;
    left: ${({ theme }) => theme.spacing.md};
    top: ${({ theme }) => theme.spacing.md};
    z-index: 250;
  }
`;

/* ——— Content skeleton ——— */

export const Content = styled.div`
  flex: 1;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;

  @media (max-width: ${MOBILE_MAX}) {
    padding: ${({ theme }) => theme.spacing.sm};
    padding-top: calc(${({ theme }) => theme.spacing.sm} + 64px);
  }
`;

export const ContentInner = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${MOBILE_MAX}) {
    padding: ${({ theme }) => theme.spacing.sm} 0;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const FormBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${MOBILE_MAX}) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

export const CardBlock = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${MOBILE_MAX}) {
    border-radius: 0;
    border-left: none;
    border-right: none;
    padding: ${({ theme }) => theme.spacing.sm};
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
