import { useForm } from "@tanstack/react-form";
import Auth from "@/features/auth";
import { z } from "zod";

const schema = z.object({
	email: z.string().email(),
	password: z.string(),
});

const defaultValues: { email: string; password: string } = import.meta.env.PROD
	? { email: "", password: "" }
	: {
			email: "admin@surveillance.futo.edu.ng",
			password: "super-secret-password",
		};

export const LoginForm = () => {
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
			className="space-y-6"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.Field name="email">
				{(field) => (
					<div>
						<label
							htmlFor={field.name}
							className="block text-sm font-medium text-slate-300 mb-2"
						>
							Email Address
						</label>
						<input
							type="email"
							className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
							placeholder="officer.johnson@police.gov"
							required
							id={field.name}
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
						{!field.state.meta.isValid && (
							<em className="text-sm text-red-500 mt-1 block">
								{field.state.meta.errors.map((err) => err?.message).join(",")}
							</em>
						)}
					</div>
				)}
			</form.Field>

			<form.Field name="password">
				{(field) => (
					<div>
						<label
							htmlFor={field.name}
							className="block text-sm font-medium text-slate-300 mb-2"
						>
							Password
						</label>
						<input
							type="password"
							className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
							placeholder="••••••••"
							required
							id={field.name}
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
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
						Signing In...
					</>
				) : (
					"Sign In"
				)}
			</button>
		</form>
	);
};
