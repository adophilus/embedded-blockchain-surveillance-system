import { Result } from "true-myth";
import type { GetSurveillanceMetricsUseCase } from "./interface";
import type { SurveillanceSessionService } from "@/features/surveillance/session/service";
import type { SurveillanceEventService } from "@/features/surveillance/events/service";
import type { Logger } from "@/features/logger";
import type { Response } from "../types";

export class GetSurveillanceMetricsUseCaseImplementation
	implements GetSurveillanceMetricsUseCase
{
	constructor(
		private readonly surveillanceSessionService: SurveillanceSessionService,
		private readonly surveillanceEventService: SurveillanceEventService,
		private readonly logger: Logger,
	) {}

	async execute(): Promise<Result<Response.Success, Response.Error>> {
		try {
			this.logger.info("Getting surveillance metrics");

			// Get sessions
			const sessionsResult = await this.surveillanceSessionService.list();
			if (sessionsResult.isErr) {
				this.logger.error(
					"Failed to get surveillance sessions",
					sessionsResult.error,
				);
				return Result.err({
					code: "ERR_UNEXPECTED",
				});
			}

			// Get events
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

			const sessions = sessionsResult.value;
			const events = eventsResult.value;

			// Calculate metrics
			const totalSessions = sessions.length;
			const activeSessions = sessions.filter(
				(s) => s.status === "ACTIVE",
			).length;
			const completedSessions = sessions.filter(
				(s) => s.status === "COMPLETED",
			).length;
			const totalEvents = events.length;
			const totalDetections = events.filter((e) => e.detected).length;

			this.logger.info("Calculated surveillance metrics");

			return Result.ok({
				code: "SURVEILLANCE_METRICS",
				data: {
					total_sessions: totalSessions,
					active_sessions: activeSessions,
					completed_sessions: completedSessions,
					total_events: totalEvents,
					total_detections: totalDetections,
				},
			});
		} catch (error) {
			this.logger.error("Error getting surveillance metrics", error);
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}
	}
}
