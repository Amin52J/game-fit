import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchGameCover } from "../api/cover";
import { writeCoverCache } from "../model/cover-cache";
import { useGameCover } from "./useGameCover";

vi.mock("../api/cover", () => ({
  fetchGameCover: vi.fn(),
}));

const mockedFetch = vi.mocked(fetchGameCover);

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, retryDelay: 0, gcTime: 0 } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useGameCover", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it("does not fetch when name is empty", () => {
    const { result } = renderHook(() => useGameCover("   "), { wrapper });
    expect(result.current.image).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("does not fetch when explicitly disabled", () => {
    const { result } = renderHook(() => useGameCover("Elden Ring", false), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("returns cached image immediately without calling the API", async () => {
    writeCoverCache("Elden Ring", "https://cache/cover.jpg");

    const { result } = renderHook(() => useGameCover("Elden Ring"), { wrapper });

    await waitFor(() => {
      expect(result.current.image).toBe("https://cache/cover.jpg");
    });
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("fetches and exposes the image when not cached", async () => {
    mockedFetch.mockResolvedValue({ image: "https://api/cover.jpg" });

    const { result } = renderHook(() => useGameCover("Cyberpunk 2077"), { wrapper });

    await waitFor(() => {
      expect(result.current.image).toBe("https://api/cover.jpg");
    });
    expect(mockedFetch).toHaveBeenCalledWith("Cyberpunk 2077");
    expect(result.current.isError).toBe(false);
  });

  it("flags isError when the fetch fails", async () => {
    mockedFetch.mockRejectedValue(new Error("nope"));

    const { result } = renderHook(() => useGameCover("Failing Game"), { wrapper });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 },
    );
    expect(result.current.image).toBeNull();
  });
});
