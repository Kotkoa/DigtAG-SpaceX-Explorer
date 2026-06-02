"use client";

import { type FC } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryLaunches } from "@/lib/api";
import { LaunchCard } from "./LaunchCard";

const PAGE_LIMIT = 20;

export const LaunchList: FC = () => {
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
    queryKey: ["launches"],
    queryFn: ({ pageParam }) =>
      queryLaunches({ page: pageParam, limit: PAGE_LIMIT }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
  });

  if (isPending) {
    return (
      <div className="space-y-3" aria-label="Loading launches">
        {Array.from({ length: 8 }, (_, skeletonIndex) => (
          <div
            key={skeletonIndex}
            className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 animate-pulse"
            aria-hidden="true"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center py-16 text-center gap-4"
      >
        <span className="text-5xl" aria-hidden="true">⚠️</span>
        <p className="text-lg font-medium text-gray-900">Failed to load launches</p>
        <p className="text-sm text-gray-500 max-w-sm">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const allLaunches = data.pages.flatMap((page) => page.docs);

  if (allLaunches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
        <span className="text-5xl" aria-hidden="true">🛸</span>
        <p className="text-lg font-medium text-gray-900">No launches found</p>
        <p className="text-sm text-gray-500">There are no launches to display.</p>
      </div>
    );
  }

  return (
    <section aria-label="SpaceX launches">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Launches
          <span className="ml-2 text-sm font-normal text-gray-500">
            {data.pages[0]?.totalDocs ?? 0} total
          </span>
        </h1>
      </div>
      <ol className="space-y-3 list-none" role="list" aria-label="Launch list">
        {allLaunches.map((launch) => (
          <li key={launch.id}>
            <LaunchCard launch={launch} />
          </li>
        ))}
      </ol>
      {hasNextPage && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 transition-colors"
            aria-label="Load more launches"
          >
            {isFetchingNextPage ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
      {!hasNextPage && allLaunches.length > 0 && (
        <p className="mt-8 text-center text-sm text-gray-400">
          All {data.pages[0]?.totalDocs ?? allLaunches.length} launches loaded
        </p>
      )}
    </section>
  );
};
