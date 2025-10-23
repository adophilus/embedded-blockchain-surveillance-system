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
			this.logger.info("Listing surveillance sessions");

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
			const page = payload.page || 1;
			const perPage = payload.per_page || 10;
			const startIndex = (page - 1) * perPage;
			const endIndex = startIndex + perPage;

			const paginatedSessions = sessions.slice(startIndex, endIndex);

			this.logger.info(`Found ${sessions.length} surveillance sessions`);

			return Result.ok({
				code: "SESSIONS_LIST",
				data: {
					data: paginatedSessions,
					meta: {
						page,
						per_page: perPage,
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
