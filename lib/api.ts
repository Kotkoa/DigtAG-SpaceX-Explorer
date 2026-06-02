import type { Launch, Rocket, Launchpad, QueryResponse, LaunchFilters } from "./types";
import { ApiError } from "./api-error";
import { buildLaunchQueryFromFilters, DEFAULT_FILTERS } from "./launch-filters";

const SPACEX_API_BASE = "https://api.spacexdata.com/v4";

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${SPACEX_API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options,
  });

  if (!response.ok) {
    throw new ApiError({
      statusCode: response.status,
      message: `SpaceX API error: ${response.status} ${response.statusText}`,
    });
  }

  return response.json() as Promise<T>;
}

export async function queryLaunches({
  page,
  limit,
  filters = DEFAULT_FILTERS,
}: {
  page: number;
  limit: number;
  filters?: LaunchFilters;
}): Promise<QueryResponse<Launch>> {
  const body = buildLaunchQueryFromFilters({ filters, page, limit });
  return apiFetch<QueryResponse<Launch>>("/launches/query", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getLaunchById(launchId: string): Promise<Launch> {
  return apiFetch<Launch>(`/launches/${launchId}`);
}

export async function getRocketById(rocketId: string): Promise<Rocket> {
  return apiFetch<Rocket>(`/rockets/${rocketId}`);
}

export async function getLaunchpadById(launchpadId: string): Promise<Launchpad> {
  return apiFetch<Launchpad>(`/launchpads/${launchpadId}`);
}

export async function getAllLaunches(): Promise<Launch[]> {
  const response = await apiFetch<QueryResponse<Launch>>("/launches/query", {
    method: "POST",
    body: JSON.stringify({
      query: { upcoming: false },
      options: {
        select: { date_utc: 1, success: 1 },
        limit: 10000,
        sort: { date_utc: 1 },
      },
    }),
  });
  return response.docs;
}
