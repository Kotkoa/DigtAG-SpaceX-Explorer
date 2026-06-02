import { Suspense } from "react";
import { LaunchList } from "@/components/LaunchList";
import { LaunchListSkeleton } from "@/components/LaunchListSkeleton";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Suspense fallback={<LaunchListSkeleton count={8} />}>
        <LaunchList />
      </Suspense>
    </div>
  );
}
