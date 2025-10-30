import { ActivityIcon, CameraIcon, ClockIcon } from "lucide-react";
import { Suspense, useState, type FunctionComponent } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { useListSurveillanceSessions } from "./hooks";
import type { SurveillanceSession } from "@/lib/types";
import { SurveillanceEventModal } from "./modal";
import { formatTimestamp } from "@/lib/utils";

const SurveillanceSessionTile: FunctionComponent<{
	session: SurveillanceSession;
	onClick: () => void;
}> = ({ session, onClick }) => {
	const getStatusColor = (status: SurveillanceSession["status"]) => {
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
		<div
			onClick={onClick}
			className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500 transition cursor-pointer group"
		>
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center gap-2">
					<CameraIcon className="w-5 h-5 text-blue-400" />
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
				{session.description}
			</p>

			<div className="space-y-2 text-xs text-slate-500">
				<div className="flex items-center gap-2">
					<ClockIcon className="w-4 h-4" />
					<span>Start: {formatTimestamp(session.start_timestamp)}</span>
				</div>
				<div className="flex items-center gap-2">
					<ClockIcon className="w-4 h-4" />
					<span>End: {formatTimestamp(session.end_timestamp)}</span>
				</div>
			</div>
		</div>
	);
};

export const InnerSurveillanceGallery: FunctionComponent = () => {
	const [selectedSession, setSelectedSession] =
		useState<SurveillanceSession | null>(null);
	const { data } = useListSurveillanceSessions();
	const sessions = data.data.data;

	const closeModal = () => {
		setSelectedSession(null);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-white">Surveillance Sessions</h2>
				<div className="flex items-center gap-2 text-slate-400">
					<ActivityIcon className="w-5 h-5" />
					<span>{sessions.length} Sessions</span>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{sessions.map((session) => (
					<SurveillanceSessionTile
						key={session.id}
						session={session}
						onClick={() => {
							setSelectedSession(session);
						}}
					/>
				))}
			</div>

			{selectedSession && (
				<SurveillanceEventModal
					session={selectedSession}
					onClose={closeModal}
				/>
			)}
		</div>
	);
};

export const SurveillanceGallery: FunctionComponent = () => {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					onReset={reset}
					fallbackRender={({ resetErrorBoundary }) => (
						<div className="flex items-center justify-center min-h-[240px] p-6">
							<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md text-center">
								<h3 className="text-xl font-bold text-white mb-2">
									Unable to load records
								</h3>
								<p className="text-sm text-slate-400 mb-6">
									There was an error loading the surveillance records. You can
									retry or contact an administrator if the problem persists.
								</p>
								<button
									type="button"
									onClick={() => resetErrorBoundary()}
									className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
								>
									Try again
								</button>
							</div>
						</div>
					)}
				>
					<Suspense
						fallback={
							<div className="flex items-center justify-center py-12">
								<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
							</div>
						}
					>
						<InnerSurveillanceGallery />
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
};
