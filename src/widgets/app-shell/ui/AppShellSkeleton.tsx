"use client";

import { Skeleton, SkeletonCircle } from "@/shared/ui";
import {
  Root,
  SidebarSkeleton,
  SidebarLogo,
  SidebarLogoText,
  SidebarNav,
  NavItemSkeleton,
  NavItemLabel,
  SidebarFooter,
  SidebarFooterDesktop,
  MobileMenuSkeleton,
  Content,
  ContentInner,
  FormBlock,
  CardBlock,
  CenteredRoot,
  PulseWrapper,
  SidebarFooterSkeleton,
} from "./AppShellSkeleton.styles";

export function AuthLoadingSkeleton() {
  return (
    <CenteredRoot>
      <PulseWrapper>
        <SkeletonCircle $width="48px" $height="48px" />
        <Skeleton $width="120px" $height="14px" />
      </PulseWrapper>
    </CenteredRoot>
  );
}

export function HydrationSkeleton() {
  return (
    <Root>
      <MobileMenuSkeleton>
        <Skeleton $width="44px" $height="44px" $radius="8px" />
      </MobileMenuSkeleton>

      <SidebarSkeleton>
        <SidebarLogo>
          <SkeletonCircle $width="32px" $height="32px" $radius="6px" />
          <SidebarLogoText>
            <Skeleton $width="90px" $height="18px" />
          </SidebarLogoText>
        </SidebarLogo>
        <SidebarNav>
          {Array.from({ length: 4 }, (_, i) => (
            <NavItemSkeleton key={i}>
              <Skeleton $width="24px" $height="24px" $radius="6px" />
              <NavItemLabel>
                <Skeleton $width={`${70 + i * 12}px`} $height="14px" />
              </NavItemLabel>
            </NavItemSkeleton>
          ))}
        </SidebarNav>
        <SidebarFooter>
          <SidebarFooterDesktop>
            <Skeleton $width="100px" $height="12px" />
            <Skeleton $width="140px" $height="11px" />
          </SidebarFooterDesktop>
          <SidebarFooterSkeleton $width="100%" $height="32px" />
        </SidebarFooter>
      </SidebarSkeleton>

      <Content>
        <ContentInner>
          <FormBlock>
            <Skeleton $width="80px" $height="12px" />
            <Skeleton $width="100%" $height="52px" $radius="14px" />
          </FormBlock>
          <FormBlock>
            <Skeleton $width="50px" $height="12px" />
            <Skeleton $width="100%" $height="42px" />
          </FormBlock>
          <Skeleton $width="100%" $height="48px" $radius="10px" />

          <CardBlock>
            <Skeleton $width="60%" $height="16px" />
            <Skeleton $width="100%" $height="12px" />
            <Skeleton $width="90%" $height="12px" />
            <Skeleton $width="75%" $height="12px" />
          </CardBlock>
        </ContentInner>
      </Content>
    </Root>
  );
}
