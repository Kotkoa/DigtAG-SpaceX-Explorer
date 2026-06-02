"use client";

import { type FC, useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { LaunchFilters, LaunchStatus, LaunchOutcome, SortField, SortDirection } from "@/lib/types";
import { buildParamsFromFilters, isDefaultFilters } from "@/lib/launch-filters";

interface LaunchFiltersProps {
  filters: LaunchFilters;
}

const DEBOUNCE_MS = 400;

export const LaunchFiltersPanel: FC<LaunchFiltersProps> = ({ filters }) => {
  const router = useRouter();
  const pathname = usePathname();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    if (searchInputRef.current && searchInputRef.current.value !== filters.search) {
      searchInputRef.current.value = filters.search;
    }
  }, [filters.search]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const pushFilters = useCallback(
    (updated: LaunchFilters) => {
      const params = buildParamsFromFilters(updated);
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        debounceTimer.current = null;
        pushFilters({ ...filtersRef.current, search: value });
      }, DEBOUNCE_MS);
    },
    [pushFilters],
  );

  const handleReset = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    if (searchInputRef.current) searchInputRef.current.value = "";
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const hasActiveFilters = !isDefaultFilters(filters);

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex-1">
          <label htmlFor="launch-search" className="block text-xs font-medium text-gray-600 mb-1">
            Search
          </label>
          <input
            id="launch-search"
            ref={searchInputRef}
            type="search"
            defaultValue={filters.search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Mission name…"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            aria-label="Search by mission name"
          />
        </div>

        <fieldset className="min-w-0">
          <legend className="block text-xs font-medium text-gray-600 mb-1">Status</legend>
          <div className="flex gap-1">
            {(["all", "upcoming", "past"] as LaunchStatus[]).map((statusOption) => (
              <button
                key={statusOption}
                type="button"
                onClick={() => pushFilters({ ...filters, status: statusOption })}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1 ${
                  filters.status === statusOption
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
                aria-pressed={filters.status === statusOption}
              >
                {statusOption === "all" ? "All" : statusOption === "upcoming" ? "Upcoming" : "Past"}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="block text-xs font-medium text-gray-600 mb-1">Outcome</legend>
          <div className="flex gap-1">
            {(["all", "success", "failure"] as LaunchOutcome[]).map((outcomeOption) => (
              <button
                key={outcomeOption}
                type="button"
                onClick={() => pushFilters({ ...filters, outcome: outcomeOption })}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1 ${
                  filters.outcome === outcomeOption
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
                aria-pressed={filters.outcome === outcomeOption}
              >
                {outcomeOption === "all" ? "All" : outcomeOption === "success" ? "Success" : "Failure"}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex gap-3 flex-1">
          <div className="flex-1">
            <label htmlFor="date-from" className="block text-xs font-medium text-gray-600 mb-1">
              Date from
            </label>
            <input
              id="date-from"
              type="date"
              value={filters.dateFrom}
              onChange={(event) => pushFilters({ ...filters, dateFrom: event.target.value })}
              max={filters.dateTo || undefined}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              aria-label="Filter from date"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="date-to" className="block text-xs font-medium text-gray-600 mb-1">
              Date to
            </label>
            <input
              id="date-to"
              type="date"
              value={filters.dateTo}
              onChange={(event) => pushFilters({ ...filters, dateTo: event.target.value })}
              min={filters.dateFrom || undefined}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              aria-label="Filter to date"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <div>
            <label htmlFor="sort-field" className="block text-xs font-medium text-gray-600 mb-1">
              Sort by
            </label>
            <select
              id="sort-field"
              value={filters.sortField}
              onChange={(event) => pushFilters({ ...filters, sortField: event.target.value as SortField })}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              aria-label="Sort field"
            >
              <option value="date_utc">Date</option>
              <option value="name">Name</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort-direction" className="block text-xs font-medium text-gray-600 mb-1">
              Order
            </label>
            <select
              id="sort-direction"
              value={filters.sortDirection}
              onChange={(event) => pushFilters({ ...filters, sortDirection: event.target.value as SortDirection })}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              aria-label="Sort direction"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1 whitespace-nowrap"
              aria-label="Reset all filters"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
