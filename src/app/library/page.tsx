"use client";
import { Suspense } from "react";
import { GameLibrary } from "@/features/manage-library";

export default function Library() {
  return (
    <Suspense>
      <GameLibrary />
    </Suspense>
  );
}
