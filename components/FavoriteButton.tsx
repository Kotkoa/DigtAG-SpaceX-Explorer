"use client";

import { type FC } from "react";
import { useFavoritesContext } from "./FavoritesContext";

interface FavoriteButtonProps {
  launchId: string;
  launchName: string;
  size?: "sm" | "md";
}

export const FavoriteButton: FC<FavoriteButtonProps> = ({
  launchId,
  launchName,
  size = "md",
}) => {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const favorited = isFavorite(launchId);

  const sizeClasses = size === "sm"
    ? "w-7 h-7 text-base"
    : "w-9 h-9 text-lg";

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(launchId);
      }}
      aria-label={favorited ? `Remove ${launchName} from favorites` : `Add ${launchName} to favorites`}
      aria-pressed={favorited}
      className={`${sizeClasses} inline-flex items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
        favorited
          ? "border-yellow-300 bg-yellow-50 text-yellow-500 hover:bg-yellow-100"
          : "border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-yellow-400"
      }`}
    >
      <span aria-hidden="true">{favorited ? "★" : "☆"}</span>
    </button>
  );
};
