"use client";

import { useState } from "react";
import { useNavigation } from "@/app/providers/NavigationProvider";
import {
  PageSlot,
  NotFoundRoot,
  NotFoundCode,
  NotFoundTitle,
  NotFoundDesc,
  NotFoundLink,
} from "./KeepAlivePages.styles";
import { PAGES, matchRoute } from "./KeepAlivePages.utils";

export function KeepAlivePages() {
  const { activePath } = useNavigation();
  const anyMatch = PAGES.some((p) => matchRoute(activePath, p.path));

  const [mounted, setMounted] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    const match = PAGES.find((p) => matchRoute(activePath, p.path));
    if (match) initial.add(match.path);
    return initial;
  });

  const currentMatch = PAGES.find((p) => matchRoute(activePath, p.path));
  if (currentMatch && !mounted.has(currentMatch.path)) {
    setMounted((prev) => new Set([...prev, currentMatch.path]));
  }

  return (
    <>
      {PAGES.map(({ path, Component }) => {
        const active = matchRoute(activePath, path);
        if (!mounted.has(path) && !active) return null;
        return (
          <PageSlot key={path} $visible={active}>
            <Component />
          </PageSlot>
        );
      })}
      {!anyMatch && (
        <NotFoundRoot>
          <NotFoundCode>404</NotFoundCode>
          <NotFoundTitle>Page not found</NotFoundTitle>
          <NotFoundDesc>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </NotFoundDesc>
          <NotFoundLink href="/analyze">Go to Analyze</NotFoundLink>
        </NotFoundRoot>
      )}
    </>
  );
}
