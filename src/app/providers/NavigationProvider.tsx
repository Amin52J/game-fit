"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";

interface NavigationContextValue {
  /** The path that should be treated as active right now. */
  activePath: string;
  /** Signal that a navigation to `path` is about to happen (instant visual switch). */
  setIntent: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setPendingPath(null);
  }

  const setIntent = useCallback((path: string) => {
    setPendingPath(path);
  }, []);

  const activePath = pendingPath ?? pathname;

  const value = useMemo(
    () => ({ activePath, setIntent }),
    [activePath, setIntent],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}
