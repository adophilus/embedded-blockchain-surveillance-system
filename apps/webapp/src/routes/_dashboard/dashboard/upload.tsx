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

export const Route = createFileRoute("/_dashboard/dashboard/upload")({
	component: RouteComponent,
});

const UploadForm = () => {
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
			// })

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

function RouteComponent() {
	const loadingInitial = false;

	if (loadingInitial) {
		return (
			<div className="min-h-screen bg-slate-900 flex items-center justify-center">
				<div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
				<span className="ml-4 text-white">Loading System...</span>
			</div>
		);
	}

	return <UploadForm />;
}
