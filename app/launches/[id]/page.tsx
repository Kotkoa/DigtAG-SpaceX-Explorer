import { LaunchDetailView } from "@/components/LaunchDetailView";

export const dynamic = "force-static";

export function generateStaticParams(): { id: string }[] {
  return [];
}

export default async function LaunchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LaunchDetailView launchId={id} />;
}
