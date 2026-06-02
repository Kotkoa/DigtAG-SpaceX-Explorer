import { StatsView } from "@/components/StatsView";

export default function StatsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Launch Statistics</h1>
      <StatsView />
    </div>
  );
}
