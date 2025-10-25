import { useForm } from "@tanstack/react-form";
import Auth from "@/features/auth";
import z from "zod";

const schema = z.object({
	email: z.string().email(),
	password: z.string(),
});

const defaultValues: { email: string; password: string } = import.meta.env.PROD
	? { email: "", password: "" }
	: {
			email: "admin@surveillance.fudo.edu.ng",
			password: "super-secret-password",
		};

export const UploadForm = () => {
	const { mutate, status } = Auth.Hooks.useLoginMutation();

	const form = useForm({
		defaultValues,
		onSubmit: ({ value }) => mutate(value),
		validators: {
			onSubmit: schema,
		},
		onSubmitInvalid: (v) => {
			console.log(v);
		},
	});

	const isLoading = status === "pending";

	return (
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
	);
};
