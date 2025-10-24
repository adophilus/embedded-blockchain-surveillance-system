import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_dashboard/dashboard/")({
	component: DashboardOverviewPage,
});

function DashboardOverviewPage() {
	return null;
}
