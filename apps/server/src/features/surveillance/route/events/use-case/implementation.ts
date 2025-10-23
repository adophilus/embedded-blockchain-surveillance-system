import { Result } from "true-myth";
import type { ListSurveillanceEventsUseCase } from "./interface";
import type { SurveillanceEventService } from "@/features/surveillance/events/service";
import type { Logger } from "@/features/logger";
import type { Request, Response } from "../types";

export class ListSurveillanceEventsUseCaseImplementation
	implements ListSurveillanceEventsUseCase
{
	constructor(
		private readonly surveillanceEventService: SurveillanceEventService,
		private readonly logger: Logger,
	) {}

	async execute(
		payload: Request.Path & Request.Query,
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

			let filteredEvents = eventsResult.value.filter(
				(event) => event.session_id === payload.sessionId,
			);

			// Apply filters
			if (payload.start_date) {
				filteredEvents = filteredEvents.filter(
					(event) => event.created_at >= payload.start_date,
				);
			}

			if (payload.end_date) {
				filteredEvents = filteredEvents.filter(
					(event) => event.created_at <= payload.end_date,
				);
			}

			if (payload.detected !== undefined) {
				filteredEvents = filteredEvents.filter(
					(event) => event.detected === payload.detected,
				);
			}

			// Apply pagination
			const page = payload.page || 1;
			const perPage = payload.per_page || 10;
			const startIndex = (page - 1) * perPage;
			const endIndex = startIndex + perPage;

			const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

			this.logger.info(`Found ${filteredEvents.length} surveillance events`);

			return Result.ok({
				code: "EVENTS_LIST",
				data: {
					data: paginatedEvents,
					meta: {
						page,
						per_page: perPage,
						total: filteredEvents.length,
					},
				},
			});
		} catch (error) {
			this.logger.error("Error listing surveillance events", error);
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}
	}
}
