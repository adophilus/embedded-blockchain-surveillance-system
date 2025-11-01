import { NotificationService } from "@/features/notification/service";
import "../utils";
import { Container } from "@n8n/di";
import { describe, it, assert } from "vitest";

describe("Notification", () => {
	const notificationService = Container.get(NotificationService);

	it("should send a notification to all users", async () => {
		const res = await notificationService.broadcast({
			title: "Test",
			body: "This is a test",
			tag: "test",
		});

		assert(res.isOk, "Failed to broadcast push notification");
	});
});
