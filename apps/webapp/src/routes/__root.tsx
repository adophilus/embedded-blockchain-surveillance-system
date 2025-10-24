import { Provider } from "@/components/provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";

const RootLayout = () => (
	<Provider>
		<Outlet />
		<TanStackRouterDevtools position="bottom-right" />
		<Toaster />
	</Provider>
);

export const Route = createRootRoute({ component: RootLayout });
