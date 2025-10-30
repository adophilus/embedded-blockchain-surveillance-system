self.addEventListener("push", (event) => {
	if (!(self.Notification && self.Notification.permission === "granted")) {
		return;
	}

	const data = event.data?.json() ?? {
		title: "EBSS Notification",
		body: "You have a new notification from EBSS.",
		tag: "ebss-notification",
	};

	const { title, body, tag } = data;
	const icon = "https://app.ebss.magicstudios.fun/vite.svg";
	const notification = new self.Notification(title, { body, icon, tag });

	event.waitUntil(notification);
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	const clickResponsePromise = self.clients.openWindow(
		"https://app.ebss.magicstudios.fun/dashboard",
	);

	event.waitUntil(clickResponsePromise);
});
