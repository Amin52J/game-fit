import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { readCoverCache, writeCoverCache, clearCoverCache, normalizeName } from "./cover-cache";

describe("cover-cache", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("normalizeName", () => {
    it("trims, lowercases and collapses internal whitespace", () => {
      expect(normalizeName("  Elden   Ring  ")).toBe("elden ring");
    });

    it("returns empty string for whitespace-only input", () => {
      expect(normalizeName("   ")).toBe("");
    });

    it("normalizes tabs and newlines to a single space", () => {
      expect(normalizeName("Half\tLife\n2")).toBe("half life 2");
    });
  });

  describe("readCoverCache / writeCoverCache", () => {
    it("returns null when no entry is cached", () => {
      expect(readCoverCache("Unknown Game")).toBeNull();
    });

    it("returns the cached entry after a write", () => {
      writeCoverCache("Elden Ring", "https://example.com/elden.jpg");
      const cached = readCoverCache("Elden Ring");
      expect(cached?.image).toBe("https://example.com/elden.jpg");
      expect(typeof cached?.fetchedAt).toBe("number");
    });

    it("treats names with different casing/whitespace as the same key", () => {
      writeCoverCache("Elden Ring", "url-1");
      expect(readCoverCache("  ELDEN   ring ")?.image).toBe("url-1");
    });

    it("supports null images (negative cache)", () => {
      writeCoverCache("No Cover Game", null);
      expect(readCoverCache("No Cover Game")?.image).toBeNull();
    });

    it("returns null and removes entry once it expires", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      writeCoverCache("Old Game", "url");

      vi.setSystemTime(new Date("2026-03-01T00:00:00Z"));
      expect(readCoverCache("Old Game")).toBeNull();
      expect(window.localStorage.getItem("sgdb:cover:old game")).toBeNull();
    });

    it("returns null when the stored payload is malformed JSON", () => {
      window.localStorage.setItem("sgdb:cover:broken game", "{not json");
      expect(readCoverCache("Broken Game")).toBeNull();
    });

    it("returns null when fetchedAt is missing", () => {
      window.localStorage.setItem(
        "sgdb:cover:partial game",
        JSON.stringify({ image: "x" }),
      );
      expect(readCoverCache("Partial Game")).toBeNull();
    });

    it("write swallows quota / access errors silently", () => {
      const setItem = vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceeded");
      });
      expect(() => writeCoverCache("Any", "x")).not.toThrow();
      setItem.mockRestore();
    });
  });

  describe("clearCoverCache", () => {
    it("removes only sgdb cover entries, leaves other keys intact", () => {
      writeCoverCache("Game A", "a");
      writeCoverCache("Game B", "b");
      window.localStorage.setItem("unrelated", "keep me");

      clearCoverCache();

      expect(readCoverCache("Game A")).toBeNull();
      expect(readCoverCache("Game B")).toBeNull();
      expect(window.localStorage.getItem("unrelated")).toBe("keep me");
    });

    it("is a no-op when there is nothing to clear", () => {
      expect(() => clearCoverCache()).not.toThrow();
    });
  });
});
