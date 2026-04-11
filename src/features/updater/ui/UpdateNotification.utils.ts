export const REPO = "Amin52J/game-fit";
export const RELEASES_URL = `https://github.com/${REPO}/releases/latest`;
export const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;
export const DISMISS_KEY = "gamefit_update_dismissed";

export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI__" in window;
}

export function compareVersions(a: string, b: string): number {
  const pa = a.replace(/^v/, "").split(".").map(Number);
  const pb = b.replace(/^v/, "").split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na !== nb) return na - nb;
  }
  return 0;
}
