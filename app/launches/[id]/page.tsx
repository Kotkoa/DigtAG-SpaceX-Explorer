import { LaunchDetailView } from "@/components/LaunchDetailView";

export default async function LaunchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LaunchDetailView launchId={id} />;
}
