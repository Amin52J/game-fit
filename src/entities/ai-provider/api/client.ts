import type { AIProviderConfig, Game } from "@/shared/types";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export class AIClient {
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  async analyze(
    gameName: string,
    price: number,
    instructions: string,
    games: Game[],
    currencySymbol: string,
    onStream?: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<string> {
    const libraryData = this.formatLibrary(games);
    const systemPrompt = instructions;
    const userMessage = `Here is my game library:\n\n${libraryData}\n\n---\n\nAnalyze this game for me: **${gameName}** at **${currencySymbol}${price}**\n\nProvide the full analysis with Enjoyment Score, confidence, verified matches from my library, Red-Line Risk, target price, and all reasoning.`;

    if (onStream) {
      return this.streamRequest(systemPrompt, userMessage, onStream, signal);
    }
    return this.request(systemPrompt, userMessage, signal);
  }

  private formatLibrary(games: Game[]): string {
    const scored = games.filter((g) => g.score !== null);
    const lines = scored.map((g) => `${g.name}: ${g.score}/100`);
    return lines.join("\n");
  }

  private async request(system: string, user: string, signal?: AbortSignal): Promise<string> {
    switch (this.config.type) {
      case "anthropic":
        return this.anthropicRequest(system, user, signal);
      case "openai":
        return this.openaiRequest(system, user, signal);
      case "google":
        return this.googleRequest(system, user, signal);
      case "custom":
        return this.customRequest(system, user, signal);
    }
  }

  private async streamRequest(
    system: string,
    user: string,
    onStream: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<string> {
    switch (this.config.type) {
      case "anthropic":
        return this.anthropicStream(system, user, onStream, signal);
      case "openai":
        return this.openaiStream(system, user, onStream, signal);
      case "google":
        return this.googleStream(system, user, onStream, signal);
      case "custom":
        return this.customStream(system, user, onStream, signal);
    }
  }

  // --- Anthropic ---

  private buildAnthropicBody(system: string, user: string, stream = false) {
    const body: Record<string, unknown> = {
      model: this.config.model,
      system,
      messages: [{ role: "user", content: user }],
    };

    if (this.config.extendedThinking) {
      body.thinking = { type: "enabled", budget_tokens: 10000 };
      body.max_tokens = 16000;
    } else {
      body.max_tokens = 4096;
      body.temperature = 0.2;
    }

    if (stream) body.stream = true;
    return body;
  }

  private async anthropicRequest(system: string, user: string, signal?: AbortSignal): Promise<string> {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(this.buildAnthropicBody(system, user)),
      signal,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic API error (${res.status}): ${err}`);
    }
    const data = await res.json();
    const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
    return textBlock?.text || "";
  }

  private async anthropicStream(
    system: string,
    user: string,
    onStream: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<string> {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(this.buildAnthropicBody(system, user, true)),
      signal,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic API error (${res.status}): ${err}`);
    }
    return this.readAnthropicSSE(res, onStream);
  }

  private async readAnthropicSSE(
    res: Response,
    onStream: (chunk: string) => void,
  ): Promise<string> {
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let full = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6);
        if (json === "[DONE]") break;
        try {
          const evt = JSON.parse(json);
          if (evt.type === "content_block_delta" && evt.delta?.text) {
            full += evt.delta.text;
            onStream(evt.delta.text);
          }
        } catch {
          /* skip malformed */
        }
      }
    }
    return full;
  }

  // --- OpenAI ---

  private buildOpenAIBody(messages: Message[], stream = false) {
    const body: Record<string, unknown> = {
      model: this.config.model,
      messages,
      max_tokens: 4096,
      temperature: 0.2,
    };

    if (this.config.extendedThinking) {
      body.reasoning_effort = "high";
    }

    if (stream) body.stream = true;
    return body;
  }

  private async openaiRequest(system: string, user: string, signal?: AbortSignal): Promise<string> {
    const messages: Message[] = [
      { role: "system", content: system },
      { role: "user", content: user },
    ];
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(this.buildOpenAIBody(messages)),
      signal,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${err}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  private async openaiStream(
    system: string,
    user: string,
    onStream: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<string> {
    const messages: Message[] = [
      { role: "system", content: system },
      { role: "user", content: user },
    ];
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(this.buildOpenAIBody(messages, true)),
      signal,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${err}`);
    }
    return this.readOpenAISSE(res, onStream);
  }

  private async readOpenAISSE(res: Response, onStream: (chunk: string) => void): Promise<string> {
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let full = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6);
        if (json === "[DONE]") break;
        try {
          const evt = JSON.parse(json);
          const delta = evt.choices?.[0]?.delta?.content;
          if (delta) {
            full += delta;
            onStream(delta);
          }
        } catch {
          /* skip */
        }
      }
    }
    return full;
  }

  // --- Google (Gemini via OpenAI-compatible endpoint) ---

  private googleBaseUrl =
    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

  private async googleRequest(system: string, user: string, signal?: AbortSignal): Promise<string> {
    const messages: Message[] = [
      { role: "system", content: system },
      { role: "user", content: user },
    ];
    const body: Record<string, unknown> = {
      model: this.config.model,
      messages,
      max_tokens: 4096,
      temperature: 0.2,
    };
    if (this.config.extendedThinking) {
      body.reasoning_effort = "high";
    }
    const res = await fetch(this.googleBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google API error (${res.status}): ${err}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  private async googleStream(
    system: string,
    user: string,
    onStream: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<string> {
    const messages: Message[] = [
      { role: "system", content: system },
      { role: "user", content: user },
    ];
    const body: Record<string, unknown> = {
      model: this.config.model,
      messages,
      max_tokens: 4096,
      temperature: 0.2,
      stream: true,
    };
    if (this.config.extendedThinking) {
      body.reasoning_effort = "high";
    }
    const res = await fetch(this.googleBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google API error (${res.status}): ${err}`);
    }
    return this.readOpenAISSE(res, onStream);
  }

  // --- Custom ---

  private async customRequest(system: string, user: string, signal?: AbortSignal): Promise<string> {
    const url = this.config.baseUrl;
    if (!url) throw new Error("Custom provider requires a base URL");

    const messages: Message[] = [
      { role: "system", content: system },
      { role: "user", content: user },
    ];
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        max_tokens: 4096,
        temperature: 0.2,
      }),
      signal,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Custom API error (${res.status}): ${err}`);
    }
    const data = await res.json();
    return (
      data.choices?.[0]?.message?.content ||
      data.content?.[0]?.text ||
      data.response ||
      JSON.stringify(data)
    );
  }

  private async customStream(
    system: string,
    user: string,
    onStream: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<string> {
    return this.customRequest(system, user, signal);
  }
}

export async function testConnection(config: AIProviderConfig): Promise<boolean> {
  const client = new AIClient(config);
  try {
    const result = await client.analyze("Test", 0, "Reply with exactly: OK", [], "€");
    return result.length > 0;
  } catch {
    return false;
  }
}
