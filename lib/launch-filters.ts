import type { LaunchFilters, QueryOptions } from "./types";

export const DEFAULT_FILTERS: LaunchFilters = {
  status: "all",
  outcome: "all",
  dateFrom: "",
  dateTo: "",
  search: "",
  sortField: "date_utc",
  sortDirection: "desc",
};

export function parseFiltersFromParams(params: URLSearchParams): LaunchFilters {
  const status = params.get("status");
  const outcome = params.get("outcome");
  const sortField = params.get("sortField");
  const sortDirection = params.get("sortDirection");

  return {
    status:
      status === "upcoming" || status === "past" ? status : DEFAULT_FILTERS.status,
    outcome:
      outcome === "success" || outcome === "failure" ? outcome : DEFAULT_FILTERS.outcome,
    dateFrom: params.get("dateFrom") ?? DEFAULT_FILTERS.dateFrom,
    dateTo: params.get("dateTo") ?? DEFAULT_FILTERS.dateTo,
    search: params.get("search") ?? DEFAULT_FILTERS.search,
    sortField:
      sortField === "date_utc" || sortField === "name"
        ? sortField
        : DEFAULT_FILTERS.sortField,
    sortDirection:
      sortDirection === "asc" || sortDirection === "desc"
        ? sortDirection
        : DEFAULT_FILTERS.sortDirection,
  };
}

export function buildParamsFromFilters(filters: LaunchFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.status !== DEFAULT_FILTERS.status) {
    params.set("status", filters.status);
  }
  if (filters.outcome !== DEFAULT_FILTERS.outcome) {
    params.set("outcome", filters.outcome);
  }
  if (filters.dateFrom) {
    params.set("dateFrom", filters.dateFrom);
  }
  if (filters.dateTo) {
    params.set("dateTo", filters.dateTo);
  }
  if (filters.search) {
    params.set("search", filters.search);
  }
  if (filters.sortField !== DEFAULT_FILTERS.sortField) {
    params.set("sortField", filters.sortField);
  }
  if (filters.sortDirection !== DEFAULT_FILTERS.sortDirection) {
    params.set("sortDirection", filters.sortDirection);
  }

  return params;
}

export function buildLaunchQueryFromFilters({
  filters,
  page,
  limit,
}: {
  filters: LaunchFilters;
  page: number;
  limit: number;
}): {
  query: Record<string, unknown>;
  options: QueryOptions;
} {
  const query: Record<string, unknown> = {};

  if (filters.status === "upcoming") {
    query["upcoming"] = true;
  } else if (filters.status === "past") {
    query["upcoming"] = false;
  }

  if (filters.outcome === "success") {
    query["success"] = true;
  } else if (filters.outcome === "failure") {
    query["success"] = false;
  }

  if (filters.dateFrom || filters.dateTo) {
    const dateRange: Record<string, string> = {};
    if (filters.dateFrom) {
      dateRange["$gte"] = new Date(filters.dateFrom).toISOString();
    }
    if (filters.dateTo) {
      dateRange["$lte"] = new Date(filters.dateTo + "T23:59:59.999Z").toISOString();
    }
    query["date_utc"] = dateRange;
  }

  if (filters.search.trim()) {
    const escapedSearch = filters.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query["name"] = { $regex: escapedSearch, $options: "i" };
  }

  const sortDirection = filters.sortDirection === "asc" ? 1 : -1;
  const sort: Record<string, 1 | -1> = {
    [filters.sortField]: sortDirection,
  };

  return {
    query,
    options: {
      limit,
      offset: (page - 1) * limit,
      sort,
    },
  };
}

export function isDefaultFilters(filters: LaunchFilters): boolean {
  return (
    filters.status === DEFAULT_FILTERS.status &&
    filters.outcome === DEFAULT_FILTERS.outcome &&
    filters.dateFrom === DEFAULT_FILTERS.dateFrom &&
    filters.dateTo === DEFAULT_FILTERS.dateTo &&
    filters.search === DEFAULT_FILTERS.search &&
    filters.sortField === DEFAULT_FILTERS.sortField &&
    filters.sortDirection === DEFAULT_FILTERS.sortDirection
  );
}

