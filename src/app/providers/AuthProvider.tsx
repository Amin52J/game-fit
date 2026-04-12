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

async function signInWithProviderTauri(provider: "google" | "github" | "discord"): Promise<string | null> {
  const sb = getSupabase();
  const redirectTo = `${window.location.origin}/auth-callback.html`;

  const { data, error } = await sb.auth.signInWithOAuth({
    provider,
    options: { skipBrowserRedirect: true, redirectTo },
  });

  if (error) return error.message;
  if (!data.url) return "Failed to get OAuth URL";

  const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");
  const { listen } = await import("@tauri-apps/api/event");

  return new Promise<string | null>((resolve) => {
    let settled = false;
    let unlistenFn: (() => void) | null = null;

    const cleanup = () => {
      if (unlistenFn) unlistenFn();
    };

    const settle = (result: string | null) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    listen<{ access_token?: string; refresh_token?: string; code?: string }>(
      "oauth-callback",
      async (event) => {
        try {
          const { access_token, refresh_token, code } = event.payload;
          if (access_token && refresh_token) {
            const { error: sessErr } = await sb.auth.setSession({ access_token, refresh_token });
            settle(sessErr?.message ?? null);
          } else if (code) {
            const { error: exchErr } = await sb.auth.exchangeCodeForSession(code);
            settle(exchErr?.message ?? null);
          } else {
            settle("No auth data received from callback");
          }
        } catch (e) {
          settle(e instanceof Error ? e.message : "OAuth callback failed");
        }
        try {
          const win = await WebviewWindow.getByLabel("oauth");
          if (win) await win.close();
        } catch {}
      },
    ).then((fn) => {
      unlistenFn = fn;
      if (settled) fn();
    });

    const authWin = new WebviewWindow("oauth", {
      url: data.url,
      title: `Sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
      width: 800,
      height: 700,
      center: true,
    });

    authWin.once("tauri://error", () => {
      settle("Failed to open login window");
    });

    authWin.once("tauri://destroyed", () => {
      setTimeout(() => settle("Login window was closed"), 300);
    });
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
        data: { full_name: name || email.split("@")[0] },
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
    const { error } = await getSupabase().auth.updateUser({ password });
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
