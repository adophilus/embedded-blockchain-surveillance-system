import Auth from "@/features/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/logout")({
	component: RouteComponent,
	beforeLoad: async (routeContext) => {
	    const 
		Auth.Store.logout();

		throw redirect({
			to: "/login",
		});
	},
});

function RouteComponent() {
	return;
}
