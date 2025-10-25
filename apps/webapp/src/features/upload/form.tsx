import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { UploadIcon } from "lucide-react";
import z from "zod";
import { useUploadCriminalProfileMutation } from "./hooks";

const schema = z.object({
	name: z.string().min(1, "Name is required"),
	aliases: z.string(),
	offenses: z.string(),
	mugshot: z.instanceof(File, { message: "Invalid file" }).optional(),
});

type Schema = z.infer<typeof schema>;

const defaultValues: Schema = {
	name: "",
	aliases: "",
	offenses: "",
	mugshot: undefined,
};

export const UploadForm = () => {
	const [preview, setPreview] = useState<string | null>(null);

	const { mutate, status } = useUploadCriminalProfileMutation();

	const form = useForm({
		defaultValues,
		onSubmit: async ({ value }) => {
			const processedInput = {
				name: value.name,
				aliases: value.aliases
					.split(",")
					.map((a) => a.trim())
					.filter((a) => a),
				offenses: value.offenses
					.split(",")
					.map((o) => o.trim())
					.filter((o) => o),
				mugshot: value.mugshot,
			};

			return mutate(processedInput);
		},
		validators: {
			onSubmit: schema,
		},
	});

	const isLoading = status === "pending";

	return (
		<form
			className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.Field name="name">
				{(field) => (
					<div>
						<label
							htmlFor={field.name}
							className="block text-sm font-medium text-slate-300 mb-2"
						>
							Full Name *
						</label>
						<input
							type="text"
							id={field.name}
							name={field.name}
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="John Smith"
							required
						/>
						{!field.state.meta.isValid && (
							<em className="text-sm text-red-500 mt-1 block">
								{field.state.meta.errors.map((err) => err?.message).join(",")}
							</em>
						)}
					</div>
				)}
			</form.Field>

			<form.Field name="aliases">
				{(field) => (
					<div>
						<label
							htmlFor={field.name}
							className="block text-sm font-medium text-slate-300 mb-2"
						>
							Known Aliases
						</label>
						<input
							type="text"
							id={field.name}
							name={field.name}
							value={field.state.value ?? ""}
							onChange={(e) => field.handleChange(e.target.value)}
							className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Johnny, Slim Jim (comma separated)"
						/>
						{!field.state.meta.isValid && (
							<em className="text-sm text-red-500 mt-1 block">
								{field.state.meta.errors.map((err) => err?.message).join(",")}
							</em>
						)}
					</div>
				)}
			</form.Field>

			<form.Field name="offenses">
				{(field) => (
					<div>
						<label
							htmlFor={field.name}
							className="block text-sm font-medium text-slate-300 mb-2"
						>
							Offenses
						</label>
						<textarea
							id={field.name}
							name={field.name}
							value={field.state.value ?? ""}
							onChange={(e) => field.handleChange(e.target.value)}
							className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
							placeholder="Armed robbery, assault"
						/>
						{!field.state.meta.isValid && (
							<em className="text-sm text-red-500 mt-1 block">
								{field.state.meta.errors.map((err) => err?.message).join(",")}
							</em>
						)}
					</div>
				)}
			</form.Field>

			<form.Field name="mugshot">
				{(field) => (
					<div>
						<label
							htmlFor={field.name}
							className="block text-sm font-medium text-slate-300 mb-2"
						>
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
											field.handleChange(undefined);
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
										onChange={(e) => {
											const file = e.target.files?.[0];
											field.handleChange(file);
											if (file) {
												setPreview(URL.createObjectURL(file));
											} else {
												setPreview(null);
											}
										}}
										className="hidden"
									/>
									<div className="space-y-2">
										{/* Keep existing Upload icon component */}
										<UploadIcon className="w-12 h-12 text-slate-600 mx-auto" />
										<p className="text-slate-400">Click to upload mugshot</p>
										<p className="text-xs text-slate-500">JPEG, PNG, or WebP</p>
									</div>
								</label>
							)}
						</div>
						{!field.state.meta.isValid && (
							<em className="text-sm text-red-500 mt-1 block">
								{field.state.meta.errors.map((err) => err?.message).join(",")}
							</em>
						)}
					</div>
				)}
			</form.Field>

			<button
				type="submit"
				disabled={isLoading}
				className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isLoading ? (
					<>
						<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						Uploading...
					</>
				) : (
					"Upload"
				)}
			</button>
		</form>
	);
};
