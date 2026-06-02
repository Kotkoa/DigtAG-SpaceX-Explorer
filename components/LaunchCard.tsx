"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Launch } from "@/lib/types";
import { SuccessBadge } from "./SuccessBadge";
import { FavoriteButton } from "./FavoriteButton";

interface LaunchCardProps {
  launch: Launch;
}

function formatDate(dateUtc: string): string {
  return new Date(dateUtc).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function LaunchCardComponent({ launch }: LaunchCardProps) {
  return (
    <Link href={`/launches/${launch.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg">
      <article className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all bg-white">
        <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 relative">
          {launch.links.patch.small ? (
            <Image
              src={launch.links.patch.small}
              alt={`${launch.name} mission patch`}
              fill
              className="object-contain"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full" aria-hidden="true">
              <span className="text-2xl">🚀</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base font-semibold text-gray-900 leading-tight">{launch.name}</h2>
            <div className="shrink-0 flex items-center gap-1.5 mt-0.5">
              <SuccessBadge success={launch.success} upcoming={launch.upcoming} />
              <FavoriteButton launchId={launch.id} launchName={launch.name} size="sm" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{formatDate(launch.date_utc)}</p>
          {launch.details && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{launch.details}</p>
          )}
        </div>
      </article>
    </Link>
  );
}

export const LaunchCard = memo(LaunchCardComponent);
