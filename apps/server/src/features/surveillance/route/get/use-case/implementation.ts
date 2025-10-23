import { Result } from "true-myth";
import type { GetSurveillanceSessionByIdUseCase } from "./interface";
import type { SurveillanceSessionService } from "@/features/surveillance/session/service";
import type { SurveillanceEventService } from "@/features/surveillance/events/service";
import type { Logger } from "@/features/logger";
import type { Request, Response } from "../types";

export class GetSurveillanceSessionByIdUseCaseImplementation
	implements GetSurveillanceSessionByIdUseCase
{
	constructor(
		private readonly surveillanceSessionService: SurveillanceSessionService,
		private readonly surveillanceEventService: SurveillanceEventService,
		private readonly logger: Logger,
	) {}

	async execute(
		payload: Request.Path,
	): Promise<Result<Response.Success, Response.Error>> {
		try {
			this.logger.info(
				`Getting surveillance session by ID: ${payload.sessionId}`,
			);

			const sessionResult = await this.surveillanceSessionService.getById(
				payload.sessionId,
			);
			if (sessionResult.isErr) {
				this.logger.error(
					"Failed to get surveillance session",
					sessionResult.error,
				);
				return Result.err({
					code: "ERR_SESSION_NOT_FOUND",
				});
			}

			const session = sessionResult.value;

			// Get events for this session
			const eventsResult = await this.surveillanceEventService.list();
			if (eventsResult.isErr) {
				this.logger.error(
					"Failed to get surveillance events",
					eventsResult.error,
				);
				return Result.err({
					code: "ERR_UNEXPECTED",
				});
			}

			const sessionEvents = eventsResult.value.filter(
				(event) => event.session_id === payload.sessionId,
			);

			this.logger.info(`Found session with ${sessionEvents.length} events`);

			return Result.ok({
				code: "SESSION_DETAILS",
				data: {
					session,
					events: sessionEvents,
				},
			});
		} catch (error) {
			this.logger.error("Error getting surveillance session", error);
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}
	}
}
