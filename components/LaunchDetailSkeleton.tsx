import { type FC } from "react";

export const LaunchDetailSkeleton: FC = () => {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading launch details">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-20 h-20 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2 pt-2">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-5 bg-gray-200 rounded w-20" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-8 bg-gray-200 rounded" />
        ))}
      </div>

      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-32" />
        <div className="h-32 bg-gray-200 rounded-lg" />
      </div>

      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-32" />
        <div className="h-24 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};
