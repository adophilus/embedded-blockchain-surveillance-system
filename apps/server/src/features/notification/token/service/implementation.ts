import { Result, Unit } from "true-myth";
import type {
	NotificationTokenService,
	CreateNotificationTokenError,
	FindNotificationTokenByIdError,
	FindNotificationTokenByUserIdError,
	ListNotificationTokensError,
	UpdateNotificationTokenByIdError,
	DeleteNotificationTokenByIdError,
} from "./interface";
import type { NotificationTokenRepository } from "../repository";
import type { Logger } from "@/features/logger";
import type { NotificationToken } from "@/types";

export class NotificationTokenServiceImpl implements NotificationTokenService {
	constructor(
		private readonly repository: NotificationTokenRepository,
		private readonly logger: Logger,
	) {}

	public async create(
		payload: NotificationToken.Insertable,
	): Promise<
		Result<NotificationToken.Selectable, CreateNotificationTokenError>
	> {
		return this.repository.create(payload);
	}

	public async findById(
		id: string,
	): Promise<
		Result<
			NotificationToken.Selectable | null,
			FindNotificationTokenByIdError
		>
	> {
		return this.repository.findById(id);
	}

	public async findByUserId(
		userId: string,
	): Promise<
		Result<
			NotificationToken.Selectable[],
			FindNotificationTokenByUserIdError
		>
	> {
		return this.repository.findByUserId(userId);
	}

	public async list(): Promise<
		Result<NotificationToken.Selectable[], ListNotificationTokensError>
	> {
		return this.repository.list();
	}

	public async updateById(
		id: string,
		payload: NotificationToken.Updateable,
	): Promise<Result<Unit, UpdateNotificationTokenByIdError>> {
		return this.repository.updateById(id, payload);
	}

	public async deleteById(
		id: string,
	): Promise<Result<Unit, DeleteNotificationTokenByIdError>> {
		return this.repository.deleteById(id);
	}
}
