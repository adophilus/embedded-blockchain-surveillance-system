import { Result } from "true-myth";
import type { Request, Response } from "./types";
import type { NotificationTokenService } from "../../service";
import type { Logger } from "@/features/logger";
import { ulid } from "ulidx";

export abstract class RegisterNotificationTokenUseCase {
	public abstract execute(
		payload: Request.Body,
		userId: string,
	): Promise<Result<Response.Success, Response.Error>>;
}

export class RegisterNotificationTokenUseCaseImplementation
	implements RegisterNotificationTokenUseCase
{
	constructor(
		private readonly service: NotificationTokenService,
		private readonly logger: Logger,
	) {}

	public async execute(
		payload: Request.Body,
		userId: string,
	): Promise<Result<Response.Success, Response.Error>> {
		try {
			const result = await this.service.create({
				id: ulid(),
				subscription_id: payload.endpoint,
				user_id: userId,
				meta: {
					type: "web-push",
					data: payload,
				},
			});

			if (result.isErr) {
				this.logger.error(
					"Failed to register notification token",
					result.error,
				);
				return Result.err({ code: "ERR_UNEXPECTED" });
			}

			return Result.ok({ code: "TOKEN_REGISTERED" });
		} catch (error) {
			this.logger.error("An unexpected error occurred", error);
			return Result.err({ code: "ERR_UNEXPECTED" });
		}
	}
}
