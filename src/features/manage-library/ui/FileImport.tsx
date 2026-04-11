"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { DropZone, SectionLabel, DropZoneTitle, DropZoneHint } from "./GameLibrary.styles";

export function FileImport({ handleImport }: { handleImport: (text: string) => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "text/*": [".csv", ".json", ".txt"], "application/json": [".json"] },
    multiple: true,
    onDrop: async (files) => {
      for (const file of files) {
        const text = await file.text();
        handleImport(text);
      }
    },
    noClick: false,
  });

  return (
    <div>
      <SectionLabel>File import</SectionLabel>
      <DropZone {...getRootProps()} $active={isDragActive} $marginTop $flushBottom>
        <input {...getInputProps()} />
        <DropZoneTitle>
          {isDragActive ? "Drop your file here..." : "Drag & drop CSV, JSON, or text files here"}
        </DropZoneTitle>
        <DropZoneHint>
          or click to browse — multiple files supported, games merge with your existing library
        </DropZoneHint>
      </DropZone>
    </div>
  );
}
