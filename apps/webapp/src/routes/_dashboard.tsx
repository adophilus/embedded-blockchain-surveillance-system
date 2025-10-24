import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Auth from "@/features/auth";
import { DashboardLayout } from "@/features/dashboard/layout";

export const Route = createFileRoute("/_dashboard")({
	beforeLoad: () => {
		const authState = Auth.Store.store.state;

		if (authState.status !== "authenticated") {
			throw redirect({
				to: "/login",
			});
		}

		if (authState.user.role !== "ADMIN") {
			throw redirect({
				to: "/",
			});
		}
	},
	component: DashboardLayoutPage,
});

function DashboardLayoutPage() {
	return (
		<DashboardLayout>
			<Outlet />
		</DashboardLayout>
	);
}
