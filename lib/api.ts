import type { Launch, Rocket, Launchpad, QueryResponse, QueryOptions } from "./types";
import { ApiError } from "./api-error";

const SPACEX_API_BASE = "https://api.spacexdata.com/v4";

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${SPACEX_API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `SpaceX API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

interface LaunchQueryBody {
  query: Record<string, unknown>;
  options: QueryOptions & { select?: Record<string, number> };
}

export function buildLaunchQuery({
  page,
  limit,
  sort,
}: {
  page: number;
  limit: number;
  sort?: QueryOptions["sort"];
}): LaunchQueryBody {
  return {
    query: {},
    options: {
      limit,
      offset: (page - 1) * limit,
      sort: sort ?? { date_utc: -1 },
    },
  };
}

export async function queryLaunches({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<QueryResponse<Launch>> {
  const body = buildLaunchQuery({ page, limit });
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
