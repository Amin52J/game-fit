"use client";

import React, { useRef, useState } from "react";
import { Button, PageWrapper, PageHeader, PageTitle, PageSubtitle, ButtonRow } from "@/shared/ui";
import { useGameLibrary } from "./GameLibrary.hooks";
import { ImportSection } from "./ImportSection";
import { LibraryStats } from "./LibraryStats";
import { LibraryToolbar } from "./LibraryToolbar";
import { GameTable } from "./GameTable";
import { AddGameModal } from "./AddGameModal";
import { LibraryPagination } from "./LibraryPagination";

export function GameLibrary() {
  const tableRef = useRef<HTMLDivElement>(null);
  const lib = useGameLibrary();
  const [showImport, setShowImport] = useState(false);

  return (
    <PageWrapper>
      <PageHeader>
        <div>
          <PageTitle>Game Library</PageTitle>
          <PageSubtitle>{lib.games.length} games in your library</PageSubtitle>
        </div>
        <ButtonRow>
          <Button variant="secondary" onClick={() => setShowImport(!showImport)}>
            {showImport ? "Hide Import" : "Import Games"}
          </Button>
          <Button variant="secondary" onClick={lib.handleExport}>
            Export CSV
          </Button>
          <Button
            variant="secondary"
            onClick={() => { lib.setAddName(""); lib.setAddScore(""); lib.setShowAddModal(true); }}
          >
            + Add Game
          </Button>
          {lib.games.length > 0 && (
            <Button
              variant="danger"
              onClick={lib.handleClearLibrary}
              onBlur={() => lib.setConfirmClear(false)}
            >
              {lib.confirmClear ? "Are you sure?" : "Clear Library"}
            </Button>
          )}
        </ButtonRow>
      </PageHeader>

      {showImport && (
        <ImportSection handleImport={lib.handleImport} onHide={() => setShowImport(false)} />
      )}

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
    </PageWrapper>
  );
}
