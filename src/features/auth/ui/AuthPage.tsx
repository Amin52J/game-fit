"use client";
import React, { useState } from "react";
import Image from "next/image";
import styled, { keyframes } from "styled-components";
import { useAuth } from "@/app/providers/AuthProvider";
import { openSteamLoginPopup, verifySteamLogin } from "@/features/auth/lib/steam";
import { getSupabase } from "@/shared/api/supabase";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeSwitch = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  animation: ${fadeIn} 0.4s ease;
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LogoImg = styled(Image)`
  border-radius: 8px;
`;

const LogoText = styled.span`
  font-family: ${({ theme }) => theme.font.sans};
  font-weight: 700;
  font-size: 1.4rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.text} 0%, ${({ theme }) => theme.colors.textSecondary} 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const TabRow = styled.div`
  display: flex;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TabBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.font.sans};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  background: ${({ theme, $active }) => ($active ? theme.colors.accent : "transparent")};
  color: ${({ theme, $active }) => ($active ? "#fff" : theme.colors.textSecondary)};

  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.colors.accentHover : theme.colors.surfaceHover)};
  }

  &:active {
    transform: scale(0.97);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  animation: ${fadeSwitch} 200ms ease;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Input = styled.input`
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  font-family: ${({ theme }) => theme.font.sans};
  outline: none;
  transition:
    border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentMuted};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const SubmitBtn = styled.button`
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  margin-top: ${({ theme }) => theme.spacing.xs};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SocialBtn = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.8rem;
  font-weight: 500;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.surfaceHover};
    border-color: ${({ theme }) => theme.colors.borderLight};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.97);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SteamBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px;
  margin-top: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #171a21;
  color: #c7d5e0;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover:not(:disabled) {
    background: #1b2838;
    border-color: #66c0f4;
    color: #fff;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.97);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.div`
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.errorMuted};
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.82rem;
`;

const SuccessMsg = styled.div`
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.successMuted};
  color: ${({ theme }) => theme.colors.success};
  font-size: 0.82rem;
  text-align: center;
`;

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
      const { tokenHash, email: steamEmail } = await verifySteamLogin(params);
      const sb = getSupabase();
      const { error: otpError } = await sb.auth.verifyOtp({
        type: "magiclink",
        token_hash: tokenHash,
        email: steamEmail,
      });
      if (otpError) setError(otpError.message);
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
          Sign in with Steam
        </SteamBtn>
      </Card>
    </Page>
  );
}
