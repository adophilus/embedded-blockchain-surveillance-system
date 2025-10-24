import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackDevtools } from "@tanstack/react-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import TanStackRouterDevtools from "../integrations/tanstack-router/devtools";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
}

const Devtools = () => {
	if (import.meta.env.PROD) return null;

	return (
		<TanStackDevtools
			config={{
				position: "bottom-right",
			}}
			plugins={[
				TanStackRouterDevtools,
				TanStackQueryDevtools,
			]}
		/>
	);
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => (
		<>
			<div className="min-h-screen bg-background">
				<Outlet />
			</div>
			<Devtools />
		</>
	),
});
