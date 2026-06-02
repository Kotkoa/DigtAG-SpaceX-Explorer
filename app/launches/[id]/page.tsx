import { LaunchDetailView } from "@/components/LaunchDetailView";

export const dynamic = "force-static";
export const dynamicParams = false;

// Next.js 16.2 output:'export' requires at least one entry in generateStaticParams.
// The "_" placeholder satisfies the build check; real IDs are fetched client-side.
export function generateStaticParams(): { id: string }[] {
  return [{ id: "_" }];
}

export default async function LaunchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LaunchDetailView launchId={id} />;
}
