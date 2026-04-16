"use client";

import React, { useState } from "react";
import { PageWrapper } from "@/shared/ui";
import { useApp } from "@/app/providers/AppProvider";
import { generateInstructions } from "@/features/setup-wizard/lib/prompt-generator";
import { defaultSetupAnswers } from "@/features/setup-wizard/ui/SetupWizard";
import type { AIProviderConfig, AIProviderType, SetupAnswers } from "@/shared/types";
import { DEFAULT_MODELS } from "@/shared/types";
import { SettingsPageTitle, Toast } from "./SettingsPage.styles";
import { AccountSection } from "./AccountSection";
import { ProviderSection } from "./ProviderSection";
import { TasteSection } from "./TasteSection";
import { DangerSection } from "./DangerSection";

export function SettingsPage() {
  const { state, setAIProvider, setInstructions, setSetupAnswers, resetApp } = useApp();

  const [providerType, setProviderType] = useState<AIProviderType>(state.aiProvider?.type || "anthropic");
  const [apiKey, setApiKey] = useState(state.aiProvider?.apiKey || "");
  const [model, setModel] = useState(state.aiProvider?.model || "");
  const [baseUrl, setBaseUrl] = useState(state.aiProvider?.baseUrl || "");
  const [showKey, setShowKey] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [tasteAnswers, setTasteAnswers] = useState<SetupAnswers>(
    () => ({ ...defaultSetupAnswers(), ...state.setupAnswers }),
  );

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveProvider = () => {
    const config: AIProviderConfig = {
      type: providerType,
      apiKey,
      model: model || DEFAULT_MODELS[providerType]?.[0] || "",
      ...(providerType === "custom" ? { baseUrl } : {}),
    };
    setAIProvider(config);
    showToast("AI provider saved");
  };

  const saveTaste = () => {
    setSetupAnswers(tasteAnswers);
    setInstructions(generateInstructions(tasteAnswers));
    showToast("Taste preferences saved");
  };

  const handleReset = () => {
    if (confirm("This will delete ALL your data (library, settings, history). Are you sure?")) {
      resetApp();
    }
  };

  return (
    <PageWrapper>
      <SettingsPageTitle>Settings</SettingsPageTitle>
      {toast && <Toast $type={toast.type}>{toast.msg}</Toast>}

      <AccountSection onToast={showToast} />

      <ProviderSection
        providerType={providerType}
        setProviderType={setProviderType}
        apiKey={apiKey}
        setApiKey={setApiKey}
        model={model}
        setModel={setModel}
        baseUrl={baseUrl}
        setBaseUrl={setBaseUrl}
        showKey={showKey}
        setShowKey={setShowKey}
        onSave={saveProvider}
        freeAnalysesUsed={state.freeAnalysesUsed}
      />

      <TasteSection
        tasteAnswers={tasteAnswers}
        setTasteAnswers={setTasteAnswers}
        onSave={saveTaste}
      />

      <DangerSection onReset={handleReset} />
    </PageWrapper>
  );
}
