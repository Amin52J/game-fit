"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  Button,
  PageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  HashLink,
  GuidanceBanner,
} from "@/shared/ui";
import { useGameLibrary } from "./GameLibrary.hooks";
import { ImportSection } from "./ImportSection";
import { LibraryStats } from "./LibraryStats";
import { LibraryToolbar } from "./LibraryToolbar";
import { GameTable } from "./GameTable";
import { AddGameModal } from "./AddGameModal";
import { ScoreCalcModal } from "./ScoreCalcModal";
import { LibraryPagination } from "./LibraryPagination";

import { AddGameButtonRow } from "./GameLibrary.styles";
import type { Game } from "@/shared/types";

function LibraryBanners({ games, scored }: { games: Game[]; scored: number }) {
  const unscoredCount = useMemo(() => games.length - scored, [games.length, scored]);

  if (games.length > 0 && unscoredCount > 0 && scored >= 10) {
    return (
      <GuidanceBanner
        variant="info"
        linkText="Learn about scoring"
        linkHref="/help#scoring"
        dismissKey="library_scoring_banner"
      >
        <strong>
          {scored} of {games.length} games scored.
        </strong>{" "}
        {unscoredCount} game{unscoredCount === 1 ? " is" : "s are"} unscored and invisible to the
        AI.
      </GuidanceBanner>
    );
  }

  return null;
}

export function GameLibrary() {
  const tableRef = useRef<HTMLDivElement>(null);
  const lib = useGameLibrary();
  const [calcGame, setCalcGame] = useState<{ id: string; name: string } | null>(null);

  const totalGames = lib.games.length;
  const scoredCount = lib.scored.length;
  const needsMoreGames = totalGames < 10;
  const needsMoreScoring = totalGames >= 10 && scoredCount < 10;

  const openAddModal = () => {
    lib.setAddName("");
    lib.setAddScore("");
    lib.setShowAddModal(true);
  };

  const startScoring = () => {
    tableRef.current?.scrollIntoView({ behavior: "smooth" });
    const firstGame = lib.pageGames[0];
    if (firstGame) {
      setTimeout(() => lib.startEdit(firstGame), 400);
    }
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageHeader>
          <PageTitle>Game Library</PageTitle>
          <PageSubtitle>
            <HashLink
              href="/help#library"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              Learn more
            </HashLink>{" "}
            ·{" "}
            <HashLink
              href="/help#scoring"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              How scoring works
            </HashLink>
          </PageSubtitle>
        </PageHeader>

        <LibraryBanners games={lib.games} scored={scoredCount} />

        {needsMoreScoring ? (
          <GuidanceBanner variant="warning" linkText="How scoring works" linkHref="/help#scoring">
            You have {totalGames} games but only {scoredCount} scored. Click any game row below to
            score it. You need at least 10 scored games to run an analysis.
          </GuidanceBanner>
        ) : null}

        {needsMoreGames ? (
          <AddGameButtonRow>
            <Button variant="primary" onClick={openAddModal} style={{ width: "100%" }}>
              + Add Game
            </Button>
          </AddGameButtonRow>
        ) : needsMoreScoring ? (
          <AddGameButtonRow style={{ display: "flex", gap: "0.5rem" }}>
            <Button variant="secondary" onClick={openAddModal} style={{ flex: 1 }}>
              + Add Game
            </Button>
            <Button variant="primary" onClick={startScoring} style={{ flex: 1 }}>
              Start Scoring
            </Button>
          </AddGameButtonRow>
        ) : (
          <AddGameButtonRow>
            <Button variant="primary" onClick={openAddModal} style={{ width: "100%" }}>
              + Add Game
            </Button>
          </AddGameButtonRow>
        )}
      </PageHeader>

      <ImportSection handleImport={lib.handleImport} />

      <LibraryStats games={lib.games} scored={lib.scored} avgScore={lib.avgScore} />

      <LibraryToolbar
        inputValue={lib.inputValue}
        setSearch={lib.setSearch}
        activeRanges={lib.activeRanges}
        toggleRange={lib.toggleRange}
      />

      <GameTable
        tableRef={tableRef}
        pageGames={lib.pageGames}
        totalGames={lib.games.length}
        sortField={lib.sortField}
        sortDir={lib.sortDir}
        toggleSort={lib.toggleSort}
        editingId={lib.editingId}
        editName={lib.editName}
        setEditName={lib.setEditName}
        editScore={lib.editScore}
        setEditScore={lib.setEditScore}
        confirmDeleteId={lib.confirmDeleteId}
        saveEdit={lib.saveEdit}
        setEditingId={lib.setEditingId}
        startEdit={lib.startEdit}
        handleDeleteGame={lib.handleDeleteGame}
        setConfirmDeleteId={lib.setConfirmDeleteId}
        onCalcScore={(g) => setCalcGame({ id: g.id, name: g.name })}
      />

      <LibraryPagination
        clampedPage={lib.clampedPage}
        totalPages={lib.totalPages}
        setPage={lib.setPage}
        tableRef={tableRef}
      />

      {lib.showAddModal && (
        <AddGameModal
          addName={lib.addName}
          setAddName={lib.setAddName}
          addScore={lib.addScore}
          setAddScore={lib.setAddScore}
          onAdd={lib.handleAddGame}
          onClose={() => lib.setShowAddModal(false)}
        />
      )}

      {calcGame && (
        <ScoreCalcModal
          gameName={calcGame.name}
          onApply={(score) => {
            const game = lib.games.find((g) => g.id === calcGame.id);
            if (game) lib.updateGame({ ...game, score });
            setCalcGame(null);
          }}
          onClose={() => setCalcGame(null)}
        />
      )}
    </PageWrapper>
  );
}
