import { type FC } from "react";
import type { Rocket } from "@/lib/types";

interface RocketCardProps {
  rocket: Rocket;
}

export const RocketCard: FC<RocketCardProps> = ({ rocket }) => {
  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-3 bg-white">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{rocket.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{rocket.type}</p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            rocket.active
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {rocket.active ? "Active" : "Retired"}
        </span>
      </div>

      {rocket.description && (
        <p className="text-sm text-gray-600 line-clamp-3">{rocket.description}</p>
      )}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-gray-500">First flight</dt>
          <dd className="font-medium text-gray-900">{rocket.first_flight}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Success rate</dt>
          <dd className="font-medium text-gray-900">{rocket.success_rate_pct}%</dd>
        </div>
        {rocket.height.meters !== null && (
          <div>
            <dt className="text-gray-500">Height</dt>
            <dd className="font-medium text-gray-900">{rocket.height.meters} m</dd>
          </div>
        )}
        {rocket.mass.kg !== null && (
          <div>
            <dt className="text-gray-500">Mass</dt>
            <dd className="font-medium text-gray-900">{(rocket.mass.kg / 1000).toFixed(1)} t</dd>
          </div>
        )}
      </dl>

      {rocket.wikipedia && (
        <a
          href={rocket.wikipedia}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          Wikipedia →
        </a>
      )}
    </div>
  );
};
