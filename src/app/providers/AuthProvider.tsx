"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { getSupabase, isTauri } from "@/shared/api/supabase";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  recoveryMode: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signInWithProvider: (provider: "google" | "github" | "discord") => Promise<string | null>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
  clearRecoveryMode: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEEP_LINK_CALLBACK = "gamefit://auth/callback";
const OAUTH_TIMEOUT_MS = 5 * 60 * 1000;

function getOAuthRedirectUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) return `${appUrl.replace(/\/$/, "")}/oauth-complete.html`;
  return DEEP_LINK_CALLBACK;
}

async function signInWithProviderTauri(provider: "google" | "github" | "discord"): Promise<string | null> {
  const sb = getSupabase();

  const { data, error } = await sb.auth.signInWithOAuth({
    provider,
    options: { skipBrowserRedirect: true, redirectTo: getOAuthRedirectUrl() },
  });

  if (error) return error.message;
  if (!data.url) return "Failed to get OAuth URL";

  const { openUrl } = await import("@tauri-apps/plugin-opener");
  const { onOpenUrl } = await import("@tauri-apps/plugin-deep-link");

  return new Promise<string | null>((resolve) => {
    let settled = false;
    let unlisten: (() => void) | null = null;

    const timer = setTimeout(() => settle("Login timed out. Please try again."), OAUTH_TIMEOUT_MS);

    function settle(result: string | null) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (unlisten) unlisten();
      resolve(result);
    }

    onOpenUrl((urls) => {
      const cbUrl = urls.find((u) => u.startsWith(DEEP_LINK_CALLBACK));
      if (!cbUrl) return;

      (async () => {
        try {
          const parsed = new URL(cbUrl);
          const code = parsed.searchParams.get("code");

          if (code) {
            const { error: err } = await sb.auth.exchangeCodeForSession(code);
            settle(err?.message ?? null);
            return;
          }

          const hash = parsed.hash.substring(1);
          const hp = new URLSearchParams(hash);
          const accessToken = hp.get("access_token");
          const refreshToken = hp.get("refresh_token");

          if (accessToken && refreshToken) {
            const { error: err } = await sb.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
            settle(err?.message ?? null);
            return;
          }

          settle("No auth data received from callback");
        } catch (e) {
          settle(e instanceof Error ? e.message : "OAuth callback failed");
        }
      })();
    }).then((fn) => {
      unlisten = fn;
      if (settled) fn();
    });

    openUrl(data.url).catch(() => settle("Failed to open browser for login"));
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    const sb = getSupabase();
    sb.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = sb.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
      }
      setSession(s);
      setUser((prev) => {
        const next = s?.user ?? null;
        if (prev?.id === next?.id) return prev;
        return next;
      });
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string): Promise<string | null> => {
    const { error } = await getSupabase().auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name || email.split("@")[0], has_password: true },
        emailRedirectTo: isTauri() ? undefined : window.location.origin,
      },
    });
    return error?.message ?? null;
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await getSupabase().auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }, []);

  const signInWithProvider = useCallback(async (provider: "google" | "github" | "discord"): Promise<string | null> => {
    if (isTauri()) {
      return signInWithProviderTauri(provider);
    }
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    return error?.message ?? null;
  }, []);

  const signOut = useCallback(async () => {
    setRecoveryMode(false);
    await getSupabase().auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<string | null> => {
    const redirectTo = isTauri() ? undefined : window.location.origin;
    const { error } = await getSupabase().auth.resetPasswordForEmail(email, { redirectTo });
    return error?.message ?? null;
  }, []);

  const updatePassword = useCallback(async (password: string): Promise<string | null> => {
    const { error } = await getSupabase().auth.updateUser({ password, data: { has_password: true } });
    if (!error) setRecoveryMode(false);
    return error?.message ?? null;
  }, []);

  const clearRecoveryMode = useCallback(() => setRecoveryMode(false), []);

  return (
    <AuthContext.Provider
      value={{
        user, session, loading, recoveryMode,
        signUp, signIn, signInWithProvider, signOut,
        resetPassword, updatePassword, clearRecoveryMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
