import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
	Camera,
	Shield,
	Users,
	Activity,
	LogOut,
	Upload,
	Eye,
	Search,
	Filter,
	AlertCircle,
	CheckCircle,
	Clock,
	Database,
	BarChart,
	HardHat,
} from "lucide-react";
import { Header } from "@/features/dashboard/header";

export const Route = createFileRoute("/_dashboard/dashboard/surveillance")({
	component: SurveillanceDashboardPage,
});

const formatDateTime = (timestamp) => {
	if (!timestamp) return "N/A";
	// Check if timestamp is in seconds (common for Unix epoch)
	const date = new Date(
		timestamp.toString().length === 10 ? timestamp * 1000 : timestamp,
	);
	return date.toLocaleString();
};

// ============================================================================
// HEADER COMPONENT
// ============================================================================

// ============================================================================
// SESSION EVENT MODAL COMPONENT
// ============================================================================

const SessionEventModal = ({
	selectedSession,
	events,
	loadingEvents,
	onClose,
}) => {
	if (!selectedSession) return null;

	return (
		<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
			<div className="bg-slate-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
				<div className="p-6 border-b border-slate-800 flex items-center justify-between">
					<div>
						<h3 className="text-2xl font-bold text-white">
							{selectedSession.title}
						</h3>
						<p className="text-slate-400">{selectedSession.description}</p>
					</div>
					<button
						onClick={onClose}
						className="text-slate-400 hover:text-white transition text-2xl w-8 h-8 flex items-center justify-center"
					>
						✕
					</button>
				</div>

				<div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
					{loadingEvents ? (
						<div className="flex items-center justify-center py-12">
							<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
						</div>
					) : events.length === 0 ? (
						<div className="text-center py-12 text-slate-400">
							No events recorded for this session
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{events.map((event) => (
								<div
									key={event.id}
									className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700"
								>
									{event.ipfs_url ? (
										<img
											src={event.ipfs_url}
											alt="Surveillance capture"
											className="w-full h-48 object-cover"
										/>
									) : (
										<div className="w-full h-48 bg-slate-700 flex items-center justify-center">
											<Camera className="w-12 h-12 text-slate-600" />
										</div>
									)}

									<div className="p-4">
										<div className="flex items-center justify-between mb-2">
											<span className="text-xs text-slate-500">
												Device: {event.device_id}
											</span>
											{event.detected ? (
												<span className="flex items-center gap-1 text-xs font-semibold text-red-400">
													<AlertCircle className="w-3 h-3" />
													Detected
												</span>
											) : (
												<span className="flex items-center gap-1 text-xs text-green-400">
													<CheckCircle className="w-3 h-3" />
													Clear
												</span>
											)}
										</div>
										<p className="text-xs text-slate-400">
											{formatDateTime(event.timestamp)}
										</p>
										{event.ipfs_cid && (
											<p
												className="text-xs text-blue-400 mt-2 truncate"
												title={event.ipfs_cid}
											>
												IPFS: {event.ipfs_cid}
											</p>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

// ============================================================================
// SURVEILLANCE TAB COMPONENT
// ============================================================================

const SurveillanceTab = ({ sessions }) => {
	const [events, setEvents] = useState([]);
	const [loadingEvents, setLoadingEvents] = useState(false);
	const [selectedSession, setSelectedSession] = useState(null);

	const loadSessionEvents = async (sessionId, session) => {
		setLoadingEvents(true);
		setSelectedSession(session);
		try {
			// MOCK API Call for demo
			const mockEvents = [
				{
					id: 1,
					device_id: "CAM-A1",
					timestamp: Date.now() / 1000 - 3600,
					detected: false,
					ipfs_cid: "QmHash123",
					ipfs_url: "https://via.placeholder.com/300x200?text=Clear+Event",
				},
				{
					id: 2,
					device_id: "CAM-B2",
					timestamp: Date.now() / 1000 - 1800,
					detected: true,
					ipfs_cid: "QmHash456",
					ipfs_url:
						"https://via.placeholder.com/300x200/ff0000/ffffff?text=ALERT%3A+Detection",
				},
				{
					id: 3,
					device_id: "CAM-C3",
					timestamp: Date.now() / 1000 - 600,
					detected: false,
					ipfs_cid: "QmHash789",
					ipfs_url: "https://via.placeholder.com/300x200?text=Clear+Event",
				},
			].filter(() => Math.random() > 0.3); // Randomly show events

			await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

			// const response = await apiCall(`/surveillance/${sessionId}`);
			// setEvents(response.data.events);
			setEvents(mockEvents);
		} catch (err) {
			console.error("Error loading session events:", err);
			setEvents([]);
		} finally {
			setLoadingEvents(false);
		}
	};

	const closeModal = () => {
		setSelectedSession(null);
		setEvents([]);
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "ACTIVE":
				return "bg-green-500";
			case "COMPLETED":
				return "bg-blue-500";
			case "UPCOMING":
				return "bg-yellow-500";
			default:
				return "bg-slate-500";
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-white">Surveillance Sessions</h2>
				<div className="flex items-center gap-2 text-slate-400">
					<Activity className="w-5 h-5" />
					<span>{sessions.length} Sessions</span>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{sessions.map((session) => (
					<div
						key={session.id}
						onClick={() => loadSessionEvents(session.id, session)}
						className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500 transition cursor-pointer group"
					>
						<div className="flex items-start justify-between mb-4">
							<div className="flex items-center gap-2">
								<Camera className="w-5 h-5 text-blue-400" />
								<span
									className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)} text-white`}
								>
									{session.status}
								</span>
							</div>
						</div>

						<h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition">
							{session.title}
						</h3>
						<p className="text-sm text-slate-400 mb-4 line-clamp-2">
							{session.description || "No description provided"}
						</p>

						<div className="space-y-2 text-xs text-slate-500">
							<div className="flex items-center gap-2">
								<Clock className="w-4 h-4" />
								<span>Start: {formatDateTime(session.start_timestamp)}</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="w-4 h-4" />
								<span>End: {formatDateTime(session.end_timestamp)}</span>
							</div>
						</div>
					</div>
				))}
			</div>

			<SessionEventModal
				selectedSession={selectedSession}
				events={events}
				loadingEvents={loadingEvents}
				onClose={closeModal}
			/>
		</div>
	);
};

function SurveillanceDashboardPage() {
	const mockSessions = [
		{
			id: "sess-101",
			title: "Downtown Patrol - Sector 4",
			description:
				"Routine surveillance focusing on known organized crime areas.",
			status: "ACTIVE",
			start_timestamp: Date.now() / 1000 - 3600 * 2,
			end_timestamp: Date.now() / 1000 + 3600 * 10,
		},
		{
			id: "sess-102",
			title: "Bank District Monitoring",
			description: "High-security monitoring following recent robbery attempt.",
			status: "COMPLETED",
			start_timestamp: Date.now() / 1000 - 3600 * 48,
			end_timestamp: Date.now() / 1000 - 3600 * 24,
		},
		{
			id: "sess-103",
			title: "Industrial Zone Check",
			description: "Scheduled deep-scan for infrastructure security.",
			status: "UPCOMING",
			start_timestamp: Date.now() / 1000 + 3600 * 72,
			end_timestamp: Date.now() / 1000 + 3600 * 96,
		},
	];

	return <SurveillanceTab sessions={mockSessions} />;
}
