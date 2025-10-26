import { Result } from "true-myth";
import type { ListSurveillanceSessionsUseCase } from "./interface";
import type { SurveillanceSessionService } from "@/features/surveillance/session/service";
import type { Logger } from "@/features/logger";
import type { Request, Response } from "../types";

export class ListSurveillanceSessionsUseCaseImplementation
	implements ListSurveillanceSessionsUseCase
{
	constructor(
		private readonly surveillanceSessionService: SurveillanceSessionService,
		private readonly logger: Logger,
	) {}

	async execute(
		payload: Request.Query,
	): Promise<Result<Response.Success, Response.Error>> {
		try {
			const sessionsResult = await this.surveillanceSessionService.list();
			if (sessionsResult.isErr) {
				this.logger.error(
					"Failed to list surveillance sessions",
					sessionsResult.error,
				);
				return Result.err({
					code: "ERR_UNEXPECTED",
				});
			}

			const sessions = sessionsResult.value;

			return Result.ok({
				code: "SESSIONS_LIST",
				data: {
					data: sessions,
					meta: {
						page: 1,
						per_page: sessions.length,
						total: sessions.length,
					},
				},
			});
		} catch (error) {
			this.logger.error("Error listing surveillance sessions", error);
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}
	}
}
