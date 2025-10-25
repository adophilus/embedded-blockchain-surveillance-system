import { Shield, Database } from "lucide-react";
import { LoginForm } from "@/features/login/form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
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

        <LoginForm />

        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <Database className="w-4 h-4" />
            <span>Powered by Polygon Blockchain & IPFS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
