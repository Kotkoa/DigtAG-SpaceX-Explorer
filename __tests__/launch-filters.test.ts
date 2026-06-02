import { describe, it, expect } from "vitest";
import {
  buildLaunchQueryFromFilters,
  parseFiltersFromParams,
  buildParamsFromFilters,
  isDefaultFilters,
  DEFAULT_FILTERS,
} from "@/lib/launch-filters";
import type { LaunchFilters } from "@/lib/types";

const defaultFilters: LaunchFilters = { ...DEFAULT_FILTERS };

describe("buildLaunchQueryFromFilters", () => {
  it("returns empty query for default filters", () => {
    const { query, options } = buildLaunchQueryFromFilters({
      filters: defaultFilters,
      page: 1,
      limit: 10,
    });

    expect(query).toEqual({});
    expect(options.offset).toBe(0);
    expect(options.limit).toBe(10);
    expect(options.sort).toEqual({ date_utc: -1 });
  });

  it("sets upcoming=true for status=upcoming", () => {
    const { query } = buildLaunchQueryFromFilters({
      filters: { ...defaultFilters, status: "upcoming" },
      page: 1,
      limit: 10,
    });

    expect(query["upcoming"]).toBe(true);
  });

  it("sets upcoming=false for status=past", () => {
    const { query } = buildLaunchQueryFromFilters({
      filters: { ...defaultFilters, status: "past" },
      page: 1,
      limit: 10,
    });

    expect(query["upcoming"]).toBe(false);
  });

  it("sets success=true for outcome=success", () => {
    const { query } = buildLaunchQueryFromFilters({
      filters: { ...defaultFilters, outcome: "success" },
      page: 1,
      limit: 10,
    });

    expect(query["success"]).toBe(true);
  });

  it("sets success=false for outcome=failure", () => {
    const { query } = buildLaunchQueryFromFilters({
      filters: { ...defaultFilters, outcome: "failure" },
      page: 1,
      limit: 10,
    });

    expect(query["success"]).toBe(false);
  });

  it("builds $gte date range when only dateFrom is set", () => {
    const { query } = buildLaunchQueryFromFilters({
      filters: { ...defaultFilters, dateFrom: "2022-01-01" },
      page: 1,
      limit: 10,
    });

    const dateRange = query["date_utc"] as Record<string, string>;
    expect(dateRange["$gte"]).toBe("2022-01-01T00:00:00.000Z");
    expect(dateRange["$lte"]).toBeUndefined();
  });

  it("builds $lte date range when only dateTo is set", () => {
    const { query } = buildLaunchQueryFromFilters({
      filters: { ...defaultFilters, dateTo: "2022-12-31" },
      page: 1,
      limit: 10,
    });

    const dateRange = query["date_utc"] as Record<string, string>;
    expect(dateRange["$lte"]).toBe("2022-12-31T23:59:59.999Z");
    expect(dateRange["$gte"]).toBeUndefined();
  });

  it("builds $gte and $lte when both dates are set", () => {
    const { query } = buildLaunchQueryFromFilters({
      filters: { ...defaultFilters, dateFrom: "2022-01-01", dateTo: "2022-12-31" },
      page: 1,
      limit: 10,
    });

    const dateRange = query["date_utc"] as Record<string, string>;
    expect(dateRange["$gte"]).toBe("2022-01-01T00:00:00.000Z");
    expect(dateRange["$lte"]).toBe("2022-12-31T23:59:59.999Z");
  });

  it("builds regex query for search term", () => {
    const { query } = buildLaunchQueryFromFilters({
      filters: { ...defaultFilters, search: "Falcon" },
      page: 1,
      limit: 10,
    });

    expect(query["name"]).toEqual({ $regex: "Falcon", $options: "i" });
  });

  it("escapes regex special characters in search", () => {
    const { query } = buildLaunchQueryFromFilters({
      filters: { ...defaultFilters, search: "Falcon 9 (v1.0)" },
      page: 1,
      limit: 10,
    });

    const nameQuery = query["name"] as { $regex: string; $options: string };
    expect(nameQuery.$regex).toBe("Falcon 9 \\(v1\\.0\\)");
    expect(nameQuery.$options).toBe("i");
  });

  it("ignores whitespace-only search", () => {
    const { query } = buildLaunchQueryFromFilters({
      filters: { ...defaultFilters, search: "   " },
      page: 1,
      limit: 10,
    });

    expect(query["name"]).toBeUndefined();
  });

  it("sorts ascending when sortDirection=asc", () => {
    const { options } = buildLaunchQueryFromFilters({
      filters: { ...defaultFilters, sortDirection: "asc" },
      page: 1,
      limit: 10,
    });

    expect(options.sort).toEqual({ date_utc: 1 });
  });

  it("sorts by name field when sortField=name", () => {
    const { options } = buildLaunchQueryFromFilters({
      filters: { ...defaultFilters, sortField: "name" },
      page: 1,
      limit: 10,
    });

    expect(options.sort).toEqual({ name: -1 });
  });

  it("calculates correct offset for page 3", () => {
    const { options } = buildLaunchQueryFromFilters({
      filters: defaultFilters,
      page: 3,
      limit: 20,
    });

    expect(options.offset).toBe(40);
    expect(options.limit).toBe(20);
  });
});

describe("parseFiltersFromParams", () => {
  it("returns default filters for empty params", () => {
    const filters = parseFiltersFromParams(new URLSearchParams());
    expect(filters).toEqual(defaultFilters);
  });

  it("parses status=upcoming", () => {
    const filters = parseFiltersFromParams(new URLSearchParams("status=upcoming"));
    expect(filters.status).toBe("upcoming");
  });

  it("ignores unknown status value", () => {
    const filters = parseFiltersFromParams(new URLSearchParams("status=unknown"));
    expect(filters.status).toBe("all");
  });

  it("parses outcome=success", () => {
    const filters = parseFiltersFromParams(new URLSearchParams("outcome=success"));
    expect(filters.outcome).toBe("success");
  });

  it("parses outcome=failure", () => {
    const filters = parseFiltersFromParams(new URLSearchParams("outcome=failure"));
    expect(filters.outcome).toBe("failure");
  });

  it("parses sortField and sortDirection", () => {
    const filters = parseFiltersFromParams(new URLSearchParams("sortField=name&sortDirection=asc"));
    expect(filters.sortField).toBe("name");
    expect(filters.sortDirection).toBe("asc");
  });

  it("ignores unknown sortField", () => {
    const filters = parseFiltersFromParams(new URLSearchParams("sortField=invalid"));
    expect(filters.sortField).toBe("date_utc");
  });

  it("parses search param", () => {
    const filters = parseFiltersFromParams(new URLSearchParams("search=Falcon"));
    expect(filters.search).toBe("Falcon");
  });

  it("parses dateFrom param", () => {
    const filters = parseFiltersFromParams(new URLSearchParams("dateFrom=2022-01-01"));
    expect(filters.dateFrom).toBe("2022-01-01");
  });

  it("parses dateTo param", () => {
    const filters = parseFiltersFromParams(new URLSearchParams("dateTo=2022-12-31"));
    expect(filters.dateTo).toBe("2022-12-31");
  });
});

describe("buildParamsFromFilters", () => {
  it("returns empty params for default filters", () => {
    const params = buildParamsFromFilters(defaultFilters);
    expect(params.toString()).toBe("");
  });

  it("sets status param when not default", () => {
    const params = buildParamsFromFilters({ ...defaultFilters, status: "past" });
    expect(params.get("status")).toBe("past");
  });

  it("does not set status param when all (default)", () => {
    const params = buildParamsFromFilters({ ...defaultFilters, status: "all" });
    expect(params.get("status")).toBeNull();
  });

  it("round-trips filters through params", () => {
    const original: LaunchFilters = {
      status: "past",
      outcome: "success",
      dateFrom: "2022-01-01",
      dateTo: "2022-12-31",
      search: "Falcon",
      sortField: "name",
      sortDirection: "asc",
    };

    const params = buildParamsFromFilters(original);
    const parsed = parseFiltersFromParams(params);
    expect(parsed).toEqual(original);
  });

  it("round-trips non-default sortField with default sortDirection", () => {
    const filters: LaunchFilters = {
      ...defaultFilters,
      sortField: "name",
      sortDirection: "desc",
    };

    const params = buildParamsFromFilters(filters);
    const parsed = parseFiltersFromParams(params);
    expect(parsed.sortField).toBe("name");
    expect(parsed.sortDirection).toBe("desc");
  });
});

describe("isDefaultFilters", () => {
  it("returns true for default filters", () => {
    expect(isDefaultFilters(defaultFilters)).toBe(true);
  });

  it("returns false when status differs", () => {
    expect(isDefaultFilters({ ...defaultFilters, status: "past" })).toBe(false);
  });

  it("returns false when outcome differs", () => {
    expect(isDefaultFilters({ ...defaultFilters, outcome: "success" })).toBe(false);
  });

  it("returns false when search differs", () => {
    expect(isDefaultFilters({ ...defaultFilters, search: "x" })).toBe(false);
  });

  it("returns false when dateFrom is set", () => {
    expect(isDefaultFilters({ ...defaultFilters, dateFrom: "2022-01-01" })).toBe(false);
  });

  it("returns false when dateTo is set", () => {
    expect(isDefaultFilters({ ...defaultFilters, dateTo: "2022-12-31" })).toBe(false);
  });
});
