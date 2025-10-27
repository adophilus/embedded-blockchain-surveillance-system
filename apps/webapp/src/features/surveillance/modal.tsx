import { Suspense, type FunctionComponent, type ReactNode } from "react";
import type { SurveillanceEvent, SurveillanceSession } from "@/lib/types";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { useListSurveillanceEvents } from "./hooks";
import { formatTimestamp } from "@/lib/utils";

type SurveillanceEventModalLayoutProps = SurveillanceEventModalProps & {
	children: ReactNode;
};

type SurveillanceEventModalFallbackLayoutProps = Pick<
	SurveillanceEventModalProps,
	"onClose"
> & {
	children: ReactNode;
};

const SurveillanceEventModalFallbackLayout: FunctionComponent<
	SurveillanceEventModalFallbackLayoutProps
> = ({ onClose, children }) => (
	<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
		<div className="bg-slate-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
			<div className="p-6 border-b border-slate-800 flex items-center justify-between">
				<div>
					<h3 className="text-2xl font-bold text-white">...</h3>
					<p className="text-slate-400">...</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="text-slate-400 hover:text-white transition text-2xl w-8 h-8 flex items-center justify-center"
				>
					✕
				</button>
			</div>

			<div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
				{children}
			</div>
		</div>
	</div>
);
const SurveillanceEventModalLayout: FunctionComponent<
	SurveillanceEventModalLayoutProps
> = ({ session, onClose, children }) => (
	<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
		<div className="bg-slate-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
			<div className="p-6 border-b border-slate-800 flex items-center justify-between">
				<div>
					<h3 className="text-2xl font-bold text-white">{session.title}</h3>
					<p className="text-slate-400">{session.description}</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="text-slate-400 hover:text-white transition text-2xl w-8 h-8 flex items-center justify-center"
				>
					✕
				</button>
			</div>

			<div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
				{children}
			</div>
		</div>
	</div>
);

type SurveillanceEventModalFallbackProps = {
	onClose: () => void;
};

const SurveillanceEventModalFallback: FunctionComponent<
	SurveillanceEventModalFallbackProps
> = ({ onClose }) => (
	<SurveillanceEventModalFallbackLayout onClose={onClose}>
		<div className="flex items-center justify-center py-12">
			<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
		</div>
	</SurveillanceEventModalFallbackLayout>
);

const SurveillanceEventTile: FunctionComponent<{
	event: SurveillanceEvent;
}> = ({ event }) => (
	<div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
		<img
			src={event.media.url}
			alt="Surveillance capture"
			className="w-full h-48 object-cover"
		/>

		<div className="p-4">
			<div className="flex items-center justify-between mb-2">
				<span className="text-xs text-slate-500">
					Device: {event.device_id}
				</span>
				{event.detections.length > 0 ? (
					<span className="flex items-center gap-1 text-xs font-semibold text-red-400">
						<AlertCircleIcon className="w-3 h-3" />
						Detected
					</span>
				) : (
					<span className="flex items-center gap-1 text-xs text-green-400">
						<CheckCircleIcon className="w-3 h-3" />
						Clear
					</span>
				)}
			</div>
			<p className="text-xs text-slate-400">
				{formatTimestamp(event.created_at)}
			</p>
			<p className="text-xs text-blue-400 mt-2 truncate">{event.media.id}</p>
		</div>
	</div>
);

type SurveillanceEventModalProps = {
	session: SurveillanceSession;
	onClose: () => void;
};

const InnerSurveillanceEventModal: FunctionComponent<
	SurveillanceEventModalProps
> = ({ session, onClose }) => {
	const { data } = useListSurveillanceEvents(session.id);
	const events = data.data.data;

	return (
		<SurveillanceEventModalLayout session={session} onClose={onClose}>
			{events.length === 0 ? (
				<div className="text-center py-12 text-slate-400">
					No events recorded for this session
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{events.map((event) => (
						<SurveillanceEventTile key={event.id} event={event} />
					))}
				</div>
			)}
		</SurveillanceEventModalLayout>
	);
};

export const SurveillanceEventModal: FunctionComponent<
	SurveillanceEventModalProps
> = ({ session: surveillanceSession, onClose }) => {
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
									There was an error loading the criminal records. You can retry
									or contact an administrator if the problem persists.
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
						fallback={<SurveillanceEventModalFallback onClose={onClose} />}
					>
						<InnerSurveillanceEventModal
							session={surveillanceSession}
							onClose={onClose}
						/>
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
};
