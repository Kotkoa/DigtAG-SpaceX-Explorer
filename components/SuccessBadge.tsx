"use client";

import { type FC } from "react";

interface SuccessBadgeProps {
  success: boolean | null;
  upcoming: boolean;
}

export const SuccessBadge: FC<SuccessBadgeProps> = ({ success, upcoming }) => {
  if (upcoming) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
        Upcoming
      </span>
    );
  }
  if (success === true) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
        Success
      </span>
    );
  }
  if (success === false) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
        Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
      Unknown
    </span>
  );
};
