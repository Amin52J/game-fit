import { screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Game } from "@/shared/types";
import { renderWithProviders, resetAllMocks } from "@/__tests__/test-utils";
import { GameGrid } from "./GameGrid";

vi.mock("./GameCard", () => ({
  GameCard: ({ game }: { game: Game }) => <div data-testid="game-card">{game.name}</div>,
}));

beforeEach(resetAllMocks);

function gridRef() {
  return { current: null } as React.RefObject<HTMLDivElement | null>;
}

const games: Game[] = [
  { id: "1", name: "Elden Ring", score: 95 },
  { id: "2", name: "Hades", score: 92 },
];

describe("GameGrid", () => {
  it("shows the import prompt when the library is completely empty", () => {
    renderWithProviders(<GameGrid gridRef={gridRef()} pageGames={[]} totalGames={0} />);

    expect(
      screen.getByText("No games yet — import your library to get started"),
    ).toBeInTheDocument();
  });

  it("shows the no-match message when filters hide every game", () => {
    renderWithProviders(<GameGrid gridRef={gridRef()} pageGames={[]} totalGames={42} />);

    expect(screen.getByText("No games match your search")).toBeInTheDocument();
  });

  it("renders one card per game on the current page", () => {
    renderWithProviders(<GameGrid gridRef={gridRef()} pageGames={games} totalGames={games.length} />);

    const cards = screen.getAllByTestId("game-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("Elden Ring");
    expect(cards[1]).toHaveTextContent("Hades");
  });
});
