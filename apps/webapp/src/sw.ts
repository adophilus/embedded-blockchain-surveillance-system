import { z } from "zod";

const pushSchema = z.object({
	title: z.string(),
	body: z.string(),
	tag: z.string().optional(),
});

self.addEventListener("push", (event) => {
	if (!(self.Notification && self.Notification.permission === "granted")) {
		return;
	}

	const data = event.data?.json() ?? {};
	const validatedData = pushSchema.safeParse(data);
	if (!validatedData.success) {
		console.error("Invalid push data received:", validatedData.error);
		return;
	}

	const { title, body, tag } = validatedData.data;
	const icon = "https://floridajs.com/images/logo.jpg";
	const notification = new self.Notification(title, { body, icon, tag });

	event.waitUntil(notification);
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	const clickResponsePromise = self.clients.openWindow(
		"https://app.ebss.magicstudios.fun/login",
	);

	event.waitUntil(clickResponsePromise);
});
