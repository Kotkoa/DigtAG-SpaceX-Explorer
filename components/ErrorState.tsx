import { type FC } from "react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: FC<ErrorStateProps> = ({
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center justify-center py-16 text-center gap-4"
    >
      <span className="text-5xl" aria-hidden="true">⚠️</span>
      <p className="text-lg font-medium text-gray-900">Failed to load launches</p>
      <p className="text-sm text-gray-500 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};
