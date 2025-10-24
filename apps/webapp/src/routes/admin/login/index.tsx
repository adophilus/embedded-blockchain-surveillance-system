import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/login/")({
	component: AdminLoginPage,
});

function AdminLoginPage() {
	return null;
}
