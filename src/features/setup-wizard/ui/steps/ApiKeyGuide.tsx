"use client";

import React, { useState } from "react";
import type { AIProviderType } from "@/shared/types";
import {
  HelpToggle,
  HelpPanel,
  HelpStepList,
  HelpStepItem,
  HelpHeading,
  HelpRecommendNote,
} from "../SetupWizard.styles";

export function ApiKeyGuide({ provider }: { provider: AIProviderType }) {
  const [open, setOpen] = useState(false);

  if (provider === "custom") return null;

  const guides: Record<Exclude<AIProviderType, "custom">, React.ReactNode> = {
    anthropic: (
      <HelpPanel>
        <HelpHeading>How to get an Anthropic (Claude) API key</HelpHeading>
        <HelpStepList>
          <HelpStepItem>
            Go to{" "}
            <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer">
              console.anthropic.com
            </a>{" "}
            and click <strong>Sign up</strong>. You can use your Google account or email.
          </HelpStepItem>
          <HelpStepItem>
            Once logged in, click <strong>API Keys</strong> in the left sidebar (or go to{" "}
            <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">
              Settings &rarr; API Keys
            </a>
            ).
          </HelpStepItem>
          <HelpStepItem>
            Click <strong>Create Key</strong>, give it a name (e.g. &quot;GameFit&quot;), and click{" "}
            <strong>Create</strong>.
          </HelpStepItem>
          <HelpStepItem>
            Copy the key that starts with <code>sk-ant-...</code> and paste it above.{" "}
            <em>You won&apos;t be able to see it again</em>, so save it somewhere safe.
          </HelpStepItem>
          <HelpStepItem>
            You&apos;ll need to add credit to your account. Go to{" "}
            <a href="https://console.anthropic.com/settings/billing" target="_blank" rel="noreferrer">
              Settings &rarr; Billing
            </a>{" "}
            and add a payment method. $5–10 is plenty to get started.
          </HelpStepItem>
        </HelpStepList>
        <HelpRecommendNote>
          <strong>Recommended model:</strong> <code>claude-sonnet-4-6</code> — fast, smart,
          and affordable ($3/M input tokens). Use <code>claude-opus-4-6</code> for the most
          intelligent analysis ($5/M input tokens).
        </HelpRecommendNote>
      </HelpPanel>
    ),
    openai: (
      <HelpPanel>
        <HelpHeading>How to get an OpenAI API key</HelpHeading>
        <HelpStepList>
          <HelpStepItem>
            Go to{" "}
            <a href="https://platform.openai.com/signup" target="_blank" rel="noreferrer">
              platform.openai.com
            </a>{" "}
            and create an account (or sign in with Google / Microsoft / Apple).
          </HelpStepItem>
          <HelpStepItem>
            In the dashboard, click your profile icon (top-right) and select{" "}
            <strong>API Keys</strong>, or go directly to{" "}
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">
              platform.openai.com/api-keys
            </a>
            .
          </HelpStepItem>
          <HelpStepItem>
            Click <strong>Create new secret key</strong>, name it (e.g. &quot;GameFit&quot;), and
            click <strong>Create</strong>.
          </HelpStepItem>
          <HelpStepItem>
            Copy the key that starts with <code>sk-...</code> and paste it above.{" "}
            <em>This is shown only once</em>, so save it somewhere safe.
          </HelpStepItem>
          <HelpStepItem>
            You&apos;ll need to add credit. Go to{" "}
            <a
              href="https://platform.openai.com/account/billing"
              target="_blank"
              rel="noreferrer"
            >
              Billing
            </a>{" "}
            and add a payment method. $5–10 is more than enough to start.
          </HelpStepItem>
        </HelpStepList>
        <HelpRecommendNote>
          <strong>Recommended model:</strong> <code>gpt-5.4</code> — the latest and most capable
          frontier model. Use <code>gpt-5.4-mini</code> for a cheaper, faster alternative, or{" "}
          <code>gpt-5.4-nano</code> for the cheapest option.
        </HelpRecommendNote>
      </HelpPanel>
    ),
    google: (
      <HelpPanel>
        <HelpHeading>How to get a Google (Gemini) API key</HelpHeading>
        <HelpStepList>
          <HelpStepItem>
            Go to{" "}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
              aistudio.google.com/apikey
            </a>{" "}
            and sign in with your Google account.
          </HelpStepItem>
          <HelpStepItem>
            Click <strong>Create API key</strong>. You may be asked to select a Google Cloud project
            — if you don&apos;t have one, it will create one for you automatically.
          </HelpStepItem>
          <HelpStepItem>
            Copy the generated key and paste it above. It starts with <code>AIza...</code>.
          </HelpStepItem>
          <HelpStepItem>
            Google offers a generous free tier for Gemini. For higher usage, you can enable billing
            in your{" "}
            <a href="https://console.cloud.google.com/billing" target="_blank" rel="noreferrer">
              Google Cloud Console
            </a>
            .
          </HelpStepItem>
        </HelpStepList>
        <HelpRecommendNote>
          <strong>Recommended model:</strong> <code>gemini-3.1-pro</code> — the most advanced,
          great for complex analysis. Use <code>gemini-3-flash</code> for frontier-class performance
          at a fraction of the cost, or <code>gemini-2.5-flash</code> for the best budget option.
        </HelpRecommendNote>
      </HelpPanel>
    ),
  };

  return (
    <div>
      <HelpToggle type="button" onClick={() => setOpen(!open)}>
        {open ? "▾ Hide" : "▸ How do I get an API key?"} step-by-step guide
      </HelpToggle>
      {open ? guides[provider] : null}
    </div>
  );
}
