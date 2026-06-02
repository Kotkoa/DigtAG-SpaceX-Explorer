"use client";

import { createContext, type FC, type ReactNode, useContext } from "react";
import { useFavorites } from "@/hooks/useFavorites";

interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (launchId: string) => boolean;
  toggleFavorite: (launchId: string) => void;
  removeFavorite: (launchId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: FC<FavoritesProviderProps> = ({ children }) => {
  const favorites = useFavorites();
  return (
    <FavoritesContext.Provider value={favorites}>
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavoritesContext(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavoritesContext must be used within FavoritesProvider");
  }
  return context;
}
