import styled, { css } from "styled-components";
import Link from "next/link";
import Image from "next/image";

const MOBILE_MAX = "767px";
const TABLET_MIN = "768px";
const TABLET_MAX = "1024px";

export const SidebarRoot = styled.aside<{ $open: boolean }>`
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
  z-index: 200;
  transition: transform ${({ theme }) => theme.transition.normal};

  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    width: 64px;
  }

  @media (max-width: ${MOBILE_MAX}) {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    height: 100vh;
    height: 100dvh;
    box-shadow: ${({ theme }) => theme.shadow.lg};
    transform: translateX(${({ $open }) => ($open ? "0" : "-100%")});
  }
`;

export const LogoBlock = styled(Link)`
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

  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: ${MOBILE_MAX}) {
    padding-left: 72px;
  }
`;

export const LogoIcon = styled(Image)`
  border-radius: ${({ theme }) => theme.radius.sm};
  filter: drop-shadow(0 0 8px ${({ theme }) => theme.colors.accentGlow});
`;

export const LogoText = styled.span`
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

  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    display: none;
  }
`;

export const Nav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;

  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const navLinkActive = css`
  color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentMuted};
  border-left-color: ${({ theme }) => theme.colors.accent};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.accentGlow};
`;

export const NavLink = styled(Link)<{ $active: boolean }>`
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
    box-shadow ${({ theme }) => theme.transition.fast},
    transform ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceHover};
    transform: translateX(2px);
  }

  &:active {
    transform: translateX(2px) scale(0.98);
  }

  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.sm};
  }

  ${({ $active }) => $active && navLinkActive}
`;

export const NavIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
`;

export const NavLabel = styled.span`
  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    display: none;
  }
`;

export const Footer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;

  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

export const FooterBtn = styled.button`
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
    background ${({ theme }) => theme.transition.fast},
    transform ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

export const UserBlock = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  overflow: hidden;

  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    display: none;
  }
`;

export const UserName = styled.div`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
`;

export const UserEmail = styled.div`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FooterBtnText = styled.span`
  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    display: none;
  }
`;

export const LogoutIcon = styled.span`
  display: none;

  @media (min-width: ${TABLET_MIN}) and (max-width: ${TABLET_MAX}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Backdrop = styled.div<{ $visible: boolean }>`
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

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 400;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  backdrop-filter: blur(2px);
`;

export const ModalCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.sans};
`;

export const ModalDesc = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  font-family: ${({ theme }) => theme.font.sans};
`;

export const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;

export const ModalBtn = styled.button<{ $danger?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transition.fast},
    border-color ${({ theme }) => theme.transition.fast};

  ${({ theme, $danger }) =>
    $danger
      ? css`
          background: ${theme.colors.error};
          color: ${theme.colors.text};
          border: 1px solid ${theme.colors.error};
          &:hover {
            opacity: 0.85;
          }
        `
      : css`
          background: ${theme.colors.surface};
          color: ${theme.colors.text};
          border: 1px solid ${theme.colors.border};
          &:hover {
            background: ${theme.colors.surfaceHover};
            border-color: ${theme.colors.borderLight};
          }
        `}
`;

export const MenuToggle = styled.button`
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

export const MenuBar = styled.span`
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
