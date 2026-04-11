"use client";

import React from "react";
import { Button, Input } from "@/shared/ui";
import { ModalBackdrop, ModalCard, ModalTitle, ModalActions } from "./GameLibrary.styles";

export function AddGameModal({
  addName,
  setAddName,
  addScore,
  setAddScore,
  onAdd,
  onClose,
}: {
  addName: string;
  setAddName: (v: string) => void;
  addScore: string;
  setAddScore: (v: string) => void;
  onAdd: () => void;
  onClose: () => void;
}) {
  return (
    <ModalBackdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Add Game</ModalTitle>
        <Input
          label="Game name"
          id="add-game-name"
          autoFocus
          value={addName}
          onChange={(e) => setAddName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onAdd();
            if (e.key === "Escape") onClose();
          }}
          placeholder="Enter game name..."
        />
        <Input
          label="Score (optional)"
          id="add-game-score"
          value={addScore}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "" || (/^\d+$/.test(v) && Number(v) <= 100)) setAddScore(v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") onAdd();
            if (e.key === "Escape") onClose();
          }}
          placeholder="0–100"
          type="number"
          min={0}
          max={100}
          inputMode="numeric"
        />
        <ModalActions>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!addName.trim()} onClick={onAdd}>
            Add
          </Button>
        </ModalActions>
      </ModalCard>
    </ModalBackdrop>
  );
}
