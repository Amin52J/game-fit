#!/usr/bin/env node

/**
 * Determines the next semantic version by scanning commits since the last
 * git tag. Uses conventional-commit prefixes:
 *
 *   feat:  / feat(…):    → minor
 *   fix:   / fix(…):     → patch
 *   BREAKING CHANGE / !: → major
 *   anything else         → patch
 *
 * Writes the new version into package.json, then delegates to
 * sync-version.mjs to propagate it to the other files.
 *
 * Outputs the new version to stdout (last line) so CI can capture it.
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// ── read current version ──
const pkgPath = resolve(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
const [major, minor, patch] = pkg.version.split(".").map(Number);

// ── find last tag ──
let range;
try {
  const lastTag = execSync("git describe --tags --abbrev=0", {
    encoding: "utf-8",
    cwd: root,
  }).trim();
  range = `${lastTag}..HEAD`;
} catch {
  range = "HEAD";
}

// ── collect commit subjects ──
const log = execSync(`git log ${range} --pretty=format:%s`, {
  encoding: "utf-8",
  cwd: root,
}).trim();

const commits = log ? log.split("\n") : [];

if (commits.length === 0) {
  console.log(`bump-version: no new commits since last tag — staying at ${pkg.version}`);
  console.log(pkg.version);
  process.exit(0);
}

// ── determine bump type ──
let bump = "patch";

for (const msg of commits) {
  if (/BREAKING[ -]CHANGE/i.test(msg) || /^[a-z]+(\(.+\))?!:/.test(msg)) {
    bump = "major";
    break;
  }
  if (/^feat(\(.+\))?:/.test(msg)) {
    bump = "minor";
  }
}

// ── compute new version ──
let newVersion;
switch (bump) {
  case "major":
    newVersion = `${major + 1}.0.0`;
    break;
  case "minor":
    newVersion = `${major}.${minor + 1}.0`;
    break;
  default:
    newVersion = `${major}.${minor}.${patch + 1}`;
}

// ── write package.json ──
pkg.version = newVersion;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
console.log(`bump-version: ${pkg.version !== newVersion ? pkg.version + " → " : ""}${bump} bump → ${newVersion}`);

// ── propagate via sync-version ──
execSync("node scripts/sync-version.mjs", { stdio: "inherit", cwd: root });

// last line = the version (for CI to capture)
console.log(newVersion);
