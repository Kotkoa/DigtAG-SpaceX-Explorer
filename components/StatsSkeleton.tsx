import { type FC } from "react";

export const StatsSkeleton: FC = () => (
  <div className="flex flex-col gap-10" aria-busy="true" aria-label="Loading statistics">
    {["launches-per-year", "success-rate"].map((chartKey) => (
      <div key={chartKey} className="flex flex-col gap-4">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-72 sm:h-80 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    ))}
  </div>
);
