import { type FC } from "react";

interface RelatedEntitySkeletonProps {
  label: string;
}

export const RelatedEntitySkeleton: FC<RelatedEntitySkeletonProps> = ({ label }) => {
  return (
    <div
      className="rounded-lg border border-gray-200 p-4 animate-pulse space-y-3"
      aria-busy="true"
      aria-label={`Loading ${label}`}
    >
      <div className="h-5 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
    </div>
  );
};
