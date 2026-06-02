import { type FC } from "react";

export const LaunchCardSkeleton: FC = () => {
  return (
    <div
      className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 animate-pulse"
      aria-hidden="true"
    >
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
      </div>
    </div>
  );
};
