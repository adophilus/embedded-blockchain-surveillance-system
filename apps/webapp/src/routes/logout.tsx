import Auth from "@/features/auth";
import Backend from "@/features/backend";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/logout")({
	component: RouteComponent,
	beforeLoad: async () => {
		const res = await Backend.Client.client.request("get", "/auth/logout");

		Auth.Store.logout();

		throw redirect({
			to: "/login",
		});
	},
});

function RouteComponent() {
	return;
}
