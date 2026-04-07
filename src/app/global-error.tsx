"use client";

import { useEffect } from "react";

const font = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const mono = "'JetBrains Mono', 'Fira Code', monospace";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08080e",
          backgroundImage:
            "radial-gradient(ellipse 120% 80% at 50% -30%, rgba(124,138,255,0.3) 0%, transparent 55%), " +
            "linear-gradient(135deg, #08080e 0%, #0c0c18 50%, #08080e 100%)",
          color: "#e4e4f0",
          fontFamily: font,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 440, padding: 32 }}>
          <span
            style={{
              fontFamily: mono,
              fontSize: "6rem",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              background: "linear-gradient(135deg, #ef4444 0%, #555570 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Error
          </span>

          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: 16, marginBottom: 0 }}>
            Application crashed
          </h1>

          <p
            style={{
              fontSize: "0.9375rem",
              color: "#8888a8",
              lineHeight: 1.6,
              marginTop: 8,
              marginBottom: 0,
            }}
          >
            A critical error prevented the page from rendering. This is usually temporary and
            resolved by retrying.
          </p>

          {error.digest && (
            <code
              style={{
                display: "inline-block",
                marginTop: 16,
                fontFamily: mono,
                fontSize: "0.75rem",
                color: "#555570",
                background: "#1a1a30",
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid #252540",
              }}
            >
              Error ID: {error.digest}
            </code>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 32 }}>
            <button
              onClick={() => reset()}
              style={{
                padding: "10px 28px",
                fontSize: "0.875rem",
                fontWeight: 600,
                fontFamily: font,
                color: "#e4e4f0",
                background: "#7c8aff",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              style={{
                padding: "10px 28px",
                fontSize: "0.875rem",
                fontWeight: 600,
                fontFamily: font,
                color: "#e4e4f0",
                background: "#111120",
                border: "1px solid #252540",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Go home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
