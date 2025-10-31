import type { Result, Unit } from "true-myth";

export type BroadcastNotificationError = "ERR_UNEXPECTED";

export type BroadcastPayload = {
	title: string;
	body: string;
	tag: string;
};

export abstract class NotificationService {
	public abstract broadcast(
		payload: BroadcastPayload,
	): Promise<Result<Unit, BroadcastNotificationError>>;
}
