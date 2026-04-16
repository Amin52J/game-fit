"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { openSteamLoginPopup, verifySteamLogin } from "@/features/auth/lib/steam";
import { getSupabase } from "@/shared/api/supabase";
import {
  Page,
  Card,
  LogoRow,
  LogoImg,
  LogoText,
  TabRow,
  TabBtn,
  Form,
  Label,
  InputWrap,
  Input,
  SubmitBtn,
  Divider,
  SocialRow,
  SocialBtn,
  SteamBtn,
  ErrorMsg,
  SuccessMsg,
  ForgotLink,
  BackBtn,
} from "./AuthPage.styles";

type Mode = "login" | "signup" | "forgot" | "recovery";

interface AuthPageProps {
  initialMode?: Mode;
  onBack?: () => void;
}

export function AuthPage({ initialMode = "login", onBack }: AuthPageProps) {
  const { signIn, signUp, signInWithProvider, resetPassword, updatePassword, recoveryMode, clearRecoveryMode } = useAuth();
  const [mode, setMode] = useState<Mode>(recoveryMode ? "recovery" : initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setBusy(true);

    if (mode === "signup") {
      const err = await signUp(email, password, name);
      if (err) {
        setError(err);
      } else {
        setSuccess("Check your email for a confirmation link.");
      }
    } else if (mode === "forgot") {
      if (!email) {
        setError("Please enter your email address.");
        setBusy(false);
        return;
      }
      const err = await resetPassword(email);
      if (err) {
        setError(err);
      } else {
        setSuccess("Check your email for a password reset link.");
      }
    } else if (mode === "recovery") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setBusy(false);
        return;
      }
      const err = await updatePassword(password);
      if (err) {
        setError(err);
      } else {
        setSuccess("Password updated successfully!");
        clearRecoveryMode();
      }
    } else {
      const err = await signIn(email, password);
      if (err) setError(err);
    }

    setBusy(false);
  };

  const handleSocial = async (provider: "google" | "github" | "discord") => {
    setError(null);
    setBusy(true);
    const err = await signInWithProvider(provider);
    if (err) setError(err);
    setBusy(false);
  };

  const handleSteamLogin = async () => {
    setError(null);
    setBusy(true);
    try {
      const params = await openSteamLoginPopup();
      const { tokenHash, steamId, isNew } = await verifySteamLogin(params);
      const sb = getSupabase();
      const { error: otpError } = await sb.auth.verifyOtp({
        type: "magiclink",
        token_hash: tokenHash,
      });
      if (otpError) {
        setError(otpError.message);
      } else if (steamId) {
        sessionStorage.setItem("gamefit_steam_id", steamId);
        if (isNew) sessionStorage.setItem("gamefit_steam_is_new", "1");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Steam login failed");
    }
    setBusy(false);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setSuccess(null);
  };

  if (mode === "recovery") {
    return (
      <Page>
        <Card>
          <LogoRow>
            <LogoImg src="/icon.svg" alt="" width={40} height={40} />
            <LogoText>GameFit</LogoText>
          </LogoRow>

          {error && <ErrorMsg>{error}</ErrorMsg>}
          {success && <SuccessMsg>{success}</SuccessMsg>}

          <Form onSubmit={handleSubmit}>
            <InputWrap>
              <Label htmlFor="auth-new-password">New Password</Label>
              <Input
                id="auth-new-password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                autoFocus
              />
            </InputWrap>
            <SubmitBtn type="submit" disabled={busy}>
              {busy ? "Please wait..." : "Set New Password"}
            </SubmitBtn>
          </Form>
        </Card>
      </Page>
    );
  }

  if (mode === "forgot") {
    return (
      <Page>
        <Card>
          <BackBtn type="button" onClick={() => switchMode("login")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Log In
          </BackBtn>

          <LogoRow>
            <LogoImg src="/icon.svg" alt="" width={40} height={40} />
            <LogoText>GameFit</LogoText>
          </LogoRow>

          {error && <ErrorMsg>{error}</ErrorMsg>}
          {success && <SuccessMsg>{success}</SuccessMsg>}

          <Form onSubmit={handleSubmit}>
            <InputWrap>
              <Label htmlFor="auth-reset-email">Email</Label>
              <Input
                id="auth-reset-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </InputWrap>
            <SubmitBtn type="submit" disabled={busy}>
              {busy ? "Please wait..." : "Send Reset Link"}
            </SubmitBtn>
          </Form>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <Card>
        {onBack && (
          <BackBtn type="button" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </BackBtn>
        )}

        <LogoRow>
          <LogoImg src="/icon.svg" alt="" width={40} height={40} />
          <LogoText>GameFit</LogoText>
        </LogoRow>

        <TabRow>
          <TabBtn $active={mode === "login"} onClick={() => switchMode("login")}>
            Log In
          </TabBtn>
          <TabBtn $active={mode === "signup"} onClick={() => switchMode("signup")}>
            Sign Up
          </TabBtn>
        </TabRow>

        {error && <ErrorMsg>{error}</ErrorMsg>}
        {success && <SuccessMsg>{success}</SuccessMsg>}

        <Form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <InputWrap>
              <Label htmlFor="auth-name">Name</Label>
              <Input
                id="auth-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                autoFocus
              />
            </InputWrap>
          )}
          <InputWrap>
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus={mode === "login"}
            />
          </InputWrap>
          <InputWrap>
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              placeholder={mode === "signup" ? "Min 6 characters" : "Your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </InputWrap>
          {mode === "login" && (
            <ForgotLink type="button" onClick={() => switchMode("forgot")}>
              Forgot password?
            </ForgotLink>
          )}
          <SubmitBtn type="submit" disabled={busy}>
            {busy ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
          </SubmitBtn>
        </Form>

        <Divider>or continue with</Divider>

        <SocialRow>
          <SocialBtn type="button" onClick={() => handleSocial("github")} disabled={busy}>
            <img src="/github-logo.svg" alt="" width="18" height="18" />
            GitHub
          </SocialBtn>
        </SocialRow>

        <SteamBtn type="button" onClick={handleSteamLogin} disabled={busy}>
          <img src="/steam-logo.svg" alt="" width="18" height="18" />
          Steam
        </SteamBtn>
      </Card>
    </Page>
  );
}
