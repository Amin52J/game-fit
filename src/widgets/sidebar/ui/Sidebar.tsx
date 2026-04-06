"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useApp } from "@/app/providers/AppProvider";
import { Icon } from "@/shared/ui";
import type { IconName } from "@/shared/ui";

const MOBILE_MAX = "767px";

const NAV_ITEMS: readonly { href: string; label: string; icon: IconName }[] = [
  { href: "/analyze", label: "Analyze", icon: "search" },
  { href: "/library", label: "Library", icon: "library" },
  { href: "/history", label: "History", icon: "history" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

function isNavActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
}

const SidebarRoot = styled.aside<{ $open: boolean }>`
  display: flex;
  flex-direction: column;
  width: 240px;
  min-height: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
  z-index: 200;
  transition: transform ${({ theme }) => theme.transition.normal};

  @media (max-width: ${MOBILE_MAX}) {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    min-height: 100vh;
    box-shadow: ${({ theme }) => theme.shadow.lg};
    transform: translateX(${({ $open }) => ($open ? "0" : "-100%")});
  }
`;

const LogoBlock = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const LogoIcon = styled(Image)`
  border-radius: 6px;
  filter: drop-shadow(0 0 8px ${({ theme }) => theme.colors.accentGlow});
`;

const LogoText = styled.span`
  font-family: ${({ theme }) => theme.font.sans};
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: -0.02em;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.text} 0%,
    ${({ theme }) => theme.colors.textSecondary} 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Nav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
`;

const navLinkActive = css`
  color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentMuted};
  border-left-color: ${({ theme }) => theme.colors.accent};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.accentGlow};
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border-left: 3px solid transparent;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.9375rem;
  font-weight: 500;
  transition:
    color ${({ theme }) => theme.transition.fast},
    background ${({ theme }) => theme.transition.fast},
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  ${({ $active }) => $active && navLinkActive}
`;

const NavIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
`;

const Footer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;
`;

const ResetButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  text-align: left;
  transition:
    color ${({ theme }) => theme.transition.fast},
    background ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const Backdrop = styled.div<{ $visible: boolean }>`
  display: none;

  @media (max-width: ${MOBILE_MAX}) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    z-index: 150;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
    transition: opacity ${({ theme }) => theme.transition.normal};
    backdrop-filter: blur(2px);
  }
`;

const MenuToggle = styled.button`
  display: none;

  @media (max-width: ${MOBILE_MAX}) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: ${({ theme }) => theme.spacing.md};
    top: ${({ theme }) => theme.spacing.md};
    z-index: 250;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.surfaceElevated};
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    box-shadow: ${({ theme }) => theme.shadow.md};
    transition:
      background ${({ theme }) => theme.transition.fast},
      border-color ${({ theme }) => theme.transition.fast};

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceHover};
      border-color: ${({ theme }) => theme.colors.borderLight};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.accent};
      outline-offset: 2px;
    }
  }
`;

const MenuBar = styled.span`
  display: block;
  width: 18px;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    width: 18px;
    height: 2px;
    background: currentColor;
    border-radius: 1px;
  }

  &::before {
    top: -6px;
  }

  &::after {
    top: 6px;
  }
`;

export function Sidebar() {
  const pathname = usePathname();
  const { resetApp } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobile]);

  const handleReset = () => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Reset GameFit? This clears your library, history, and setup.")
    ) {
      resetApp();
      closeMobile();
    }
  };

  return (
    <>
      <MenuToggle
        type="button"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((o) => !o)}
      >
        <MenuBar aria-hidden />
      </MenuToggle>
      <Backdrop $visible={mobileOpen} aria-hidden onClick={closeMobile} />
      <SidebarRoot $open={mobileOpen} aria-label="Main navigation">
        <LogoBlock href="/analyze" onClick={closeMobile}>
          <LogoIcon src="/icon.svg" alt="" width={32} height={32} aria-hidden />
          <LogoText>GameFit</LogoText>
        </LogoBlock>
        <Nav>
          {NAV_ITEMS.map(({ href, label, icon }) => (
            <NavLink
              key={href}
              href={href}
              $active={isNavActive(pathname, href)}
              onClick={closeMobile}
            >
              <NavIcon><Icon name={icon} size={18} /></NavIcon>
              {label}
            </NavLink>
          ))}
        </Nav>
        <Footer>
          <ResetButton type="button" onClick={handleReset}>
            Reset App
          </ResetButton>
        </Footer>
      </SidebarRoot>
    </>
  );
}
