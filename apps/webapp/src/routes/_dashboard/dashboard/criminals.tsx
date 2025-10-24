import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Users, Search } from "lucide-react";

export const Route = createFileRoute("/_dashboard/dashboard/criminals")({
	component: CriminalsDashboardPage,
});

// ============================================================================
// API CONFIGURATION & UTILITIES
// ============================================================================

const API_BASE_URL = "https://api.surveillance-system.com"; // Replace with your actual API URL

const formatDateTime = (timestamp) => {
	if (!timestamp) return "N/A";
	// Check if timestamp is in seconds (common for Unix epoch)
	const date = new Date(
		timestamp.toString().length === 10 ? timestamp * 1000 : timestamp,
	);
	return date.toLocaleString();
};

// ============================================================================
// CRIMINAL DETAIL MODAL COMPONENT
// ============================================================================

const CriminalDetailModal = ({ criminal, onClose }) => {
	if (!criminal) return null;

	return (
		<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
			<div className="bg-slate-900 rounded-xl max-w-2xl w-full">
				<div className="p-6 border-b border-slate-800 flex items-center justify-between">
					<h3 className="text-2xl font-bold text-white">Criminal Profile</h3>
					<button
						onClick={onClose}
						className="text-slate-400 hover:text-white transition text-2xl w-8 h-8 flex items-center justify-center"
					>
						✕
					</button>
				</div>

				<div className="p-6">
					<div className="flex gap-6">
						{criminal.mugshot?.url ? (
							<img
								src={criminal.mugshot.url}
								alt={criminal.name}
								className="w-48 h-48 object-cover rounded-lg"
							/>
						) : (
							<div className="w-48 h-48 bg-slate-800 rounded-lg flex items-center justify-center">
								<Users className="w-16 h-16 text-slate-600" />
							</div>
						)}

						<div className="flex-1 space-y-4">
							<div>
								<label className="text-sm text-slate-400">Name</label>
								<p className="text-xl font-bold text-white">{criminal.name}</p>
							</div>

							{criminal.aliases?.length > 0 && (
								<div>
									<label className="text-sm text-slate-400">
										Known Aliases
									</label>
									<p className="text-white">{criminal.aliases.join(", ")}</p>
								</div>
							)}

							{criminal.offense && (
								<div>
									<label className="text-sm text-slate-400">Offense</label>
									<p className="text-white">{criminal.offense}</p>
								</div>
							)}

							<div>
								<label className="text-sm text-slate-400">Record Created</label>
								<p className="text-white">
									{formatDateTime(criminal.created_at)}
								</p>
							</div>

							{criminal.mugshot?.id && (
								<div>
									<label className="text-sm text-slate-400">IPFS Hash</label>
									<p className="text-blue-400 text-sm break-all">
										{criminal.mugshot.id}
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

// ============================================================================
// CRIMINALS TAB COMPONENT
// ============================================================================

const CriminalsTab = ({ criminals, setCriminals }) => {
	const [loading, setLoading] = useState(true);
	const [selectedCriminal, setSelectedCriminal] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");

	// MOCK DATA for criminals
	const mockCriminalsData = [
		{
			id: "crim-1",
			name: "Al Capone",
			aliases: ["Scarface"],
			offense: "Racketeering, Tax Evasion",
			created_at: Date.now() / 1000 - 86400 * 5,
			mugshot: {
				id: "QmCaponeIPFS",
				url: "https://via.placeholder.com/192x192/8b0000/ffffff?text=Al+Capone",
			},
		},
		{
			id: "crim-2",
			name: "Bonnie Parker",
			aliases: ["Bonniewho"],
			offense: "Bank Robbery, Murder",
			created_at: Date.now() / 1000 - 86400 * 10,
			mugshot: {
				id: "QmBonnieIPFS",
				url: "https://via.placeholder.com/192x192/8b0000/ffffff?text=Bonnie+Parker",
			},
		},
		{
			id: "crim-3",
			name: "John Dillinger",
			aliases: ["Jack Rabbit"],
			offense: "Bank Robbery, Escape",
			created_at: Date.now() / 1000 - 86400 * 2,
			mugshot: {
				id: "QmDillingerIPFS",
				url: "https://via.placeholder.com/192x192/8b0000/ffffff?text=John+Dillinger",
			},
		},
		{
			id: "crim-4",
			name: "Jesse James",
			aliases: null,
			offense: "Train Robbery, Murder",
			created_at: Date.now() / 1000 - 86400 * 30,
			mugshot: null,
		},
	];

	useEffect(() => {
		loadCriminals();
	}, []);

	const loadCriminals = async () => {
		setLoading(true);
		try {
			// Placeholder - implement your criminal list endpoint
			// const response = await apiCall('/criminals?page=1&per_page=50');
			// setCriminals(response.data.data);

			await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
			setCriminals(mockCriminalsData); // Use mock data for demo
		} catch (err) {
			console.error("Error loading criminals:", err);
		} finally {
			setLoading(false);
		}
	};

	const viewCriminal = async (criminalId) => {
		try {
			// Placeholder - implement your criminal detail endpoint
			// const response = await apiCall(`/criminals/${criminalId}`);
			// setSelectedCriminal(response.data);

			// MOCK DETAIL VIEW
			const criminal = mockCriminalsData.find((c) => c.id === criminalId);
			if (criminal) {
				setSelectedCriminal(criminal);
			}
		} catch (err) {
			console.error("Error loading criminal details:", err);
		}
	};

	const filteredCriminals = criminals.filter(
		(criminal) =>
			criminal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			criminal.aliases?.some((alias) =>
				alias.toLowerCase().includes(searchQuery.toLowerCase()),
			),
	);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-white">Criminal Database</h2>
				<div className="flex items-center gap-2 text-slate-400">
					<Users className="w-5 h-5" />
					<span>{criminals.length} Records</span>
				</div>
			</div>

			<div className="relative">
				<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search by name or alias..."
					className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			{loading ? (
				<div className="flex items-center justify-center py-12">
					<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
				</div>
			) : filteredCriminals.length === 0 ? (
				<div className="text-center py-12 text-slate-400">
					No criminal records found
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{filteredCriminals.map((criminal) => (
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
									<Users className="w-12 h-12 text-slate-600" />
								</div>
							)}

							<div className="p-4">
								<h3 className="text-lg font-semibold text-white mb-1 group-hover:text-red-400 transition">
									{criminal.name}
								</h3>
								{criminal.aliases?.length > 0 && (
									<p className="text-sm text-slate-400 mb-2">
										AKA: {criminal.aliases.join(", ")}
									</p>
								)}
								{criminal.offense && (
									<p className="text-xs text-slate-500 line-clamp-2">
										{criminal.offense}
									</p>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			<CriminalDetailModal
				criminal={selectedCriminal}
				onClose={() => setSelectedCriminal(null)}
			/>
		</div>
	);
};

function CriminalsDashboardPage() {
	const [criminals, setCriminals] = useState([]);
	const loadingInitial = false;

	if (loadingInitial) {
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
				<span className="ml-4 text-white">Loading System...</span>
			</div>
		);
	}

	return <CriminalsTab criminals={criminals} setCriminals={setCriminals} />;
}
