# GameFit — Personalized Game Analysis

AI-powered game recommendation engine that predicts how much you'll enjoy a new game based on your personal library and taste preferences.

## Features

- **Setup Wizard** — Configure your AI provider, answer taste preference questions, import your game library
- **AI Analysis** — Get detailed enjoyment predictions with confidence scores, price recommendations, and risk assessment
- **Multi-Provider** — Works with Anthropic (Claude), OpenAI (ChatGPT), or any OpenAI-compatible endpoint
- **Game Library** — Import from CSV, JSON, or plain text; edit scores inline; export data
- **Customizable Instructions** — Auto-generated from your preferences, fully editable
- **Analysis History** — Browse and review past analyses
- **Dual Platform** — Runs as a Tauri desktop app (Windows/Mac/Linux) or in the browser via Cloudflare Pages

## Quick Start

### Browser (Development)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Desktop (Tauri)

Requires [Rust](https://rustup.rs/) to be installed.

```bash
npm install
npm run tauri:dev
```

### Build

```bash
# Static web build (output in ./out)
npm run build

# Tauri desktop build
npm run tauri:build
```

## Deploy to Cloudflare Pages

```bash
npm run build
npm run cf:deploy
```

Or connect your GitHub repo to Cloudflare Pages with build command `npm run build` and output directory `out`.

## Tech Stack

- **Framework**: Next.js 16 (static export)
- **UI**: React 19, styled-components, TanStack Query
- **Desktop**: Tauri v2
- **AI**: Anthropic API, OpenAI API, custom endpoints
- **Deployment**: Cloudflare Pages

## Data Privacy

All data (API keys, game library, preferences) is stored locally in your browser's localStorage. Nothing is sent to any server except the AI provider you configure.

## License

This project is licensed under the [PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0) license. You are free to use, study, and share the software for any noncommercial purpose. Commercial use (selling, reselling, offering as a paid service) is not permitted. See [LICENSE](./LICENSE) for full terms.
