import { SearchIcon, UsersIcon } from "lucide-react";
import { useListCriminals } from "./hooks";
import { Suspense, useState, type FunctionComponent } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import type { CriminalProfile } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";

type CriminalDetailModalProps = {
	criminalProfile: CriminalProfile;
	onClose: () => void;
};

const CriminalDetailModal: FunctionComponent<CriminalDetailModalProps> = ({
	criminalProfile,
	onClose,
}) => {
	return (
		<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
			<div className="bg-slate-900 rounded-xl max-w-2xl w-full">
				<div className="p-6 border-b border-slate-800 flex items-center justify-between">
					<h3 className="text-2xl font-bold text-white">Criminal Profile</h3>
					<button
						type="button"
						onClick={onClose}
						className="text-slate-400 hover:text-white transition text-2xl w-8 h-8 flex items-center justify-center"
					>
						✕
					</button>
				</div>

				<div className="p-6">
					<div className="flex gap-6">
						{criminalProfile.mugshot?.url ? (
							<img
								src={criminalProfile.mugshot.url}
								alt={criminalProfile.name}
								className="w-48 h-48 object-cover rounded-lg"
							/>
						) : (
							<div className="w-48 h-48 bg-slate-800 rounded-lg flex items-center justify-center">
								<UsersIcon className="w-16 h-16 text-slate-600" />
							</div>
						)}

						<div className="flex-1 space-y-4">
							<div>
								<span className="text-sm text-slate-400">Name</span>
								<p className="text-xl font-bold text-white">
									{criminalProfile.name}
								</p>
							</div>

							{criminalProfile.aliases?.length > 0 && (
								<div>
									<span className="text-sm text-slate-400">Known Aliases</span>
									<p className="text-white">
										{criminalProfile.aliases.length > 0
											? criminalProfile.aliases.join(", ")
											: "nil"}
									</p>
								</div>
							)}

							{criminalProfile.offenses && (
								<div>
									<span className="text-sm text-slate-400">Offense</span>
									<p className="text-white">
										{criminalProfile.offenses.length > 0
											? criminalProfile.offenses.join(", ")
											: "nil"}
									</p>
								</div>
							)}

							<div>
								<span className="text-sm text-slate-400">Record Created</span>
								<p className="text-white">
									{formatTimestamp(criminalProfile.created_at)}
								</p>
							</div>

							{criminalProfile.mugshot?.id && (
								<div>
									<p className="text-blue-400 text-sm break-all">
										<a
											target="_blank"
											rel="noreferrer noopener"
											href={criminalProfile.mugshot.url}
										>
											{criminalProfile.mugshot.id}
										</a>
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

type CriminalsListProps = {
	criminalProfiles: CriminalProfile[];
	viewCriminal: (id: string) => void;
};

const CriminalsList: FunctionComponent<CriminalsListProps> = ({
	criminalProfiles,
	viewCriminal,
}) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{criminalProfiles.map((criminal) => (
				<div
					key={criminal.id}
					onClick={() => viewCriminal(criminal.id)}
					className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-red-500 transition cursor-pointer group"
				>
					{criminal.mugshot?.url ? (
						<img
							src={criminal.mugshot.url}
							alt={criminal.name}
							className="w-full h-48 object-cover"
						/>
					) : (
						<div className="w-full h-48 bg-slate-800 flex items-center justify-center">
							<UsersIcon className="w-12 h-12 text-slate-600" />
						</div>
					)}

					<div className="p-4">
						<h3 className="text-lg font-semibold text-white mb-1 group-hover:text-red-400 transition">
							{criminal.name}
						</h3>
						{criminal.aliases.length > 0 && (
							<p className="text-sm text-slate-400 mb-2">
								AKA: {criminal.aliases.join(", ")}
							</p>
						)}
						{criminal.offenses.length > 0 && (
							<p className="text-xs text-slate-500 line-clamp-2">
								{criminal.offenses.join(", ")}
							</p>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export const InnerCriminalsGallery = () => {
	const [selectedCriminalProfile, setSelectedCriminal] =
		useState<CriminalProfile | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	const { data } = useListCriminals();
	const criminalProfiles = data.data.data;
	console.log(criminalProfiles);

	// filter criminalProfiles by searchQuery (case-insensitive, matches name, aliases or offense)
	const filteredCriminalProfiles = (criminalProfiles ?? []).filter(
		(criminal) => {
			const q = (searchQuery ?? "").trim().toLowerCase();
			if (!q) return true;
			if (criminal.name.toLowerCase().includes(q)) return true;
			if (criminal.aliases.some((alias) => alias.toLowerCase().includes(q)))
				return true;
			if (
				criminal.offenses.some((offense) => offense.toLowerCase().includes(q))
			)
				return true;
			return false;
		},
	);

	const viewCriminal = async (criminalId: string) => {
		const criminal = criminalProfiles.find((c) => c.id === criminalId);
		if (criminal) {
			setSelectedCriminal(criminal);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-white">Criminal Database</h2>
				<div className="flex items-center gap-2 text-slate-400">
					<UsersIcon className="w-5 h-5" />
					<span>{criminalProfiles.length} Records</span>
				</div>
			</div>

			<div className="relative">
				<SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search by name or alias..."
					className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			{criminalProfiles.length === 0 ? (
				<div className="text-center py-12 text-slate-400">
					No criminal records found
				</div>
			) : (
				<CriminalsList
					criminalProfiles={filteredCriminalProfiles}
					viewCriminal={viewCriminal}
				/>
			)}

			{selectedCriminalProfile && (
				<CriminalDetailModal
					criminalProfile={selectedCriminalProfile}
					onClose={() => setSelectedCriminal(null)}
				/>
			)}
		</div>
	);
};

export const CriminalsGallery = () => {
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
						fallback={
							<div className="flex items-center justify-center py-12">
								<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
							</div>
						}
					>
						<InnerCriminalsGallery />
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
};
