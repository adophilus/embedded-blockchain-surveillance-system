import { Result, Unit } from "true-myth";
import type {
	NotificationTokenRepository,
	CreateNotificationTokenError,
	FindNotificationTokenByIdError,
	FindNotificationTokenByUserIdError,
	ListNotificationTokensError,
	UpdateNotificationTokenByIdError,
	DeleteNotificationTokenByIdError,
} from "./interface";
import type { KyselyClient } from "@/features/database/kysely";
import type { Logger } from "@/features/logger";
import type { NotificationToken } from "@/types";

export class KyselyNotificationTokenRepository
	implements NotificationTokenRepository
{
	constructor(
		private readonly db: KyselyClient,
		private readonly logger: Logger,
	) {}

	public async create(
		payload: NotificationToken.Insertable,
	): Promise<
		Result<NotificationToken.Selectable, CreateNotificationTokenError>
	> {
		try {
			const token = await this.db
				.insertInto("notification_tokens")
				.values(payload)
				.returningAll()
				.executeTakeFirstOrThrow();

			return Result.ok(token);
		} catch (error) {
			this.logger.error("Failed to create notification token", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async findById(
		id: string,
	): Promise<
		Result<NotificationToken.Selectable | null, FindNotificationTokenByIdError>
	> {
		try {
			const token = await this.db
				.selectFrom("notification_tokens")
				.selectAll()
				.where("id", "=", id)
				.executeTakeFirst();

			return Result.ok(token ?? null);
		} catch (error) {
			this.logger.error("Failed to find notification token by ID", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async findByUserId(
		userId: string,
	): Promise<
		Result<NotificationToken.Selectable[], FindNotificationTokenByUserIdError>
	> {
		try {
			const tokens = await this.db
				.selectFrom("notification_tokens")
				.selectAll()
				.where("user_id", "=", userId)
				.execute();

			return Result.ok(tokens);
		} catch (error) {
			this.logger.error("Failed to find notification tokens by user ID", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async list(): Promise<
		Result<NotificationToken.Selectable[], ListNotificationTokensError>
	> {
		try {
			const tokens = await this.db
				.selectFrom("notification_tokens")
				.selectAll()
				.execute();

			return Result.ok(tokens);
		} catch (error) {
			this.logger.error("Failed to list notification tokens", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async updateById(
		id: string,
		payload: NotificationToken.Updateable,
	): Promise<Result<Unit, UpdateNotificationTokenByIdError>> {
		try {
			await this.db
				.updateTable("notification_tokens")
				.set(payload)
				.where("id", "=", id)
				.execute();

			return Result.ok(Unit);
		} catch (error) {
			this.logger.error("Failed to update notification token by ID", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async deleteById(
		id: string,
	): Promise<Result<Unit, DeleteNotificationTokenByIdError>> {
		try {
			await this.db
				.deleteFrom("notification_tokens")
				.where("id", "=", id)
				.execute();

			return Result.ok(Unit);
		} catch (error) {
			this.logger.error("Failed to delete notification token by ID", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}
}
