"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { parseAnyFormat } from "@/entities/game/lib/csv-parser";
import { openSteamLoginPopup, fetchSteamGames, extractSteamIdFromParams } from "@/features/auth/lib/steam";
import { openEpicLoginTab, fetchEpicGames } from "@/features/auth/lib/epic";
import type { Game } from "@/shared/types";
import { mergeGameLists, computeScoreBuckets, generateId } from "../SetupWizard.utils";
import {
  FieldGroup,
  SectionTitle,
  SectionHint,
  Label,
  TextAreaField,
  InlineActions,
  Btn,
  StatusPill,
  FlexGrowTextInput,
  StatusPillTopMd,
  EpicAuthStack,
  EpicAuthRow,
  DropZone,
  DropTitle,
  DropHint,
  PreviewBox,
  PreviewTitle,
  PreviewList,
  BucketRow,
  PlatformSection,
  PlatformRow,
  PlatformBtn,
  PlatformStatusText,
} from "../SetupWizard.styles";

export function StepImportLibrary({
  importedGames,
  setImportedGames,
  pasteText,
  setPasteText,
  parseError,
  setParseError,
  steamAutoImportCount,
}: {
  importedGames: Game[];
  setImportedGames: React.Dispatch<React.SetStateAction<Game[]>>;
  pasteText: string;
  setPasteText: (v: string) => void;
  parseError: string | null;
  setParseError: (v: string | null) => void;
  steamAutoImportCount: number | null;
}) {
  const [steamLoading, setSteamLoading] = useState(false);
  const [steamCount, setSteamCount] = useState<number | null>(steamAutoImportCount);
  const [steamError, setSteamError] = useState<string | null>(null);

  useEffect(() => {
    if (steamAutoImportCount !== null) setSteamCount(steamAutoImportCount);
  }, [steamAutoImportCount]);

  const [epicStep, setEpicStep] = useState<"idle" | "waiting" | "loading">("idle");
  const [epicCode, setEpicCode] = useState("");
  const [epicCount, setEpicCount] = useState<number | null>(null);
  const [epicError, setEpicError] = useState<string | null>(null);

  const handleEpicLogin = () => {
    openEpicLoginTab();
    setEpicStep("waiting");
    setEpicError(null);
  };

  const handleEpicSubmitCode = async () => {
    if (!epicCode.trim()) return;
    setEpicError(null);
    setEpicStep("loading");
    try {
      const games = await fetchEpicGames(epicCode.trim());
      const mapped: Game[] = games.map((name) => ({
        id: generateId(),
        name,
        score: null,
      }));
      setImportedGames((prev) => mergeGameLists(prev, mapped));
      setEpicCount(games.length);
      setEpicStep("idle");
      setEpicCode("");
    } catch (err) {
      setEpicError(err instanceof Error ? err.message : "Failed to import Epic games");
      setEpicStep("waiting");
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setParseError(null);
      try {
        const texts = await Promise.all(acceptedFiles.map((f) => f.text()));
        let combined: Game[] = [];
        for (const raw of texts) {
          const parsed = parseAnyFormat(raw);
          combined = mergeGameLists(combined, parsed);
        }
        setImportedGames((prev) => mergeGameLists(prev, combined, true));
      } catch {
        setParseError("Could not read one or more files.");
      }
    },
    [setImportedGames, setParseError],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/*": [".csv", ".txt", ".json"], "application/json": [".json"] },
    multiple: true,
  });

  const applyPaste = () => {
    setParseError(null);
    try {
      const parsed = parseAnyFormat(pasteText);
      setImportedGames((prev) => mergeGameLists(prev, parsed, true));
    } catch {
      setParseError("Could not parse pasted content.");
    }
  };

  const handleSteamConnect = async () => {
    setSteamError(null);
    setSteamLoading(true);
    try {
      let steamId = sessionStorage.getItem("gamefit_steam_id");

      if (!steamId) {
        const params = await openSteamLoginPopup();
        steamId = extractSteamIdFromParams(params);
        if (!steamId) throw new Error("Could not extract Steam ID");
      }

      const games = await fetchSteamGames(steamId);
      const mapped: Game[] = games.map((g) => ({
        id: generateId(),
        name: g.name,
        score: null,
      }));

      setImportedGames((prev) => mergeGameLists(prev, mapped));
      setSteamCount(games.length);
    } catch (err) {
      setSteamError(err instanceof Error ? err.message : "Failed to connect to Steam");
    }
    setSteamLoading(false);
  };

  const buckets = useMemo(() => computeScoreBuckets(importedGames), [importedGames]);
  const previewNames = importedGames.slice(0, 6);

  return (
    <FieldGroup>
      <SectionTitle>Import your library</SectionTitle>
      <SectionHint>
        Connect your gaming platforms or import a CSV / text file. Duplicates are automatically
        merged, with manual imports taking priority.
      </SectionHint>

      <PlatformSection>
        <Label>Connect platforms</Label>
        <PlatformRow>
          <PlatformBtn
            type="button"
            $color="#171a21"
            $connected={steamCount !== null}
            onClick={handleSteamConnect}
            disabled={steamLoading}
          >
            <img src="/steam-logo.svg" alt="" width="16" height="16" />
            {steamLoading ? "Connecting…" : steamCount !== null ? `Steam (${steamCount} games)` : "Steam"}
          </PlatformBtn>
        </PlatformRow>
        {steamError && <StatusPill>{steamError}</StatusPill>}
        {steamCount !== null && (
          <PlatformStatusText>
            Imported {steamCount} games from Steam. Your profile must be public.
          </PlatformStatusText>
        )}
      </PlatformSection>

      <PlatformSection>
        <Label>Epic Games</Label>
        {epicCount !== null ? (
          <PlatformStatusText>
            Imported {epicCount} games from Epic Games.
          </PlatformStatusText>
        ) : epicStep === "idle" ? (
          <PlatformRow>
            <PlatformBtn type="button" $color="#2f2f2f" onClick={handleEpicLogin}>
              <img src="/epic-logo.svg" alt="" width="16" height="16" />
              Connect Epic Games
            </PlatformBtn>
          </PlatformRow>
        ) : (
          <EpicAuthStack>
            <PlatformStatusText>
              A new tab opened to Epic Games. Log in, then copy the authorization code shown on the page and paste it below.
            </PlatformStatusText>
            <EpicAuthRow>
              <FlexGrowTextInput
                placeholder="Paste authorization code…"
                value={epicCode}
                onChange={(e) => setEpicCode(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleEpicSubmitCode(); }}
              />
              <Btn
                type="button"
                $variant="primary"
                onClick={handleEpicSubmitCode}
                disabled={epicStep === "loading" || !epicCode.trim()}
              >
                {epicStep === "loading" ? "Importing…" : "Import"}
              </Btn>
            </EpicAuthRow>
          </EpicAuthStack>
        )}
        {epicError && <StatusPill>{epicError}</StatusPill>}
      </PlatformSection>

      <DropZone {...getRootProps()} $active={isDragActive}>
        <input {...getInputProps()} />
        <DropTitle>{isDragActive ? "Drop files here" : "Drag & drop files"}</DropTitle>
        <DropHint>
          CSV, JSON, or plain text · multiple files merge and de-duplicate by title
        </DropHint>
      </DropZone>

      <div>
        <Label htmlFor="gf-paste">Or paste data</Label>
        <TextAreaField
          id="gf-paste"
          rows={5}
          placeholder="Paste CSV, JSON array, or one game per line…"
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
        />
        <InlineActions>
          <Btn type="button" $variant="secondary" onClick={applyPaste}>
            Parse pasted text
          </Btn>
          <Btn type="button" $variant="ghost" onClick={() => { setImportedGames([]); setSteamCount(null); setEpicCount(null); setEpicStep("idle"); }}>
            Clear imported games
          </Btn>
        </InlineActions>
        {parseError ? <StatusPill>{parseError}</StatusPill> : null}
      </div>

      {importedGames.length > 0 ? (
        <PreviewBox>
          <PreviewTitle>
            Preview · {importedGames.length} game{importedGames.length === 1 ? "" : "s"}
          </PreviewTitle>
          <PreviewList>
            {previewNames.map((g) => (
              <li key={g.id}>
                {g.name}
                {g.score !== null && g.score !== undefined ? ` — ${g.score}/100` : ""}
              </li>
            ))}
            {importedGames.length > previewNames.length ? (
              <li>…and {importedGames.length - previewNames.length} more</li>
            ) : null}
          </PreviewList>
          <BucketRow>
            <span>Scores: 0–25: {buckets.b0_25}</span>
            <span>26–50: {buckets.b26_50}</span>
            <span>51–75: {buckets.b51_75}</span>
            <span>76–100: {buckets.b76_100}</span>
            <span>Unscored: {buckets.unscored}</span>
          </BucketRow>
        </PreviewBox>
      ) : null}
    </FieldGroup>
  );
}
