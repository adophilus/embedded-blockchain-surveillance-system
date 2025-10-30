import Backend from "../backend";

namespace NotificationService {
	export const arrayBufferToBase64 = (buf: ArrayBuffer) =>
		btoa(String.fromCharCode(...new Uint8Array(buf)));

	export const register = async () => {
		if (!("Notification" in window)) {
			alert(
				"This browser does not support web push notification. This Demo has failed for you.  :'-( ",
			);
			return;
		}

		console.log("Notification permission:", Notification.permission);
		if (Notification.permission === "default") {
			const status = await Notification.requestPermission();

			if (status === "denied") {
				return;
			}
		} else if (Notification.permission === "granted") {
			console.log("Notification permission granted");
		} else {
			return;
		}

		if (!("serviceWorker" in navigator)) {
			return;
		}

		const registrations = await navigator.serviceWorker.getRegistrations();

		for (const registration of registrations) {
			registration.unregister();
		}

		const vapidPublicKeyRes = await Backend.Client.client.request(
			"get",
			"/notification/vapid",
		);
		if (vapidPublicKeyRes.error) {
			return;
		}

		const vapidPublicKey = vapidPublicKeyRes.data.data.publicKey;

		const register = await navigator.serviceWorker.register("/sw.js", {
			scope: "/",
		});

		const subscription = await register.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: vapidPublicKey,
		});

		const authKey = subscription.getKey("auth");
		if (!authKey) return;

		const p256dhKey = subscription.getKey("p256dh");
		if (!p256dhKey) return;

		const registerTokenDetailsRes = await Backend.Client.client.request(
			"post",
			"/notification/token/register",
			{
				body: {
					endpoint: subscription.endpoint,
					keys: {
						auth: arrayBufferToBase64(authKey),
						p256dh: arrayBufferToBase64(p256dhKey),
					},
					supported_content_encodings: Array.from(
						PushManager.supportedContentEncodings,
					),
				},
			},
		);

		if (registerTokenDetailsRes.error) {
			return;
		}
	};
}

export default NotificationService;
