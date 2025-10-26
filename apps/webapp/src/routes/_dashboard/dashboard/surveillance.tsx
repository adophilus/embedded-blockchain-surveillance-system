import { createFileRoute } from "@tanstack/react-router";
import { SurveillanceGallery } from "@/features/surveillance/gallery";

export const Route = createFileRoute("/_dashboard/dashboard/surveillance")({
	component: SurveillanceDashboardPage,
});

function SurveillanceDashboardPage() {
	return <SurveillanceGallery />;
}
