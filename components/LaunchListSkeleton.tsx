import { type FC } from "react";
import { LaunchCardSkeleton } from "./LaunchCardSkeleton";

interface LaunchListSkeletonProps {
  count?: number;
}

export const LaunchListSkeleton: FC<LaunchListSkeletonProps> = ({ count = 8 }) => {
  return (
    <div
      className="space-y-3"
      role="status"
      aria-label="Loading launches"
      aria-live="polite"
    >
      {Array.from({ length: count }, (_, skeletonIndex) => (
        <LaunchCardSkeleton key={skeletonIndex} />
      ))}
      <span className="sr-only">Loading launches, please wait...</span>
    </div>
  );
};
