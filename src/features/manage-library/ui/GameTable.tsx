"use client";

import React from "react";
import { Icon } from "@/shared/ui";
import type { Game } from "@/shared/types";
import type { SortField, SortDir } from "./GameLibrary.types";
import { GameRow } from "./GameRow";
import {
  Table,
  TableHeader,
  SortableCol,
  SortArrow,
  TableHeaderActionsLabel,
  Empty,
} from "./GameLibrary.styles";

export function GameTable({
  tableRef,
  pageGames,
  totalGames,
  sortField,
  sortDir,
  toggleSort,
  editingId,
  editName,
  setEditName,
  editScore,
  setEditScore,
  confirmDeleteId,
  saveEdit,
  setEditingId,
  startEdit,
  handleDeleteGame,
  setConfirmDeleteId,
}: {
  tableRef: React.RefObject<HTMLDivElement | null>;
  pageGames: Game[];
  totalGames: number;
  sortField: SortField;
  sortDir: SortDir;
  toggleSort: (f: SortField) => void;
  editingId: string | null;
  editName: string;
  setEditName: (v: string) => void;
  editScore: string;
  setEditScore: (v: string) => void;
  confirmDeleteId: string | null;
  saveEdit: (g: Game) => void;
  setEditingId: (id: string | null) => void;
  startEdit: (g: Game) => void;
  handleDeleteGame: (id: string) => void;
  setConfirmDeleteId: (id: string | null) => void;
}) {
  return (
    <Table ref={tableRef}>
      <TableHeader>
        <SortableCol $active={sortField === "name"} onClick={() => toggleSort("name")}>
          Game
          <SortArrow $dir={sortField === "name" ? sortDir : null}>
            <Icon name={sortField === "name" && sortDir === "asc" ? "chevron-up" : "chevron-down"} size={14} />
          </SortArrow>
        </SortableCol>
        <SortableCol $active={sortField === "score"} onClick={() => toggleSort("score")}>
          Score
          <SortArrow $dir={sortField === "score" ? sortDir : null}>
            <Icon name={sortField === "score" && sortDir === "asc" ? "chevron-up" : "chevron-down"} size={14} />
          </SortArrow>
        </SortableCol>
        <TableHeaderActionsLabel>Actions</TableHeaderActionsLabel>
      </TableHeader>
      {pageGames.length === 0 ? (
        <Empty>
          {totalGames === 0
            ? "No games yet — import your library to get started"
            : "No games match your search"}
        </Empty>
      ) : (
        pageGames.map((game) => (
          <GameRow
            key={game.id}
            game={game}
            editingId={editingId}
            editName={editName}
            setEditName={setEditName}
            editScore={editScore}
            setEditScore={setEditScore}
            confirmDeleteId={confirmDeleteId}
            saveEdit={saveEdit}
            setEditingId={setEditingId}
            startEdit={startEdit}
            handleDeleteGame={handleDeleteGame}
            setConfirmDeleteId={setConfirmDeleteId}
          />
        ))
      )}
    </Table>
  );
}
