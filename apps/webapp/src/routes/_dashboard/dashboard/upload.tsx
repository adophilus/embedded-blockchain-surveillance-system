import { createFileRoute } from "@tanstack/react-router";
import { UploadIcon } from "lucide-react";
import { UploadForm } from "@/features/upload/form";

export const Route = createFileRoute("/_dashboard/dashboard/upload")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-3xl mx-auto space-y-6">
			<div className="flex items-center gap-3">
				<UploadIcon className="w-8 h-8 text-blue-400" />
				<h2 className="text-2xl font-bold text-white">
					Upload Criminal Profile
				</h2>
			</div>

			<UploadForm />
		</div>
	);
}
