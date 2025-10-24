import type { FunctionComponent, ReactNode } from "react";
import { Header } from "./header";

export const DashboardLayout: FunctionComponent<{ children: ReactNode }> = ({
	children,
}) => (
	<div className="min-h-screen bg-slate-900">
		<Header />
		<main className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-130px)]">
			{children}
		</main>
		<footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-sm text-slate-500">
			&copy; {new Date().getFullYear()} Blockchain Surveillance System. All
			rights reserved.
		</footer>
	</div>
);
