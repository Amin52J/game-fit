"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchGameCover } from "../api/cover";
import { readCoverCache, writeCoverCache, normalizeName } from "../model/cover-cache";

export interface UseGameCoverResult {
  image: string | null;
  isLoading: boolean;
  isError: boolean;
}

export function useGameCover(name: string, enabled = true): UseGameCoverResult {
  const trimmed = name.trim();
  const key = normalizeName(trimmed);

  const query = useQuery({
    queryKey: ["sgdb-cover", key],
    enabled: enabled && trimmed.length > 0,
    staleTime: 30 * 24 * 60 * 60 * 1000,
    gcTime: 30 * 24 * 60 * 60 * 1000,
    retry: 1,
    initialData: () => {
      const cached = readCoverCache(trimmed);
      return cached ? { image: cached.image } : undefined;
    },
    queryFn: async () => {
      const cached = readCoverCache(trimmed);
      if (cached) return { image: cached.image };
      const result = await fetchGameCover(trimmed);
      writeCoverCache(trimmed, result.image);
      return result;
    },
  });

  return {
    image: query.data?.image ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
