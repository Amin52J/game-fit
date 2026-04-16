import { createElement } from "react";

export const DOWNLOAD_URL =
  "https://github.com/Amin52J/game-fit/releases/latest";

export const GITHUB_URL = "https://github.com/Amin52J/game-fit";

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

function svgIcon(d: string, extras?: React.ReactNode) {
  return createElement(
    "svg",
    {
      width: 22,
      height: 22,
      viewBox: "0 0 24 24",
      fill: "none",
      "aria-hidden": true,
      style: { color: "#7c8aff" },
    },
    extras,
    createElement("path", {
      d,
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "none",
    })
  );
}

function GitHubIcon() {
  return createElement(
    "svg",
    {
      width: 20,
      height: 20,
      viewBox: "0 0 24 24",
      fill: "none",
      "aria-hidden": true,
    },
    createElement("path", {
      d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "none",
    })
  );
}

export { GitHubIcon };

const AnalyzeIcon = () =>
  svgIcon("M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35");

const LibraryIcon = () =>
  svgIcon(
    "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5ZM4 19.5A2.5 2.5 0 0 1 6.5 17H20"
  );

const TasteIcon = () =>
  svgIcon(
    "M12 2a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4ZM19 10v2a7 7 0 0 1-14 0v-2M12 19v3"
  );

const ProviderIcon = () =>
  svgIcon(
    "M12 2L2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5"
  );

const PrivacyIcon = () =>
  svgIcon(
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
  );

const DesktopIcon = () =>
  svgIcon(
    "M2 3h20v14H2zM8 21h8M12 17v4"
  );

const CalculatorIcon = () =>
  svgIcon(
    "M8 6h8M8 10h2M12 10h2M8 14h2M12 14h2M8 18h2M12 18h8M16 10h2M16 14h2",
    createElement("rect", {
      key: "r",
      x: 4, y: 2, width: 16, height: 20, rx: 2,
      stroke: "currentColor", strokeWidth: 2, fill: "none",
    })
  );

export const FEATURES = [
  {
    icon: AnalyzeIcon(),
    title: "AI-Powered Analysis",
    desc: "Get a detailed enjoyment prediction with confidence score, risk assessment, and price recommendation for any game.",
  },
  {
    icon: CalculatorIcon(),
    title: "Score Calculator",
    desc: "Rate games you've played using a time-based scoring system — finished games earn double credit and can reach the max score.",
  },
  {
    icon: LibraryIcon(),
    title: "Your Game Library",
    desc: "Import your library from Steam, Epic Games, CSV, JSON, or plain text. Rate your games and let the AI learn your taste.",
  },
  {
    icon: TasteIcon(),
    title: "Personalized Taste Profile",
    desc: "Answer a few preference questions and GameFit builds a custom taste profile that shapes every analysis.",
  },
  {
    icon: PrivacyIcon(),
    title: "Ready Out of the Box",
    desc: "Your first 5 analyses use our key — no setup needed. Then create your own API key for Claude, ChatGPT, or any compatible provider for unlimited use.",
  },
  {
    icon: DesktopIcon(),
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
    desc: "Choose \"Skip — use our key\" to skip the API key step, then answer taste questions and import your game library.",
  },
  {
    title: "Score your library",
    desc: "Use the built-in score calculator to rate each game based on time played and completion status.",
  },
  {
    title: "Analyze any game",
    desc: "Type a game name and get an in-depth, personalized analysis. Your first 5 analyses use our key — no setup required.",
  },
];
