export const theme = {
  colors: {
    bg: "#08080e",
    bgGradient: "linear-gradient(135deg, #08080e 0%, #0c0c18 50%, #08080e 100%)",
    surface: "#111120",
    surfaceHover: "#16162a",
    surfaceElevated: "#1a1a30",
    border: "#252540",
    borderLight: "#303050",
    text: "#e4e4f0",
    textSecondary: "#8888a8",
    textMuted: "#555570",
    accent: "#7c8aff",
    accentHover: "#9ba6ff",
    accentMuted: "rgba(124, 138, 255, 0.15)",
    accentGlow: "rgba(124, 138, 255, 0.3)",
    success: "#22c55e",
    successMuted: "rgba(34, 197, 94, 0.15)",
    warning: "#f59e0b",
    warningMuted: "rgba(245, 158, 11, 0.15)",
    error: "#ef4444",
    errorMuted: "rgba(239, 68, 68, 0.15)",
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    xl: "20px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  font: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  shadow: {
    sm: "0 1px 3px rgba(0,0,0,0.4)",
    md: "0 4px 12px rgba(0,0,0,0.5)",
    lg: "0 8px 30px rgba(0,0,0,0.6)",
    glow: "0 0 20px rgba(124, 138, 255, 0.15)",
  },
  transition: {
    fast: "150ms ease",
    normal: "250ms ease",
  },
} as const;

export type Theme = typeof theme;
