import { describe, it, expect } from "vitest";
import { computeYearlyStats, computeSuccessRateByYear } from "@/lib/stats";
import type { Launch } from "@/lib/types";

function makeLaunch(overrides: Partial<Launch> & { date_utc: string; success: boolean | null }): Launch {
  return {
    id: "test-id",
    name: "Test Launch",
    date_unix: 0,
    date_local: overrides.date_utc,
    date_precision: "hour",
    upcoming: false,
    details: null,
    links: {
      patch: { small: null, large: null },
      reddit: { campaign: null, launch: null, media: null, recovery: null },
      flickr: { small: [], original: [] },
      presskit: null,
      webcast: null,
      youtube_id: null,
      article: null,
      wikipedia: null,
    },
    rocket: "rocket-id",
    launchpad: "pad-id",
    flight_number: 1,
    failures: [],
    cores: [],
    payloads: [],
    capsules: [],
    ships: [],
    crew: [],
    static_fire_date_utc: null,
    static_fire_date_unix: null,
    net: false,
    window: null,
    auto_update: false,
    ...overrides,
  };
}

describe("computeYearlyStats", () => {
  it("returns empty array for no launches", () => {
    expect(computeYearlyStats([])).toEqual([]);
  });

  it("groups launches by year", () => {
    const launches = [
      makeLaunch({ date_utc: "2020-03-01T00:00:00.000Z", success: true }),
      makeLaunch({ date_utc: "2020-09-15T00:00:00.000Z", success: true }),
      makeLaunch({ date_utc: "2021-06-01T00:00:00.000Z", success: true }),
    ];

    const result = computeYearlyStats(launches);
    expect(result).toHaveLength(2);
    expect(result[0].year).toBe("2020");
    expect(result[0].total).toBe(2);
    expect(result[1].year).toBe("2021");
    expect(result[1].total).toBe(1);
  });

  it("counts successful and failed launches separately", () => {
    const launches = [
      makeLaunch({ date_utc: "2022-01-01T00:00:00.000Z", success: true }),
      makeLaunch({ date_utc: "2022-03-01T00:00:00.000Z", success: false }),
      makeLaunch({ date_utc: "2022-06-01T00:00:00.000Z", success: null }),
    ];

    const [year2022] = computeYearlyStats(launches);
    expect(year2022.total).toBe(3);
    expect(year2022.successful).toBe(1);
    expect(year2022.failed).toBe(1);
  });

  it("does not count null success in either bucket", () => {
    const launches = [
      makeLaunch({ date_utc: "2022-01-01T00:00:00.000Z", success: null }),
    ];

    const [year2022] = computeYearlyStats(launches);
    expect(year2022.total).toBe(1);
    expect(year2022.successful).toBe(0);
    expect(year2022.failed).toBe(0);
  });

  it("sorts years in ascending numeric order", () => {
    const launches = [
      makeLaunch({ date_utc: "2021-01-01T00:00:00.000Z", success: true }),
      makeLaunch({ date_utc: "2019-01-01T00:00:00.000Z", success: true }),
      makeLaunch({ date_utc: "2020-01-01T00:00:00.000Z", success: true }),
    ];

    const result = computeYearlyStats(launches);
    expect(result.map((entry) => entry.year)).toEqual(["2019", "2020", "2021"]);
  });
});

describe("computeSuccessRateByYear", () => {
  it("returns empty array for no launches", () => {
    expect(computeSuccessRateByYear([])).toEqual([]);
  });

  it("computes 100% success rate when all launches succeed", () => {
    const launches = [
      makeLaunch({ date_utc: "2022-01-01T00:00:00.000Z", success: true }),
      makeLaunch({ date_utc: "2022-06-01T00:00:00.000Z", success: true }),
    ];

    const [year2022] = computeSuccessRateByYear(launches);
    expect(year2022.successRate).toBe(100);
  });

  it("computes 0% success rate when all launches fail", () => {
    const launches = [
      makeLaunch({ date_utc: "2022-01-01T00:00:00.000Z", success: false }),
      makeLaunch({ date_utc: "2022-06-01T00:00:00.000Z", success: false }),
    ];

    const [year2022] = computeSuccessRateByYear(launches);
    expect(year2022.successRate).toBe(0);
  });

  it("computes 50% success rate for equal success and failure", () => {
    const launches = [
      makeLaunch({ date_utc: "2022-01-01T00:00:00.000Z", success: true }),
      makeLaunch({ date_utc: "2022-06-01T00:00:00.000Z", success: false }),
    ];

    const [year2022] = computeSuccessRateByYear(launches);
    expect(year2022.successRate).toBe(50);
  });

  it("rounds success rate to nearest integer", () => {
    const launches = [
      makeLaunch({ date_utc: "2022-01-01T00:00:00.000Z", success: true }),
      makeLaunch({ date_utc: "2022-02-01T00:00:00.000Z", success: true }),
      makeLaunch({ date_utc: "2022-03-01T00:00:00.000Z", success: false }),
    ];

    const [year2022] = computeSuccessRateByYear(launches);
    expect(year2022.successRate).toBe(67);
  });

  it("includes total in each entry", () => {
    const launches = [
      makeLaunch({ date_utc: "2022-01-01T00:00:00.000Z", success: true }),
      makeLaunch({ date_utc: "2022-06-01T00:00:00.000Z", success: false }),
    ];

    const [year2022] = computeSuccessRateByYear(launches);
    expect(year2022.total).toBe(2);
    expect(year2022.year).toBe("2022");
    expect(year2022.successRate).toBe(50);
  });

  it("computes 0% rate for year where all launches have null success", () => {
    const launches = [
      makeLaunch({ date_utc: "2022-01-01T00:00:00.000Z", success: null }),
      makeLaunch({ date_utc: "2022-06-01T00:00:00.000Z", success: null }),
    ];

    const [year2022] = computeSuccessRateByYear(launches);
    expect(year2022.successRate).toBe(0);
    expect(year2022.total).toBe(2);
  });
});
