"use client";

import { type FC } from "react";
import { useQueries } from "@tanstack/react-query";
import { getLaunchById } from "@/lib/api";
import { useFavoritesContext } from "./FavoritesContext";
import { LaunchCard } from "./LaunchCard";
import { LaunchCardSkeleton } from "./LaunchCardSkeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";

export const FavoritesView: FC = () => {
  const { favoriteIds } = useFavoritesContext();

  const launchQueries = useQueries({
    queries: favoriteIds.map((launchId) => ({
      queryKey: ["launch", launchId],
      queryFn: () => getLaunchById(launchId),
    })),
  });

  const erroredQueries = launchQueries.filter((query) => query.isError);

  return (
    <section aria-label="Favorite launches">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Favorites
          {favoriteIds.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              {favoriteIds.length} saved
            </span>
          )}
        </h1>
      </div>

      {favoriteIds.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          description="Bookmark launches by clicking the ★ icon on any launch card."
        />
      ) : (
        <>
          {erroredQueries.length > 0 && (
            <div className="mb-4" aria-live="polite">
              <ErrorState
                message={`Failed to load ${erroredQueries.length} favorite${erroredQueries.length > 1 ? "s" : ""}.`}
                onRetry={() => erroredQueries.forEach((query) => query.refetch())}
              />
            </div>
          )}
          <ul className="space-y-3">
            {favoriteIds.map((launchId, queryIndex) => {
              const query = launchQueries[queryIndex];
              if (!query || query.isPending) {
                return (
                  <li key={launchId}>
                    <LaunchCardSkeleton />
                  </li>
                );
              }
              if (query.isError) return null;
              return (
                <li key={launchId}>
                  <LaunchCard launch={query.data} />
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
};
