import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/")({
	beforeLoad: () => {
		throw redirect({
			to: "/dashboard/surveillance",
		});
	},
	component: RouteComponent,
});

function RouteComponent() {
	return null;
}
