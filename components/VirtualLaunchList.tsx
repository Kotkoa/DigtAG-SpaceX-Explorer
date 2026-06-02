"use client";

import { type FC, useCallback, useEffect, useRef } from "react";
import { List, useDynamicRowHeight } from "react-window";
import type { Launch } from "@/lib/types";
import { LaunchRow, type LaunchRowData } from "./VirtualLaunchRow";

const ESTIMATED_ITEM_HEIGHT = 100;
const SKELETON_COUNT = 3;
const LOAD_MORE_THRESHOLD = 3;
const DEFAULT_LIST_HEIGHT = 500;

interface VirtualLaunchListProps {
  launches: Launch[];
  isFetchingNextPage: boolean;
  listHeight: number;
  hasNextPage: boolean;
  onLoadMore: () => void;
  cacheKey: string;
}

export const VirtualLaunchList: FC<VirtualLaunchListProps> = ({
  launches,
  isFetchingNextPage,
  listHeight,
  hasNextPage,
  onLoadMore,
  cacheKey,
}) => {
  const totalCount = launches.length + (isFetchingNextPage ? SKELETON_COUNT : 0);
  const dynamicRowHeight = useDynamicRowHeight({ defaultRowHeight: ESTIMATED_ITEM_HEIGHT, key: cacheKey });

  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (!isFetchingNextPage) {
      isLoadingRef.current = false;
    }
  }, [isFetchingNextPage]);

  const handleRowsRendered = useCallback(
    (visibleRows: { startIndex: number; stopIndex: number }) => {
      if (
        hasNextPage &&
        !isFetchingNextPage &&
        !isLoadingRef.current &&
        visibleRows.stopIndex >= launches.length - LOAD_MORE_THRESHOLD
      ) {
        isLoadingRef.current = true;
        onLoadMore();
      }
    },
    [hasNextPage, isFetchingNextPage, launches.length, onLoadMore],
  );

  const rowProps: LaunchRowData = {
    launches,
    isFetchingNextPage,
  };

  return (
    <List
      rowComponent={LaunchRow}
      rowCount={totalCount}
      rowHeight={dynamicRowHeight}
      rowProps={rowProps}
      overscanCount={5}
      onRowsRendered={handleRowsRendered}
      style={{ height: listHeight || DEFAULT_LIST_HEIGHT, overflowX: "hidden" }}
    />
  );
};
