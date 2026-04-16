import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { theme } from "@/shared/config/theme";
import { INITIAL_STATE } from "@/shared/types";
import type { AppState, AIProviderConfig, Game, SetupAnswers, AnalysisResult } from "@/shared/types";

export const mockAuthContext = {
  user: null as import("@supabase/supabase-js").User | null,
  session: null as import("@supabase/supabase-js").Session | null,
  loading: false,
  recoveryMode: false,
  signUp: vi.fn().mockResolvedValue(null),
  signIn: vi.fn().mockResolvedValue(null),
  signInWithProvider: vi.fn().mockResolvedValue(null),
  signOut: vi.fn().mockResolvedValue(undefined),
  resetPassword: vi.fn().mockResolvedValue(null),
  updatePassword: vi.fn().mockResolvedValue(null),
  clearRecoveryMode: vi.fn(),
};

export const mockAppContext = {
  state: { ...INITIAL_STATE } as AppState,
  hydrated: true,
  dispatch: vi.fn(),
  setAIProvider: vi.fn(),
  setGames: vi.fn(),
  addGame: vi.fn(),
  updateGame: vi.fn(),
  deleteGame: vi.fn(),
  setInstructions: vi.fn(),
  setSetupAnswers: vi.fn(),
  completeSetup: vi.fn(),
  addAnalysis: vi.fn(),
  updateAnalysisResponse: vi.fn(),
  deleteAnalysis: vi.fn(),
  clearHistory: vi.fn(),
  setFreeAnalysesUsed: vi.fn(),
  resetApp: vi.fn(),
};

export const mockNavigationContext = {
  activePath: "/analyze",
  setIntent: vi.fn(),
};

vi.mock("@/app/providers/AuthProvider", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => mockAuthContext,
}));

vi.mock("@/app/providers/AppProvider", () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useApp: () => mockAppContext,
}));

vi.mock("@/app/providers/NavigationProvider", () => ({
  NavigationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useNavigation: () => mockNavigationContext,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mockNavigationContext.activePath,
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

vi.mock("@/shared/api/supabase", () => ({
  getSupabase: vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({}),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      updateUser: vi.fn().mockResolvedValue({ error: null }),
    },
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
  })),
  isTauri: () => false,
}));

vi.mock("@/shared/api/db", () => ({
  loadUserState: vi.fn().mockResolvedValue(INITIAL_STATE),
  saveAIProvider: vi.fn(),
  saveAllGames: vi.fn(),
  insertGame: vi.fn(),
  updateGame: vi.fn(),
  deleteGame: vi.fn(),
  saveInstructions: vi.fn(),
  saveSetupAnswers: vi.fn(),
  saveSetupComplete: vi.fn(),
  insertAnalysis: vi.fn(),
  updateAnalysisResponse: vi.fn(),
  deleteAnalysis: vi.fn(),
  clearHistory: vi.fn(),
  resetUserData: vi.fn(),
  loadFreeAnalysesUsed: vi.fn().mockResolvedValue(0),
}));

function AllProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export function resetAllMocks() {
  vi.clearAllMocks();

  Object.assign(mockAuthContext, {
    user: null,
    session: null,
    loading: false,
    recoveryMode: false,
  });
  mockAuthContext.signUp.mockResolvedValue(null);
  mockAuthContext.signIn.mockResolvedValue(null);
  mockAuthContext.signInWithProvider.mockResolvedValue(null);
  mockAuthContext.signOut.mockResolvedValue(undefined);
  mockAuthContext.resetPassword.mockResolvedValue(null);
  mockAuthContext.updatePassword.mockResolvedValue(null);

  Object.assign(mockAppContext, {
    state: { ...INITIAL_STATE },
    hydrated: true,
  });

  mockNavigationContext.activePath = "/analyze";
}

export {
  type AppState,
  type AIProviderConfig,
  type Game,
  type SetupAnswers,
  type AnalysisResult,
  INITIAL_STATE,
};
