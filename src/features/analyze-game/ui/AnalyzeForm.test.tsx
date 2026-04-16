import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, resetAllMocks, mockAppContext } from "@/__tests__/test-utils";
import { AnalyzeForm } from "./AnalyzeForm";

beforeEach(() => {
  resetAllMocks();
  mockAppContext.state = {
    ...mockAppContext.state,
    isSetupComplete: true,
    aiProvider: { type: "anthropic", apiKey: "sk-test", model: "claude-sonnet-4-6" },
    setupAnswers: {
      playStyle: "singleplayer",
      storyImportance: 3,
      gameplayImportance: 3,
      explorationImportance: 3,
      combatImportance: 3,
      puzzleImportance: 3,
      strategyImportance: 3,
      dealbreakers: [],
      customDealbreakers: [],
      voiceActingPreference: "preferred",
      difficultyPreference: "moderate",
      idealLength: "medium",
      currency: "EUR",
      region: "Germany",
      additionalNotes: "",
    },
  };
});

describe("AnalyzeForm", () => {
  it("renders game name and price fields", () => {
    renderWithProviders(<AnalyzeForm onSubmit={vi.fn()} isLoading={false} />);
    expect(screen.getByLabelText("Game name")).toBeInTheDocument();
    expect(screen.getByLabelText("Price")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Analyze" })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(<AnalyzeForm onSubmit={onSubmit} isLoading={false} />);
    await user.click(screen.getByRole("button", { name: "Analyze" }));
    expect(screen.getByText("Enter a game name.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(<AnalyzeForm onSubmit={onSubmit} isLoading={false} />);
    await user.type(screen.getByLabelText("Game name"), "Elden Ring");
    await user.type(screen.getByLabelText("Price"), "60");
    await user.click(screen.getByRole("button", { name: "Analyze" }));
    expect(onSubmit).toHaveBeenCalledWith("Elden Ring", 60);
  });

  it("shows loading state when isLoading is true", () => {
    renderWithProviders(<AnalyzeForm onSubmit={vi.fn()} isLoading={true} />);
    expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled();
  });

  it("disables inputs when loading", () => {
    renderWithProviders(<AnalyzeForm onSubmit={vi.fn()} isLoading={true} />);
    expect(screen.getByLabelText("Game name")).toBeDisabled();
    expect(screen.getByLabelText("Price")).toBeDisabled();
  });

  it("allows form when no provider but free trial available", () => {
    mockAppContext.state = {
      ...mockAppContext.state,
      aiProvider: null,
      freeAnalysesUsed: 0,
    };
    renderWithProviders(<AnalyzeForm onSubmit={vi.fn()} isLoading={false} />);
    expect(screen.getByRole("button", { name: "Analyze" })).not.toBeDisabled();
  });

  it("disables form when no provider and trial exhausted", () => {
    mockAppContext.state = {
      ...mockAppContext.state,
      aiProvider: null,
      freeAnalysesUsed: 5,
    };
    renderWithProviders(<AnalyzeForm onSubmit={vi.fn()} isLoading={false} />);
    expect(screen.getByRole("button", { name: "Analyze" })).toBeDisabled();
  });

  it("shows price validation error for negative price", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AnalyzeForm onSubmit={vi.fn()} isLoading={false} />);
    await user.type(screen.getByLabelText("Game name"), "Test");
    await user.type(screen.getByLabelText("Price"), "-5");
    await user.click(screen.getByRole("button", { name: "Analyze" }));
    expect(screen.getByText(/valid price/i)).toBeInTheDocument();
  });
});
