export interface LaunchLinks {
  patch: {
    small: string | null;
    large: string | null;
  };
  reddit: {
    campaign: string | null;
    launch: string | null;
    media: string | null;
    recovery: string | null;
  };
  flickr: {
    small: string[];
    original: string[];
  };
  presskit: string | null;
  webcast: string | null;
  youtube_id: string | null;
  article: string | null;
  wikipedia: string | null;
}

export interface LaunchFailure {
  time: number;
  altitude: number | null;
  reason: string;
}

export interface LaunchCore {
  core: string | null;
  flight: number | null;
  gridfins: boolean | null;
  legs: boolean | null;
  reused: boolean | null;
  landing_attempt: boolean | null;
  landing_success: boolean | null;
  landing_type: string | null;
  landpad: string | null;
}

export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  date_unix: number;
  date_local: string;
  date_precision: "half" | "quarter" | "year" | "month" | "day" | "hour";
  upcoming: boolean;
  success: boolean | null;
  details: string | null;
  links: LaunchLinks;
  rocket: string;
  launchpad: string;
  flight_number: number;
  failures: LaunchFailure[];
  cores: LaunchCore[];
  payloads: string[];
  capsules: string[];
  ships: string[];
  crew: string[];
  static_fire_date_utc: string | null;
  static_fire_date_unix: number | null;
  net: boolean;
  window: number | null;
  auto_update: boolean;
}

export interface Rocket {
  id: string;
  name: string;
  type: string;
  description: string;
  height: { meters: number | null; feet: number | null };
  diameter: { meters: number | null; feet: number | null };
  mass: { kg: number | null; lb: number | null };
  active: boolean;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  flickr_images: string[];
  wikipedia: string;
}

export interface Launchpad {
  id: string;
  name: string;
  full_name: string;
  locality: string;
  region: string;
  timezone: string;
  latitude: number;
  longitude: number;
  launch_attempts: number;
  launch_successes: number;
  status: string;
  details: string;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  sort?: Record<string, 1 | -1>;
}

export interface QueryResponse<T> {
  docs: T[];
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
