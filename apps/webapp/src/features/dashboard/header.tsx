import {
	Camera,
	Shield,
	Users,
	Activity,
	LogOut,
	Upload,
	type LucideIcon,
} from "lucide-react";

import Auth from "@/features/auth";
import { Link } from "@tanstack/react-router";

type Tab = {
	id: string;
	label: string;
	icon: LucideIcon;
	link: string;
};

const tabs: Tab[] = [
	{
		id: "surveillance",
		label: "Surveillance",
		icon: Camera,
		link: "/dashboard/surveillance",
	},
	{
		id: "criminals",
		label: "Criminals",
		icon: Users,
		link: "/dashboard/criminals",
	},
	{ id: "upload", label: "Upload", icon: Upload, link: "/dashboard/upload" },
	{
		id: "metrics",
		label: "Metrics",
		icon: Activity,
		link: "/dashboard/metrics",
	},
];

export const Header = () => {
	const { user } = Auth.Hooks.useAuthenticated();
	const activeTab = "surveillance";

	return (
		<header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="bg-blue-600 p-2 rounded-lg">
						<Shield className="w-6 h-6 text-white" />
					</div>
					<div>
						<h1 className="text-xl font-bold text-white">
							Surveillance System
						</h1>
						<p className="text-xs text-slate-400">
							Blockchain-Powered Security
						</p>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<div className="text-right">
						<p className="text-sm font-medium text-white">{user.full_name}</p>
						<p className="text-xs text-slate-400">{user.role}</p>
					</div>
					<button
						type="button"
						onClick={Auth.Store.logout}
						className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-lg transition"
						title="Logout"
					>
						<LogOut className="w-5 h-5" />
					</button>
				</div>
			</div>

			<nav className="max-w-7xl mx-auto px-4">
				<div className="flex gap-1">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						return (
							<Link
								to={tab.link}
								key={tab.id}
								className="flex items-center gap-2 px-6 py-3 font-medium transition [&.active]:text-blue-400 [&.active]:border-b-2 [&.active]:border-blue-400 text-slate-400 hover:text-slate-300"
							>
								<Icon className="w-4 h-4" />
								{tab.label}
							</Link>
						);
					})}
				</div>
			</nav>
		</header>
	);
};
