import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSupabase } from "@/shared/api/supabase";
import { fetchGameCover } from "./cover";

vi.mock("@/shared/api/supabase", () => ({
  getSupabase: vi.fn(),
}));

const mockedGetSupabase = vi.mocked(getSupabase);

function makeSupabase(invokeImpl: (args: { body: unknown }) => Promise<unknown>) {
  return {
    functions: {
      invoke: vi.fn(invokeImpl),
    },
  } as unknown as ReturnType<typeof getSupabase>;
}

describe("fetchGameCover", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the image URL on success", async () => {
    const sb = makeSupabase(async () => ({
      data: { image: "https://cdn/cover.jpg" },
      error: null,
    }));
    mockedGetSupabase.mockReturnValue(sb);

    const result = await fetchGameCover("Elden Ring");
    expect(result).toEqual({ image: "https://cdn/cover.jpg" });
    expect(sb.functions.invoke).toHaveBeenCalledWith("sgdb-cover", {
      body: { name: "Elden Ring" },
    });
  });

  it("returns null image when no image is present in response", async () => {
    const sb = makeSupabase(async () => ({ data: {}, error: null }));
    mockedGetSupabase.mockReturnValue(sb);

    const result = await fetchGameCover("Unknown");
    expect(result).toEqual({ image: null });
  });

  it("throws when supabase returns a transport error", async () => {
    const transportErr = new Error("network down");
    const sb = makeSupabase(async () => ({ data: null, error: transportErr }));
    mockedGetSupabase.mockReturnValue(sb);

    await expect(fetchGameCover("Anything")).rejects.toThrow("network down");
  });

  it("throws when the function payload contains an error field", async () => {
    const sb = makeSupabase(async () => ({
      data: { error: "rate limited" },
      error: null,
    }));
    mockedGetSupabase.mockReturnValue(sb);

    await expect(fetchGameCover("Anything")).rejects.toThrow("rate limited");
  });
});
