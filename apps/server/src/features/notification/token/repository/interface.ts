import type { Result, Unit } from "true-myth";
import type { NotificationToken } from "@/types";

export type CreateNotificationTokenError = "ERR_UNEXPECTED";
export type FindNotificationTokenByIdError = "ERR_UNEXPECTED";
export type FindNotificationTokenByUserIdError = "ERR_UNEXPECTED";
export type ListNotificationTokensError = "ERR_UNEXPECTED";
export type UpdateNotificationTokenByIdError = "ERR_UNEXPECTED";
export type DeleteNotificationTokenByIdError = "ERR_UNEXPECTED";

export abstract class NotificationTokenRepository {
	public abstract create(
		payload: NotificationToken.Insertable,
	): Promise<
		Result<NotificationToken.Selectable, CreateNotificationTokenError>
	>;

	public abstract findById(
		id: string,
	): Promise<
		Result<
			NotificationToken.Selectable | null,
			FindNotificationTokenByIdError
		>
	>;

	public abstract findByUserId(
		userId: string,
	): Promise<
		Result<
			NotificationToken.Selectable[],
			FindNotificationTokenByUserIdError
		>
	>;

	public abstract list(): Promise<
		Result<NotificationToken.Selectable[], ListNotificationTokensError>
	>;

	public abstract updateById(
		id: string,
		payload: NotificationToken.Updateable,
	): Promise<Result<Unit, UpdateNotificationTokenByIdError>>;

	public abstract deleteById(
		id: string,
	): Promise<Result<Unit, DeleteNotificationTokenByIdError>>;
}
