import { type FC } from "react";
import type { Launchpad } from "@/lib/types";

interface LaunchpadCardProps {
  launchpad: Launchpad;
}

export const LaunchpadCard: FC<LaunchpadCardProps> = ({ launchpad }) => {
  const successRate =
    launchpad.launch_attempts > 0
      ? Math.round((launchpad.launch_successes / launchpad.launch_attempts) * 100)
      : null;

  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-3 bg-white">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{launchpad.full_name}</h3>
          <p className="text-sm text-gray-500">
            {launchpad.locality}, {launchpad.region}
          </p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
            launchpad.status === "active"
              ? "bg-green-100 text-green-700"
              : launchpad.status === "retired"
                ? "bg-gray-100 text-gray-600"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {launchpad.status}
        </span>
      </div>

      {launchpad.details && (
        <p className="text-sm text-gray-600 line-clamp-3">{launchpad.details}</p>
      )}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-gray-500">Attempts</dt>
          <dd className="font-medium text-gray-900">{launchpad.launch_attempts}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Successes</dt>
          <dd className="font-medium text-gray-900">{launchpad.launch_successes}</dd>
        </div>
        {successRate !== null && (
          <div>
            <dt className="text-gray-500">Success rate</dt>
            <dd className="font-medium text-gray-900">{successRate}%</dd>
          </div>
        )}
        <div>
          <dt className="text-gray-500">Timezone</dt>
          <dd className="font-medium text-gray-900">{launchpad.timezone}</dd>
        </div>
      </dl>
    </div>
  );
};
