"use client";

import React from "react";
import { Icon } from "@/shared/ui";
import type { Game } from "@/shared/types";
import {
  Row,
  GameName,
  ScoreBadge,
  InlineInput,
  InlineNameInput,
  RowActions,
  IconBtn,
} from "./GameLibrary.styles";

export function GameRow({
  game,
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
  game: Game;
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
  const isEditing = editingId === game.id;

  return (
    <Row $editing={isEditing}>
      <GameName>
        {isEditing ? (
          <InlineNameInput
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit(game);
              if (e.key === "Escape") setEditingId(null);
            }}
            placeholder="Game name"
          />
        ) : (
          game.name
        )}
      </GameName>
      <div>
        {isEditing ? (
          <InlineInput
            value={editScore}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || (/^\d+$/.test(v) && Number(v) <= 100)) setEditScore(v);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit(game);
              if (e.key === "Escape") setEditingId(null);
            }}
            autoFocus
            placeholder="—"
            type="number"
            min={0}
            max={100}
            inputMode="numeric"
          />
        ) : (
          <ScoreBadge $score={game.score}>
            {game.score !== null ? game.score : "—"}
          </ScoreBadge>
        )}
      </div>
      <RowActions>
        {isEditing ? (
          <>
            <IconBtn onClick={() => saveEdit(game)} title="Save">
              <Icon name="check" size={16} />
            </IconBtn>
            <IconBtn onClick={() => setEditingId(null)} title="Cancel">
              <Icon name="x" size={16} />
            </IconBtn>
          </>
        ) : (
          <>
            <IconBtn onClick={() => startEdit(game)} title="Edit">
              <Icon name="edit" size={16} />
            </IconBtn>
            <IconBtn
              $danger={confirmDeleteId === game.id}
              onClick={() => handleDeleteGame(game.id)}
              onBlur={() => setConfirmDeleteId(null)}
              title={confirmDeleteId === game.id ? "Confirm delete" : "Delete"}
            >
              <Icon name={confirmDeleteId === game.id ? "alert-triangle" : "trash"} size={16} />
            </IconBtn>
          </>
        )}
      </RowActions>
    </Row>
  );
}
