import { Result } from "true-myth";
import type {
	SurveillanceEventRepository,
	CreateSurveillanceEventError,
	FindSurveillanceEventByIdError,
	ListSurveillanceEventsError,
} from "./interface";
import type { KyselyClient } from "@/features/database/kysely";
import type { Logger } from "@/features/logger";
import type { SurveillanceEvent } from "@/types";

export class KyselySurveillanceEventRepository
	implements SurveillanceEventRepository
{
	constructor(
		private readonly db: KyselyClient,
		private readonly logger: Logger,
	) {}

	public async create(
		event: SurveillanceEvent.Insertable,
	): Promise<
		Result<SurveillanceEvent.Selectable, CreateSurveillanceEventError>
	> {
		try {
			// Verify session exists
			const sessionExists = await this.db
				.selectFrom("surveillance_sessions")
				.select("id")
				.where("id", "=", event.session_id)
				.executeTakeFirst();

			if (!sessionExists) {
				return Result.err("ERR_UNEXPECTED");
			}

			const newEvent = await this.db
				.insertInto("surveillance_events")
				.values(event)
				.returningAll()
				.executeTakeFirstOrThrow();

			return Result.ok(newEvent);
		} catch (error) {
			this.logger.error("Failed to create surveillance event", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async findById(
		id: string,
	): Promise<
		Result<SurveillanceEvent.Selectable | null, FindSurveillanceEventByIdError>
	> {
		try {
			const event = await this.db
				.selectFrom("surveillance_events")
				.selectAll()
				.where("id", "=", id)
				.executeTakeFirst();

			return Result.ok(event ?? null);
		} catch (error) {
			this.logger.error("Failed to find surveillance event by ID", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async list(): Promise<
		Result<SurveillanceEvent.Selectable[], ListSurveillanceEventsError>
	> {
		try {
			const events = await this.db
				.selectFrom("surveillance_events")
				.selectAll()
				.orderBy("created_at", "desc")
				.execute();

			return Result.ok(events);
		} catch (error) {
			this.logger.error("Failed to list surveillance events", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}
}
