import { type FC } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: FC<EmptyStateProps> = ({
  title = "No launches found",
  description = "There are no launches matching your criteria.",
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-16 text-center gap-3"
    >
      <span className="text-5xl" aria-hidden="true">🛸</span>
      <p className="text-lg font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-500 max-w-sm">{description}</p>
    </div>
  );
};
