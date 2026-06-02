"use client";

import { type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllLaunches } from "@/lib/api";
import { computeYearlyStats, computeSuccessRateByYear } from "@/lib/stats";
import { LaunchesPerYearChart } from "./LaunchesPerYearChart";
import { SuccessRateChart } from "./SuccessRateChart";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import { StatsSkeleton } from "./StatsSkeleton";

export const StatsView: FC = () => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["launches", "all-for-stats"],
    queryFn: getAllLaunches,
    staleTime: 10 * 60 * 1000,
  });

  if (isPending) {
    return <StatsSkeleton />;
  }

  if (isError) {
    return <ErrorState message={error.message} onRetry={() => void refetch()} />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No data available"
        description="No launch data is available to generate statistics."
      />
    );
  }

  const yearlyData = computeYearlyStats(data);
  const successRateData = computeSuccessRateByYear(data);

  return (
    <div className="flex flex-col gap-10">
      <LaunchesPerYearChart data={yearlyData} />
      <SuccessRateChart data={successRateData} />
    </div>
  );
};
