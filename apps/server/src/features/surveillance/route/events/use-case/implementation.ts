import { Result } from "true-myth";
import type { ListSurveillanceEventsUseCase } from "./interface";
import type { SurveillanceEventService } from "@/features/surveillance/events/service";
import type { Logger } from "@/features/logger";
import type { Request, Response } from "../types";
import { Pagination } from "@/features/pagination";

export class ListSurveillanceEventsUseCaseImplementation
	implements ListSurveillanceEventsUseCase
{
	constructor(
		private readonly surveillanceEventService: SurveillanceEventService,
		private readonly logger: Logger,
	) {}

	async execute(
		payload: Request.Path,
	): Promise<Result<Response.Success, Response.Error>> {
		try {
			this.logger.info(
				`Listing surveillance events for session: ${payload.sessionId}`,
			);

			const eventsResult = await this.surveillanceEventService.list();
			if (eventsResult.isErr) {
				this.logger.error(
					"Failed to list surveillance events",
					eventsResult.error,
				);
				return Result.err({
					code: "ERR_UNEXPECTED",
				});
			}

			const filteredEvents = eventsResult.value.filter(
				(event) => event.session_id === payload.sessionId,
			);

			this.logger.info(`Found ${filteredEvents.length} surveillance events`);

			return Result.ok({
				code: "EVENTS_LIST",
				data: Pagination.paginate(filteredEvents, {
					page: 1,
					per_page: filteredEvents.length,
					total: filteredEvents.length,
				}),
			});
		} catch (error) {
			this.logger.error("Error listing surveillance events", error);
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}
	}
}
