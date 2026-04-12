"use client";

import { useEffect, useState } from "react";
import { Banner, Title, Dot, Body, Actions, Btn } from "./UpdateNotification.styles";
import {
  RELEASES_URL,
  API_URL,
  DISMISS_KEY,
  isTauri,
  compareVersions,
} from "./UpdateNotification.utils";

export function UpdateNotification() {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isTauri()) return;

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const { getVersion } = await import("@tauri-apps/api/app");
        const appVersion = await getVersion();
        if (cancelled) return;

        const res = await fetch(API_URL, {
          headers: { Accept: "application/vnd.github.v3+json" },
        });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        const tag: string = data.tag_name ?? "";
        if (compareVersions(tag, appVersion) > 0) {
          const latest = tag.replace(/^v/, "");
          const dismissedVersion = localStorage.getItem(DISMISS_KEY);
          if (dismissedVersion === latest) return;

          setCurrentVersion(appVersion);
          setLatestVersion(latest);
        }
      } catch (err) {
        console.warn("Update check failed:", err);
      }
    }, 3_000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  if (!latestVersion || !currentVersion || dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, latestVersion);
    setDismissed(true);
  };

  const handleDownload = async () => {
    const { openUrl } = await import("@tauri-apps/plugin-opener");
    await openUrl(RELEASES_URL);
  };

  return (
    <Banner>
      <Title>
        <Dot /> Update Available
      </Title>
      <Body>
        Version {latestVersion} is available. You are currently on{" "}
        {currentVersion}.
      </Body>
      <Actions>
        <Btn onClick={handleDismiss}>Later</Btn>
        <Btn $primary onClick={handleDownload}>
          Download
        </Btn>
      </Actions>
    </Banner>
  );
}
