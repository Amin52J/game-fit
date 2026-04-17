"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { getSupabase, isTauri } from "@/shared/api/supabase";
import { trackSignup } from "@/shared/analytics";

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

const DEEP_LINK_CALLBACK = "gameorwait://auth/callback";
const OAUTH_TIMEOUT_MS = 5 * 60 * 1000;

function getOAuthRedirectUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) return `${appUrl.replace(/\/$/, "")}/oauth-complete.html`;
  return DEEP_LINK_CALLBACK;
}

async function signInWithProviderTauri(
  provider: "google" | "github" | "discord",
): Promise<string | null> {
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
            const { error: err } = await sb.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
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
  /** After first auth callback: whether we already had a session (skip spurious SIGNED_IN while logged in). */
  const authBaselineReady = useRef(false);
  const hadUserBeforeCallback = useRef(false);

  useEffect(() => {
    const sb = getSupabase();
    sb.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
      }

      const hasUser = Boolean(s?.user);

      if (event === "INITIAL_SESSION") {
        authBaselineReady.current = true;
        hadUserBeforeCallback.current = hasUser;
      } else if (!authBaselineReady.current) {
        authBaselineReady.current = true;
        hadUserBeforeCallback.current = hasUser;
      } else if (event === "SIGNED_IN" && s?.user && !hadUserBeforeCallback.current) {
        const u = s.user;
        const provider = u.app_metadata?.provider;
        void trackSignup(u, {
          auth_provider: typeof provider === "string" ? provider : "email",
        });
        hadUserBeforeCallback.current = true;
      } else {
        hadUserBeforeCallback.current = hasUser;
      }

      if (event === "SIGNED_OUT") {
        hadUserBeforeCallback.current = false;
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

  const signUp = useCallback(
    async (email: string, password: string, name?: string): Promise<string | null> => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const res = await fetch(`${supabaseUrl}/functions/v1/custom-signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${anonKey}`,
          },
          body: JSON.stringify({ email, password, name: name || email.split("@")[0] }),
        });
        const body = await res.json();
        if (!res.ok) {
          return body.error || "Signup failed. Please try again.";
        }
        return null;
      } catch {
        return "Signup failed. Please check your connection and try again.";
      }
    },
    [],
  );

  const signIn = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await getSupabase().auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }, []);

  const signInWithProvider = useCallback(
    async (provider: "google" | "github" | "discord"): Promise<string | null> => {
      if (isTauri()) {
        return signInWithProviderTauri(provider);
      }
      const { error } = await getSupabase().auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      });
      return error?.message ?? null;
    },
    [],
  );

  const signOut = useCallback(async () => {
    setRecoveryMode(false);
    await getSupabase().auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<string | null> => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const redirectTo = isTauri() ? undefined : window.location.origin;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const res = await fetch(`${supabaseUrl}/functions/v1/custom-recovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({ email, redirectTo }),
      });
      const body = await res.json();
      if (!res.ok) {
        return body.error || "Failed to send reset link. Please try again.";
      }
      return null;
    } catch {
      return "Failed to send reset link. Please check your connection and try again.";
    }
  }, []);

  const updatePassword = useCallback(async (password: string): Promise<string | null> => {
    const { error } = await getSupabase().auth.updateUser({
      password,
      data: { has_password: true },
    });
    if (!error) setRecoveryMode(false);
    return error?.message ?? null;
  }, []);

  const clearRecoveryMode = useCallback(() => setRecoveryMode(false), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        recoveryMode,
        signUp,
        signIn,
        signInWithProvider,
        signOut,
        resetPassword,
        updatePassword,
        clearRecoveryMode,
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
