"use client";

import { type ReactElement } from "react";
import type { RowComponentProps } from "react-window";
import type { Launch } from "@/lib/types";
import { LaunchCard } from "./LaunchCard";
import { LaunchCardSkeleton } from "./LaunchCardSkeleton";

export interface LaunchRowData {
  launches: Launch[];
  isFetchingNextPage: boolean;
}

type LaunchRowProps = RowComponentProps<LaunchRowData>;

export function LaunchRow({
  index,
  style,
  ariaAttributes,
  launches,
  isFetchingNextPage,
}: LaunchRowProps): ReactElement {
  const isSkeletonRow = index >= launches.length;
  const isSkeleton = isSkeletonRow && isFetchingNextPage;

  return (
    <div style={style} {...ariaAttributes}>
      <div className="pb-3">
        {isSkeleton ? (
          <LaunchCardSkeleton />
        ) : (
          launches[index] && <LaunchCard launch={launches[index]} />
        )}
      </div>
    </div>
  );
}
