import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFavorites } from "@/hooks/useFavorites";

const STORAGE_KEY = "spacex-favorites";

function seedStorage(value: unknown): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("useFavorites — initial state", () => {
  it("starts empty when storage is empty", () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favoriteIds).toEqual([]);
  });

  it("loads persisted ids from storage on mount", () => {
    seedStorage(["id-1", "id-2"]);
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favoriteIds).toEqual(["id-1", "id-2"]);
  });

  it("starts empty when storage contains non-array JSON", () => {
    seedStorage({ notAnArray: true });
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favoriteIds).toEqual([]);
  });

  it("filters out non-string entries from corrupted storage", () => {
    seedStorage(["id-1", 42, null, "id-2"]);
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favoriteIds).toEqual(["id-1", "id-2"]);
  });

  it("starts empty when storage contains invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{{not valid json}}");
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favoriteIds).toEqual([]);
  });
});

describe("useFavorites — isFavorite", () => {
  it("returns false for an id not in favorites", () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.isFavorite("missing-id")).toBe(false);
  });

  it("returns true for an id that is in favorites", () => {
    seedStorage(["launch-abc"]);
    const { result } = renderHook(() => useFavorites());
    expect(result.current.isFavorite("launch-abc")).toBe(true);
  });
});

describe("useFavorites — toggleFavorite", () => {
  it("adds an id when not yet favorited", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("launch-1");
    });

    expect(result.current.favoriteIds).toContain("launch-1");
    expect(result.current.isFavorite("launch-1")).toBe(true);
  });

  it("removes an id when already favorited", () => {
    seedStorage(["launch-1"]);
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("launch-1");
    });

    expect(result.current.favoriteIds).not.toContain("launch-1");
    expect(result.current.isFavorite("launch-1")).toBe(false);
  });

  it("does not duplicate id when toggled on twice", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("launch-1");
    });
    act(() => {
      result.current.toggleFavorite("launch-2");
    });

    expect(result.current.favoriteIds).toHaveLength(2);
    expect(new Set(result.current.favoriteIds).size).toBe(result.current.favoriteIds.length);
  });

  it("toggle twice returns to original empty state", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("launch-1");
    });
    act(() => {
      result.current.toggleFavorite("launch-1");
    });

    expect(result.current.favoriteIds).toEqual([]);
    expect(result.current.isFavorite("launch-1")).toBe(false);
  });

  it("persists toggle to localStorage", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("launch-x");
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
    expect(stored).toContain("launch-x");
  });

  it("removes from localStorage when toggled off", () => {
    seedStorage(["launch-x"]);
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("launch-x");
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
    expect(stored).not.toContain("launch-x");
  });
});

describe("useFavorites — removeFavorite", () => {
  it("removes a specific id from favorites", () => {
    seedStorage(["id-1", "id-2", "id-3"]);
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.removeFavorite("id-2");
    });

    expect(result.current.favoriteIds).toEqual(["id-1", "id-3"]);
  });

  it("is a no-op when id is not in favorites", () => {
    seedStorage(["id-1"]);
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.removeFavorite("non-existent");
    });

    expect(result.current.favoriteIds).toEqual(["id-1"]);
  });

  it("persists removal to localStorage", () => {
    seedStorage(["id-1", "id-2"]);
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.removeFavorite("id-1");
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
    expect(stored).toEqual(["id-2"]);
  });
});

describe("useFavorites — persistence across remounts", () => {
  it("retains state after unmount and remount", () => {
    const { result, unmount } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("persistent-id");
    });

    unmount();

    const { result: remounted } = renderHook(() => useFavorites());
    expect(remounted.current.favoriteIds).toContain("persistent-id");
  });
});

describe("useFavorites — localStorage write failure", () => {
  it("keeps in-memory state updated even when localStorage.setItem throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("launch-quota");
    });

    expect(result.current.favoriteIds).toContain("launch-quota");
    expect(result.current.isFavorite("launch-quota")).toBe(true);
  });
});
