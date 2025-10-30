import { env } from "../env";

const NotificationConfig = {
	vapid: {
		subject: env.VAPID_SUBJECT,
		publicKey: env.VAPID_PUBLIC_KEY,
		privateKey: env.VAPID_PRIVATE_KEY,
	},
};

export default NotificationConfig;
