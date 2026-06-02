"use client";

import { type FC, useCallback, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryLaunches } from "@/lib/api";
import { parseFiltersFromParams } from "@/lib/launch-filters";
import { LaunchListSkeleton } from "./LaunchListSkeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LaunchFiltersPanel } from "./LaunchFilters";
import { VirtualLaunchList } from "./VirtualLaunchList";

const PAGE_LIMIT = 20;

export const LaunchList: FC = () => {
  const searchParams = useSearchParams();
  const filters = parseFiltersFromParams(searchParams);
  const filterCacheKey = useMemo(() => JSON.stringify(filters), [filters]);

  const [listHeight, setListHeight] = useState(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const listContainerRef = useCallback((container: HTMLDivElement | null) => {
    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = null;
    if (!container) return;
    const updateHeight = () => {
      const top = container.getBoundingClientRect().top;
      setListHeight(window.innerHeight - top);
    };
    const observer = new ResizeObserver(updateHeight);
    observer.observe(document.documentElement);
    resizeObserverRef.current = observer;
    updateHeight();
  }, []);

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

  const allLaunches = useMemo(
    () => data?.pages.flatMap((page) => page.docs) ?? [],
    [data],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className="flex flex-col" aria-label="SpaceX launches">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">
          Launches
          {data && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              {data.pages[0]?.totalDocs ?? 0} total
            </span>
          )}
        </h1>
      </div>

      <div className="shrink-0">
        <LaunchFiltersPanel filters={filters} />
      </div>

      {isPending ? (
        <LaunchListSkeleton count={8} />
      ) : isError ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : allLaunches.length === 0 ? (
        <EmptyState />
      ) : (
        <div ref={listContainerRef}>
          <VirtualLaunchList
            launches={allLaunches}
            isFetchingNextPage={isFetchingNextPage}
            listHeight={listHeight}
            hasNextPage={!!hasNextPage}
            onLoadMore={handleLoadMore}
            cacheKey={filterCacheKey}
          />
          {!hasNextPage && (
            <p className="mt-4 text-center text-sm text-gray-400" aria-live="polite">
              All {data.pages[0]?.totalDocs ?? allLaunches.length} launches loaded
            </p>
          )}
        </div>
      )}
    </section>
  );
};
