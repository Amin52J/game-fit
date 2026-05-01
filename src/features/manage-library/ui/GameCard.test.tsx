import { screen, fireEvent } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Game } from "@/shared/types";
import { useGameCover } from "@/entities/game";
import { renderWithProviders, resetAllMocks } from "@/__tests__/test-utils";
import { GameCard } from "./GameCard";

vi.mock("@/entities/game/lib/useGameCover", () => ({
  useGameCover: vi.fn(),
}));

const mockedUseGameCover = vi.mocked(useGameCover);

beforeEach(() => {
  resetAllMocks();
  mockedUseGameCover.mockReset();
});

function makeGame(overrides: Partial<Game> = {}): Game {
  return { id: "g1", name: "Elden Ring", score: 95, ...overrides };
}

describe("GameCard", () => {
  it("renders the title and a numeric score badge", () => {
    mockedUseGameCover.mockReturnValue({ image: null, isLoading: false, isError: false });
    renderWithProviders(<GameCard game={makeGame()} />);

    expect(screen.getByText("Elden Ring")).toBeInTheDocument();
    expect(screen.getByLabelText("Score: 95")).toHaveTextContent("95");
  });

  it("shows an em dash for unscored games", () => {
    mockedUseGameCover.mockReturnValue({ image: null, isLoading: false, isError: false });
    renderWithProviders(<GameCard game={makeGame({ score: null })} />);

    expect(screen.getByLabelText("Score: unscored")).toHaveTextContent("—");
  });

  it("renders the cover image when one is available", () => {
    mockedUseGameCover.mockReturnValue({
      image: "https://cdn/cover.jpg",
      isLoading: false,
      isError: false,
    });
    renderWithProviders(<GameCard game={makeGame()} />);

    const img = screen.getByRole("img", { name: "Elden Ring" }) as HTMLImageElement;
    expect(img.src).toBe("https://cdn/cover.jpg");
    expect(img.getAttribute("loading")).toBe("lazy");
  });

  it("falls back to initials when the image fails to load", () => {
    mockedUseGameCover.mockReturnValue({
      image: "https://cdn/broken.jpg",
      isLoading: false,
      isError: false,
    });
    renderWithProviders(<GameCard game={makeGame()} />);

    const img = screen.getByRole("img", { name: "Elden Ring" });
    fireEvent.error(img);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getAllByText("ER").length).toBeGreaterThan(0);
  });

  it("shows initials fallback when no image is returned", () => {
    mockedUseGameCover.mockReturnValue({ image: null, isLoading: false, isError: false });
    renderWithProviders(<GameCard game={makeGame({ name: "Cyberpunk 2077" })} />);

    expect(screen.getByText("C2")).toBeInTheDocument();
  });

  it("uses two-letter initials from a single-word name", () => {
    mockedUseGameCover.mockReturnValue({ image: null, isLoading: false, isError: false });
    renderWithProviders(<GameCard game={makeGame({ name: "Hades" })} />);

    expect(screen.getByText("HA")).toBeInTheDocument();
  });

  it("renders a question mark when the name has no alphanumerics", () => {
    mockedUseGameCover.mockReturnValue({ image: null, isLoading: false, isError: false });
    renderWithProviders(<GameCard game={makeGame({ name: "!!!" })} />);

    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("does not render an image while loading", () => {
    mockedUseGameCover.mockReturnValue({ image: null, isLoading: true, isError: false });
    renderWithProviders(<GameCard game={makeGame()} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
