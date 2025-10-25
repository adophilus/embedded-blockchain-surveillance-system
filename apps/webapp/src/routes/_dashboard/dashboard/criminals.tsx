import { createFileRoute } from "@tanstack/react-router";
import { CriminalsGallery } from "@/features/criminal/gallery";

export const Route = createFileRoute("/_dashboard/dashboard/criminals")({
	component: CriminalsDashboardPage,
});

function CriminalsDashboardPage() {
	return <CriminalsGallery />;
}
