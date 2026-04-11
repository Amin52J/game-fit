"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useNavigation } from "@/app/providers/NavigationProvider";
import { Icon } from "@/shared/ui";
import { NAV_ITEMS, isNavActive } from "./Sidebar.utils";
import {
  SidebarRoot,
  LogoBlock,
  LogoIcon,
  LogoText,
  Nav,
  NavLink,
  NavIcon,
  NavLabel,
  Footer,
  FooterBtn,
  UserBlock,
  UserName,
  UserEmail,
  FooterBtnText,
  LogoutIcon,
  Backdrop,
  ModalOverlay,
  ModalCard,
  ModalTitle,
  ModalDesc,
  ModalActions,
  ModalBtn,
  MenuToggle,
  MenuBar,
} from "./Sidebar.styles";

export function Sidebar() {
  const { activePath, setIntent } = useNavigation();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastActivePath, setLastActivePath] = useState(activePath);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (activePath !== lastActivePath) {
    setLastActivePath(activePath);
    setMobileOpen(false);
  }

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen && !showLogoutModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showLogoutModal) setShowLogoutModal(false);
        else closeMobile();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, showLogoutModal, closeMobile]);

  const handleLogoutClick = () => setShowLogoutModal(true);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    closeMobile();
    signOut();
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
              $active={isNavActive(activePath, href)}
              onClick={() => {
                setIntent(href);
                closeMobile();
              }}
            >
              <NavIcon><Icon name={icon} size={18} /></NavIcon>
              <NavLabel>{label}</NavLabel>
            </NavLink>
          ))}
        </Nav>
        <Footer>
          {user && (
            <UserBlock>
              <UserName>{user.user_metadata?.full_name || user.email?.split("@")[0]}</UserName>
              <UserEmail>{user.email}</UserEmail>
            </UserBlock>
          )}
          <FooterBtn type="button" onClick={handleLogoutClick}>
            <LogoutIcon><Icon name="log-out" size={18} /></LogoutIcon>
            <FooterBtnText>Log Out</FooterBtnText>
          </FooterBtn>
        </Footer>
      </SidebarRoot>

      {showLogoutModal && (
        <ModalOverlay onClick={() => setShowLogoutModal(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Log out?</ModalTitle>
            <ModalDesc>Are you sure you want to log out of GameFit?</ModalDesc>
            <ModalActions>
              <ModalBtn type="button" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </ModalBtn>
              <ModalBtn type="button" $danger onClick={handleLogoutConfirm}>
                Log Out
              </ModalBtn>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </>
  );
}
