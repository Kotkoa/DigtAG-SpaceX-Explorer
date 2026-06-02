import type { Launch } from "./types";

export interface YearlyLaunchData {
  year: string;
  total: number;
  successful: number;
  failed: number;
}

export interface SuccessRateData {
  year: string;
  successRate: number;
  total: number;
}

export function computeYearlyStats(launches: Launch[]): YearlyLaunchData[] {
  const byYear = new Map<string, { total: number; successful: number; failed: number }>();

  for (const launch of launches) {
    const year = new Date(launch.date_utc).getFullYear().toString();
    const existing = byYear.get(year) ?? { total: 0, successful: 0, failed: 0 };
    existing.total += 1;
    if (launch.success === true) existing.successful += 1;
    if (launch.success === false) existing.failed += 1;
    byYear.set(year, existing);
  }

  return Array.from(byYear.entries())
    .sort(([yearA], [yearB]) => Number(yearA) - Number(yearB))
    .map(([year, counts]) => ({ year, ...counts }));
}

export function computeSuccessRateByYear(launches: Launch[]): SuccessRateData[] {
  return computeYearlyStats(launches)
    .filter((entry) => entry.total > 0)
    .map((entry) => ({
      year: entry.year,
      total: entry.total,
      successRate: Math.round((entry.successful / entry.total) * 100),
    }));
}
