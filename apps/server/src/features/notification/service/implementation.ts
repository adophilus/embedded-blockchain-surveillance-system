import { Result, Unit } from "true-myth";
import type {
	BroadcastNotificationError,
	BroadcastPayload,
	NotificationService,
} from "./interface";
import type { Logger } from "@/features/logger";
import type { NotificationTokenService } from "../token/service";
import webpush from "web-push";

export class NotificationServiceImpl implements NotificationService {
	constructor(
		private readonly notificationTokenService: NotificationTokenService,
		private readonly logger: Logger,
	) {}

	public async broadcast(
		payload: BroadcastPayload,
	): Promise<Result<Unit, BroadcastNotificationError>> {
		const listNotificationTokensResult =
			await this.notificationTokenService.list();
		if (listNotificationTokensResult.isErr) return Result.err("ERR_UNEXPECTED");

		const notificationTokens = listNotificationTokensResult.value;

		for (const notificationToken of notificationTokens) {
			try {
				const res = await webpush.sendNotification(
					{
						endpoint: notificationToken.meta.data.endpoint,
						keys: notificationToken.meta.data.keys,
					},
					JSON.stringify(payload),
				);
				this.logger.debug(res);
			} catch (err) {
				this.logger.error(
					`Failed to send push notification to ${notificationToken.user_id}:`,
					err,
				);
			}
		}

		return Result.ok();
	}
}
