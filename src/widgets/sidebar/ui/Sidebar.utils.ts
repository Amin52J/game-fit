import type { IconName } from "@/shared/ui";

export const NAV_ITEMS: readonly { href: string; label: string; icon: IconName }[] = [
  { href: "/analyze", label: "Analyze", icon: "search" },
  { href: "/library", label: "Library", icon: "library" },
  { href: "/score", label: "Score", icon: "calculator" },
  { href: "/history", label: "History", icon: "history" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export function isNavActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === "/analyze" && pathname === "/") return true;
  return pathname.startsWith(`${href}/`);
}
