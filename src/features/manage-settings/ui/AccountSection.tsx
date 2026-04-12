"use client";

import React, { useState } from "react";
import { Button, Input, SectionCard, SectionTitle, SectionDesc } from "@/shared/ui";
import { useAuth } from "@/app/providers/AuthProvider";
import { FormRow, FormGroup, MarginedButtonRow } from "./SettingsPage.styles";

export function AccountSection({ onToast }: { onToast: (msg: string, type: "success" | "error") => void }) {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { updatePassword } = useAuth();

  const hasPasswordProvider = user?.app_metadata?.providers?.includes("email") ?? false;
  if (!hasPasswordProvider) return null;

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      onToast("Password must be at least 6 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      onToast("Passwords do not match", "error");
      return;
    }

    setBusy(true);
    const err = await updatePassword(newPassword);
    setBusy(false);

    if (err) {
      onToast(err, "error");
    } else {
      setNewPassword("");
      setConfirmPassword("");
      onToast("Password updated successfully", "success");
    }
  };

  return (
    <SectionCard>
      <SectionTitle>Account</SectionTitle>
      <SectionDesc>Change your password. You must be signed in with email to use this.</SectionDesc>

      <FormRow>
        <FormGroup>
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 6 characters"
            autoComplete="new-password"
          />
        </FormGroup>
        <FormGroup>
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            autoComplete="new-password"
          />
        </FormGroup>
      </FormRow>

      <MarginedButtonRow>
        <Button variant="primary" onClick={handleChangePassword} disabled={busy || !newPassword || !confirmPassword}>
          {busy ? "Updating…" : "Change Password"}
        </Button>
      </MarginedButtonRow>
    </SectionCard>
  );
}
