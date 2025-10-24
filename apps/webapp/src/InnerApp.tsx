// ============================================================================
// API CONFIGURATION & UTILITIES
// ============================================================================

const API_BASE_URL = "https://api.surveillance-system.com"; // Replace with your actual API URL

const apiCall = async (endpoint, options = {}) => {
	const token = localStorage.getItem("access_token");
	const headers = {
		...options.headers,
	};

	if (token && !options.skipAuth) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	if (!(options.body instanceof FormData)) {
		headers["Content-Type"] = "application/json";
	}

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers,
	});

	if (!response.ok) {
		let error = { code: "API_ERROR" };
		try {
			error = await response.json();
		} catch (e) {
			// If response is not JSON, use default error
		}
		throw new Error(error.code || "API Error");
	}

	try {
		return response.json();
	} catch (e) {
		// Return empty object for successful calls with no body (e.g., DELETE/204)
		return {};
	}
};

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

const Header = ({ user, onLogout, activeTab, setActiveTab }) => {
	const tabs = [
		{ id: "surveillance", label: "Surveillance", icon: Camera },
		{ id: "criminals", label: "Criminals", icon: Users },
		{ id: "upload", label: "Upload", icon: Upload },
		{ id: "metrics", label: "Metrics", icon: Activity },
	];

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
						onClick={onLogout}
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
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex items-center gap-2 px-6 py-3 font-medium transition ${
									activeTab === tab.id
										? "text-blue-400 border-b-2 border-blue-400"
										: "text-slate-400 hover:text-slate-300"
								}`}
							>
								<Icon className="w-4 h-4" />
								{tab.label}
							</button>
						);
					})}
				</div>
			</nav>
		</header>
	);
};

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

// ============================================================================
// UPLOAD TAB COMPONENT
// ============================================================================

const UploadTab = ({ onUploadSuccess }) => {
	const [formData, setFormData] = useState({
		name: "",
		aliases: "",
		offense: "",
		mugshot: null,
	});
	const [preview, setPreview] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFormData({ ...formData, mugshot: file });
			const reader = new FileReader();
			reader.onloadend = () => setPreview(reader.result);
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setUploading(true);
		setSuccess(false);
		setError("");

		try {
			const data = new FormData();
			data.append("name", formData.name);

			if (formData.aliases) {
				const aliasesArray = formData.aliases
					.split(",")
					.map((a) => a.trim())
					.filter((a) => a !== "");
				data.append("aliases", JSON.stringify(aliasesArray));
			}

			if (formData.offense) {
				data.append("offense", formData.offense);
			}

			if (formData.mugshot) {
				data.append("mugshot", formData.mugshot);
			}

			// MOCK API Call for demo
			await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate upload time

			// await apiCall('/criminals', {
			//   method: 'POST',
			//   body: data,
			// });

			setSuccess(true);
			setFormData({ name: "", aliases: "", offense: "", mugshot: null });
			setPreview(null);

			setTimeout(() => {
				onUploadSuccess();
			}, 2000);
		} catch (err) {
			setError("Failed to upload criminal profile. Please try again.");
			console.error("Error uploading criminal profile:", err);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<div className="flex items-center gap-3">
				<Upload className="w-8 h-8 text-blue-400" />
				<h2 className="text-2xl font-bold text-white">
					Upload Criminal Profile
				</h2>
			</div>

			{success && (
				<div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
					<CheckCircle className="w-5 h-5" />
					<span>Criminal profile uploaded successfully! Redirecting...</span>
				</div>
			)}

			{error && (
				<div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
					<AlertCircle className="w-5 h-5" />
					<span>{error}</span>
				</div>
			)}

			<form
				onSubmit={handleSubmit}
				className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6"
			>
				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">
						Full Name *
					</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="John Smith"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">
						Known Aliases
					</label>
					<input
						type="text"
						value={formData.aliases}
						onChange={(e) =>
							setFormData({ ...formData, aliases: e.target.value })
						}
						className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Johnny, Slim Jim (comma separated)"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">
						Offense
					</label>
					<textarea
						value={formData.offense}
						onChange={(e) =>
							setFormData({ ...formData, offense: e.target.value })
						}
						className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
						placeholder="Armed robbery, assault"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-slate-300 mb-2">
						Mugshot
					</label>
					<div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-blue-500 transition">
						{preview ? (
							<div className="space-y-4">
								<img
									src={preview}
									alt="Preview"
									className="w-48 h-48 object-cover rounded-lg mx-auto"
								/>
								<button
									type="button"
									onClick={() => {
										setPreview(null);
										setFormData({ ...formData, mugshot: null });
									}}
									className="text-red-400 hover:text-red-300 text-sm"
								>
									Remove Image
								</button>
							</div>
						) : (
							<label className="cursor-pointer">
								<input
									type="file"
									accept="image/jpeg,image/png,image/webp"
									onChange={handleFileChange}
									className="hidden"
								/>
								<div className="space-y-2">
									<Upload className="w-12 h-12 text-slate-600 mx-auto" />
									<p className="text-slate-400">Click to upload mugshot</p>
									<p className="text-xs text-slate-500">JPEG, PNG, or WebP</p>
								</div>
							</label>
						)}
					</div>
				</div>

				<button
					type="submit"
					disabled={uploading || success || !formData.name}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{uploading ? (
						<>
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							Uploading...
						</>
					) : success ? (
						<>
							<CheckCircle className="w-5 h-5" />
							Upload Complete!
						</>
					) : (
						"Submit to Blockchain"
					)}
				</button>
			</form>
		</div>
	);
};

// ============================================================================
// METRICS TAB COMPONENT
// ============================================================================

const MetricsTab = () => {
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

// ============================================================================
// MAIN CONTENT & APP COMPONENTS
// ============================================================================

const MainContent = ({
	activeTab,
	sessions,
	criminals,
	setCriminals,
	setActiveTab,
}) => {
	// Function to re-load criminals after a successful upload
	const handleUploadSuccess = async () => {
		setActiveTab("criminals"); // Switch to the criminals tab
		// Optionally trigger a reload in CriminalsTab if needed, but for this demo,
		// it's enough to just switch tabs. The CriminalsTab's useEffect loads on mount.
	};

	const renderTab = () => {
		switch (activeTab) {
			case "surveillance":
				return <SurveillanceTab sessions={sessions} />;
			case "criminals":
				return (
					<CriminalsTab criminals={criminals} setCriminals={setCriminals} />
				);
			case "upload":
				return <UploadTab onUploadSuccess={handleUploadSuccess} />;
			case "metrics":
				return <MetricsTab />;
			default:
				return <div className="text-white">Select a tab from the header.</div>;
		}
	};

	return (
		<main className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-130px)]">
			{renderTab()}
		</main>
	);
};

const App = () => {
	const [user, setUser] = useState(null);
	const [activeTab, setActiveTab] = useState("surveillance");
	const [sessions, setSessions] = useState([]);
	const [criminals, setCriminals] = useState([]);
	const [loadingInitial, setLoadingInitial] = useState(true);

	// MOCK SESSION DATA
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

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		const token = localStorage.getItem("access_token");

		if (storedUser && token) {
			try {
				setUser(JSON.parse(storedUser));
				// In a real app, you would validate the token with an API call here.
				setSessions(mockSessions); // Set mock data on login for demo
			} catch (e) {
				// Clear invalid storage
				handleLogout();
			}
		}
		setLoadingInitial(false);
	}, []);

	const handleLoginSuccess = (userData) => {
		setUser(userData);
		setSessions(mockSessions); // Set mock data on login for demo
		setActiveTab("surveillance");
	};

	const handleLogout = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("user");
		setUser(null);
		setSessions([]);
		setCriminals([]);
	};

	if (loadingInitial) {
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
				<span className="ml-4 text-white">Loading System...</span>
			</div>
		);
	}

	// if (!user) {
	//   return <Login onLoginSuccess={handleLoginSuccess} />;
	// }

	return (
		<div className="min-h-screen bg-slate-900">
			<Header
				user={user}
				onLogout={handleLogout}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
			<MainContent
				activeTab={activeTab}
				sessions={sessions}
				criminals={criminals}
				setCriminals={setCriminals}
				setActiveTab={setActiveTab}
			/>
			<footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-sm text-slate-500">
				&copy; {new Date().getFullYear()} Blockchain Surveillance System. All
				rights reserved.
			</footer>
		</div>
	);
};

// Export App as the default export (required for React entry point)
export default App;
