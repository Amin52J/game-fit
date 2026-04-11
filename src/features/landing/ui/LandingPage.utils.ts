import { createElement } from "react";

export const DOWNLOAD_URL =
  "https://github.com/Amin52J/game-fit/releases/latest";

export function WinIcon() {
  return createElement(
    "svg",
    {
      width: 16,
      height: 16,
      viewBox: "0 0 16 16",
      fill: "none",
      "aria-hidden": true,
    },
    createElement("path", {
      d: "M0 2.3l6.5-.9v6.3H0zm7.3-.9L16 0v7.7H7.3zM16 8.4v7.6l-8.7-1.2V8.4zM6.5 14.7L0 13.8V8.4h6.5z",
      fill: "currentColor",
    })
  );
}

export const FEATURES = [
  {
    icon: "🎮",
    title: "AI-Powered Analysis",
    desc: "Get a detailed enjoyment prediction with confidence score, risk assessment, and price recommendation for any game.",
  },
  {
    icon: "📚",
    title: "Your Game Library",
    desc: "Import your library from CSV, JSON, or plain text. Rate your games and let the AI learn your taste.",
  },
  {
    icon: "🧠",
    title: "Personalized Taste Profile",
    desc: "Answer a few preference questions and GameFit builds a custom taste profile that shapes every analysis.",
  },
  {
    icon: "🔌",
    title: "Multi-Provider Support",
    desc: "Works with Anthropic (Claude), OpenAI (ChatGPT), or any OpenAI-compatible API endpoint you configure.",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "Your API keys and data stay in your browser. Nothing is sent anywhere except the AI provider you choose.",
  },
  {
    icon: "🖥️",
    title: "Desktop & Web",
    desc: "Use it in the browser or download the native Windows app for a faster, always-ready experience.",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    title: "Create an account",
    desc: "Sign up with email, GitHub, or your Steam account in seconds.",
  },
  {
    title: "Set up your profile",
    desc: "Connect your AI provider, answer taste questions, and import your game library.",
  },
  {
    title: "Analyze any game",
    desc: "Type a game name and get an in-depth, personalized analysis of how much you'd enjoy it.",
  },
];
