import { env } from "../env";

const NotificationConfig = {
	vapid: {
		publicKey: env.VAPID_PUBLIC_KEY,
		privateKey: env.VAPID_PRIVATE_KEY,
	},
};

export default NotificationConfig;
