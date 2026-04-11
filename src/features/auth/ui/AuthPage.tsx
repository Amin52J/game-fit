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
} from "./AuthPage.styles";

type Mode = "login" | "signup";

export function AuthPage() {
  const { signIn, signUp, signInWithProvider } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
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

  return (
    <Page>
      <Card>
        <LogoRow>
          <LogoImg src="/icon.svg" alt="" width={40} height={40} />
          <LogoText>GameFit</LogoText>
        </LogoRow>

        <TabRow>
          <TabBtn $active={mode === "login"} onClick={() => { setMode("login"); setError(null); setSuccess(null); }}>
            Log In
          </TabBtn>
          <TabBtn $active={mode === "signup"} onClick={() => { setMode("signup"); setError(null); setSuccess(null); }}>
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
              autoFocus
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
