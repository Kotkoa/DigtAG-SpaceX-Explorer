"use client";

import { type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getLaunchById, getRocketById, getLaunchpadById } from "@/lib/api";
import { SuccessBadge } from "./SuccessBadge";
import { FavoriteButton } from "./FavoriteButton";
import { RocketCard } from "./RocketCard";
import { LaunchpadCard } from "./LaunchpadCard";
import { FlickrGallery } from "./FlickrGallery";
import { ErrorState } from "./ErrorState";
import { LaunchDetailSkeleton } from "./LaunchDetailSkeleton";
import { RelatedEntitySection } from "./RelatedEntitySection";
import { RelatedEntitySkeleton } from "./RelatedEntitySkeleton";

interface LaunchDetailViewProps {
  launchId: string;
}

function formatDate({ dateUtc, precision }: { dateUtc: string; precision: string }): string {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", timeZone: "UTC" };
  if (precision === "month" || precision === "day" || precision === "hour") {
    options.month = "long";
  }
  if (precision === "day" || precision === "hour") {
    options.day = "numeric";
  }
  if (precision === "hour") {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.timeZoneName = "short";
  }
  return new Date(dateUtc).toLocaleDateString("en-US", options);
}

export const LaunchDetailView: FC<LaunchDetailViewProps> = ({ launchId }) => {
  const launchQuery = useQuery({
    queryKey: ["launch", launchId],
    queryFn: () => getLaunchById(launchId),
  });

  const rocketQuery = useQuery({
    queryKey: ["rocket", launchQuery.data?.rocket],
    queryFn: () => getRocketById(launchQuery.data!.rocket),
    enabled: !!launchQuery.data?.rocket,
  });

  const launchpadQuery = useQuery({
    queryKey: ["launchpad", launchQuery.data?.launchpad],
    queryFn: () => getLaunchpadById(launchQuery.data!.launchpad),
    enabled: !!launchQuery.data?.launchpad,
  });

  if (launchQuery.isPending) {
    return <LaunchDetailSkeleton />;
  }

  if (launchQuery.isError) {
    return (
      <ErrorState
        message={launchQuery.error.message}
        onRetry={() => launchQuery.refetch()}
      />
    );
  }

  const launch = launchQuery.data;
  const flickrImages =
    launch.links.flickr.original.length > 0
      ? launch.links.flickr.original
      : launch.links.flickr.small;

  const externalLinks = [
    { label: "Webcast", href: launch.links.webcast },
    { label: "Article", href: launch.links.article },
    { label: "Wikipedia", href: launch.links.wikipedia },
    { label: "Press Kit", href: launch.links.presskit },
    { label: "Reddit Campaign", href: launch.links.reddit.campaign },
    { label: "Reddit Launch", href: launch.links.reddit.launch },
  ].filter((link): link is { label: string; href: string } => link.href !== null && link.href !== "");

  return (
    <article className="space-y-8" aria-label={`Launch details: ${launch.name}`}>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded transition-colors"
      >
        ← Back to launches
      </Link>

      <header className="flex items-start gap-5">
        <div className="shrink-0 w-20 h-20 relative">
          {(launch.links.patch.large || launch.links.patch.small) ? (
            <Image
              src={(launch.links.patch.large || launch.links.patch.small)!}
              alt={`${launch.name} mission patch`}
              fill
              className="object-contain"
              sizes="80px"
              priority
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full"
              aria-hidden="true"
            >
              <span className="text-4xl">🚀</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{launch.name}</h1>
          <p className="text-sm text-gray-500">
            Flight #{launch.flight_number} ·{" "}
            {formatDate({ dateUtc: launch.date_utc, precision: launch.date_precision })}
          </p>
          <div className="pt-1 flex items-center gap-2">
            <SuccessBadge success={launch.success} upcoming={launch.upcoming} />
            <FavoriteButton launchId={launch.id} launchName={launch.name} />
          </div>
        </div>
      </header>

      {launch.details && (
        <section aria-labelledby="section-about">
          <h2 id="section-about" className="text-lg font-semibold text-gray-900 mb-2">
            About
          </h2>
          <p className="text-gray-700 leading-relaxed">{launch.details}</p>
        </section>
      )}

      {launch.failures.length > 0 && (
        <section aria-labelledby="section-failures">
          <h2 id="section-failures" className="text-lg font-semibold text-gray-900 mb-2">
            Failure Details
          </h2>
          <ul className="space-y-2">
            {launch.failures.map((failure) => (
              <li
                key={failure.time}
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
              >
                <span className="font-medium">T+{failure.time}s</span>
                {failure.altitude !== null && (
                  <span className="ml-2 text-red-600">at {failure.altitude} km</span>
                )}
                <span className="ml-2">{failure.reason}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {externalLinks.length > 0 && (
        <section aria-labelledby="section-links">
          <h2 id="section-links" className="text-lg font-semibold text-gray-900 mb-3">
            Links
          </h2>
          <div className="flex flex-wrap gap-2">
            {externalLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 transition-colors"
              >
                {label} ↗
              </a>
            ))}
          </div>
        </section>
      )}

      <RelatedEntitySection title="Rocket">
        {rocketQuery.isPending ? (
          <RelatedEntitySkeleton label="rocket information" />
        ) : rocketQuery.isError ? (
          <ErrorState
            message={rocketQuery.error.message}
            onRetry={() => rocketQuery.refetch()}
          />
        ) : (
          <RocketCard rocket={rocketQuery.data} />
        )}
      </RelatedEntitySection>

      <RelatedEntitySection title="Launchpad">
        {launchpadQuery.isPending ? (
          <RelatedEntitySkeleton label="launchpad information" />
        ) : launchpadQuery.isError ? (
          <ErrorState
            message={launchpadQuery.error.message}
            onRetry={() => launchpadQuery.refetch()}
          />
        ) : (
          <LaunchpadCard launchpad={launchpadQuery.data} />
        )}
      </RelatedEntitySection>

      <section aria-labelledby="section-photos">
        <h2 id="section-photos" className="text-lg font-semibold text-gray-900 mb-3">
          Photos
        </h2>
        <FlickrGallery images={flickrImages} launchName={launch.name} />
      </section>
    </article>
  );
};
