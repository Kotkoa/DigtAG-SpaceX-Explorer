import { Suspense } from "react";
import { LaunchList } from "@/components/LaunchList";
import { LaunchListSkeleton } from "@/components/LaunchListSkeleton";

export default function HomePage() {
  return (
    <Suspense fallback={<LaunchListSkeleton count={8} />}>
      <LaunchList />
    </Suspense>
  );
}
