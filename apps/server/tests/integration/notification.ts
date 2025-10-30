import "../utils";
import { NotificationTokenService } from "@/features/notification/token/service";
import { Container } from "@n8n/di";
import { describe, it, assert } from "vitest";

describe("Notification", () => {
	describe("Token", () => {
		const notificationTokenService = Container.get(NotificationTokenService);

		it("should send a notification to all users", async () => {
			const res = await notificationTokenService.broadcast({
				title: "Test",
				body: "This is a test",
				tag: "test",
			});

			assert(res.isOk, "Failed to broadcast push notification");
		});
	});
});
