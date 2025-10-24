import { createFileRoute } from "@tanstack/react-router";
import {
	Camera,
	Users,
	Activity,
	AlertCircle,
	CheckCircle,
	BarChart,
	HardHat,
} from "lucide-react";

export const Route = createFileRoute("/_dashboard/dashboard/metrics")({
	component: MetricsDashboardPage,
});

const MetricsOverview = () => {
	const metrics = [
		{
			title: "Total Surveillance Sessions",
			value: "45",
			icon: Camera,
			color: "text-blue-400",
			bg: "bg-blue-900/50",
		},
		{
			title: "Criminal Records on Chain",
			value: "8,421",
			icon: Users,
			color: "text-red-400",
			bg: "bg-red-900/50",
		},
		{
			title: "Detection Alerts (Past 24h)",
			value: "128",
			icon: AlertCircle,
			color: "text-yellow-400",
			bg: "bg-yellow-900/50",
		},
		{
			title: "Successful IPFS Uploads",
			value: "99.8%",
			icon: CheckCircle,
			color: "text-green-400",
			bg: "bg-green-900/50",
		},
	];

	return (
		<div className="space-y-8">
			<div className="flex items-center gap-3">
				<BarChart className="w-8 h-8 text-blue-400" />
				<h2 className="text-2xl font-bold text-white">
					System Metrics & Analytics
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{metrics.map((metric, index) => {
					const Icon = metric.icon;
					return (
						<div
							key={index}
							className={`p-6 rounded-xl border border-slate-800 ${metric.bg}`}
						>
							<div className="flex items-center justify-between mb-3">
								<p className="text-sm font-medium text-slate-300">
									{metric.title}
								</p>
								<Icon className={`w-5 h-5 ${metric.color}`} />
							</div>
							<p className="text-4xl font-extrabold text-white">
								{metric.value}
							</p>
						</div>
					);
				})}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
					<h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
						<Activity className="w-5 h-5 text-blue-400" />
						Detection Trend (Last 7 Days)
					</h3>
					<div className="h-64 flex items-center justify-center bg-slate-800 rounded-lg text-slate-500">
						[Placeholder for Chart Library - e.g., Recharts Bar Chart]
					</div>
				</div>

				<div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
					<h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
						<HardHat className="w-5 h-5 text-red-400" />
						Top 5 Offenses
					</h3>
					<ul className="space-y-3">
						{[
							"Bank Robbery",
							"Assault",
							"Racketeering",
							"Vandalism",
							"Homicide",
						].map((offense, index) => (
							<li
								key={offense}
								className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
							>
								<span className="text-slate-300">
									{index + 1}. {offense}
								</span>
								<span className="text-sm font-bold text-red-400">
									{Math.floor(Math.random() * 50 + 10)} Incidents
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

function MetricsDashboardPage() {
	return <MetricsOverview />;
}
