"use client";

import { useCallback, useState } from "react";

const STORAGE_KEY = "spacex-favorites";

function readFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeToStorage(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
  }
}

interface UseFavoritesResult {
  favoriteIds: string[];
  isFavorite: (launchId: string) => boolean;
  toggleFavorite: (launchId: string) => void;
  removeFavorite: (launchId: string) => void;
}

export function useFavorites(): UseFavoritesResult {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(readFromStorage);

  const isFavorite = useCallback(
    (launchId: string): boolean => favoriteIds.includes(launchId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback((launchId: string): void => {
    setFavoriteIds((current) => {
      const updated = current.includes(launchId)
        ? current.filter((id) => id !== launchId)
        : [...current, launchId];
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((launchId: string): void => {
    setFavoriteIds((current) => {
      const updated = current.filter((id) => id !== launchId);
      writeToStorage(updated);
      return updated;
    });
  }, []);

  return { favoriteIds, isFavorite, toggleFavorite, removeFavorite };
}
