import { Shield, Database } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import Auth from "@/features/auth";

const defaultValues: { email: string, password: string } = import.meta.env.PROD ? { email: "", password: "" } : {
  email: 'admin@surveillance.fudo.edu.ng',
  password: 'super-secret-password'
}

export const Login = () => {
  const { mutate, status } = Auth.Hooks.useLoginMutation();

  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => mutate(value),
  });

  const isLoading = status === "pending";

  // MOCK LOGIC for front-end demonstration
  // if (email === "test@police.gov" && password === "password") {
  // const mockUser = {
  //   full_name: "Officer Alex Murphy",
  //   role: "Chief Security Officer",
  //   id: "user-1",
  // };
  // // MOCK API success structure
  // const response = {
  //   code: "SIGN_IN_SUCCESSFUL",
  //   data: {
  //     tokens: {
  //       access_token: "mock_token_123",
  //       refresh_token: "mock_refresh_456",
  //     },
  //     user: mockUser,
  //   },
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxZTQwYWYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTEydjEyaDEyVjMwem0wLTMwSDB2MTJoMzZWMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 border border-blue-500/20">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-full">
            <Shield className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Blockchain Surveillance
        </h1>
        <p className="text-center text-slate-400 mb-8">
          Secure • Transparent • Tamper-Evident
        </p>

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
                <label className="block text-sm font-medium text-slate-300 mb-2">
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
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
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

        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <Database className="w-4 h-4" />
            <span>Powered by Polygon Blockchain & IPFS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
