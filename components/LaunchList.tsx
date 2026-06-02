"use client";

import { type FC } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryLaunches } from "@/lib/api";
import { parseFiltersFromParams } from "@/lib/launch-filters";
import { LaunchCard } from "./LaunchCard";
import { LaunchListSkeleton } from "./LaunchListSkeleton";
import { LaunchCardSkeleton } from "./LaunchCardSkeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LaunchFiltersPanel } from "./LaunchFilters";

const PAGE_LIMIT = 20;
const SKELETON_NEXT_PAGE_COUNT = 3;

export const LaunchList: FC = () => {
  const searchParams = useSearchParams();
  const filters = parseFiltersFromParams(searchParams);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["launches", filters],
    queryFn: ({ pageParam }) =>
      queryLaunches({ page: pageParam, limit: PAGE_LIMIT, filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
  });

  const allLaunches = data?.pages.flatMap((page) => page.docs) ?? [];

  return (
    <section aria-label="SpaceX launches">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Launches
          {data && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              {data.pages[0]?.totalDocs ?? 0} total
            </span>
          )}
        </h1>
      </div>

      <LaunchFiltersPanel filters={filters} />

      {isPending ? (
        <LaunchListSkeleton count={8} />
      ) : isError ? (
        <ErrorState message={error.message} onRetry={() => refetch()} />
      ) : allLaunches.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ul className="space-y-3 list-none" role="list" aria-label="Launch list">
            {allLaunches.map((launch) => (
              <li key={launch.id}>
                <LaunchCard launch={launch} />
              </li>
            ))}
            {isFetchingNextPage &&
              Array.from({ length: SKELETON_NEXT_PAGE_COUNT }, (_unused, skeletonIndex) => (
                <li key={`skeleton-${skeletonIndex}`} aria-hidden="true">
                  <LaunchCardSkeleton />
                </li>
              ))}
          </ul>
          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                type="button"
                className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 transition-colors"
                aria-label="Load more launches"
              >
                {isFetchingNextPage ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
          {!hasNextPage && allLaunches.length > 0 && (
            <p className="mt-8 text-center text-sm text-gray-400" aria-live="polite">
              All {data.pages[0]?.totalDocs ?? allLaunches.length} launches loaded
            </p>
          )}
        </>
      )}
    </section>
  );
};
