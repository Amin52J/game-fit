#!/usr/bin/env node

/**
 * Reads the version from package.json and writes it into
 * src-tauri/tauri.conf.json and src-tauri/Cargo.toml.
 * Intended to run as a pre-commit hook so only package.json needs to be bumped.
 * UpdateNotification.tsx reads the version at runtime via Tauri's getVersion() API.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const version = JSON.parse(
  readFileSync(resolve(root, "package.json"), "utf-8"),
).version;

let changed = false;

// --- tauri.conf.json ---
const tauriPath = resolve(root, "src-tauri", "tauri.conf.json");
const tauriRaw = readFileSync(tauriPath, "utf-8");
const tauriUpdated = tauriRaw.replace(
  /("version":\s*")([^"]+)(")/,
  `$1${version}$3`,
);
if (tauriUpdated !== tauriRaw) {
  writeFileSync(tauriPath, tauriUpdated, "utf-8");
  changed = true;
  console.log(`sync-version: tauri.conf.json → ${version}`);
}

// --- Cargo.toml ---
const cargoPath = resolve(root, "src-tauri", "Cargo.toml");
const cargoRaw = readFileSync(cargoPath, "utf-8");
const cargoUpdated = cargoRaw.replace(
  /^(version\s*=\s*")([^"]+)(")/m,
  `$1${version}$3`,
);
if (cargoUpdated !== cargoRaw) {
  writeFileSync(cargoPath, cargoUpdated, "utf-8");
  changed = true;
  console.log(`sync-version: Cargo.toml → ${version}`);
}

if (!changed) {
  console.log(`sync-version: all files already at ${version}`);
}
