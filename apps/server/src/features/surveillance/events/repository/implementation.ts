import { Result, Unit } from "true-myth";
import type {
	SurveillanceEventRepository,
	SurveillanceEvent,
	CreateSurveillanceEventInput,
	UpdateSurveillanceEventInput,
	CreateSurveillanceEventError,
} from "./interface";
import type { KyselyClient } from "@/features/database/kysely";
import type { Logger } from "@/features/logger";

export class KyselySurveillanceEventRepository
	implements SurveillanceEventRepository
{
	constructor(
		private readonly db: KyselyClient,
		private readonly logger: Logger,
	) {}

	public async create(
		event: CreateSurveillanceEventInput,
	): Promise<Result<SurveillanceEvent, CreateSurveillanceEventError>> {
		try {
			// Verify session exists
			const sessionExists = await this.db
				.selectFrom("surveillance_sessions")
				.select("id")
				.where("id", "=", event.session_id)
				.executeTakeFirst();

			if (!sessionExists) {
				return Result.err("ERR_SESSION_NOT_FOUND");
			}

			const newEvent = await this.db
				.insertInto("surveillance_events")
				.values({
					id: crypto.randomUUID(),
					session_id: event.session_id,
					device_id: event.device_id,
					timestamp: event.timestamp,
					detected: event.detected ? 1 : 0,
					media_source: event.media_source,
					media_id: event.media_id,
					media_url: event.media_url,
					created_at: new Date().toISOString(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			return Result.ok({
				...newEvent,
				detected: newEvent.detected === 1,
			});
		} catch (error) {
			this.logger.error("Failed to create surveillance event", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async findById(
		id: string,
	): Promise<Result<SurveillanceEvent | null, CreateSurveillanceEventError>> {
		try {
			const event = await this.db
				.selectFrom("surveillance_events")
				.selectAll()
				.where("id", "=", id)
				.executeTakeFirst();

			if (!event) {
				return Result.ok(null);
			}

			return Result.ok({
				...event,
				detected: event.detected === 1,
			});
		} catch (error) {
			this.logger.error("Failed to find surveillance event by ID", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async list(filters?: {
		sessionId?: string;
		deviceId?: string;
		startDate?: string;
		endDate?: string;
		detected?: boolean;
		page?: number;
		perPage?: number;
	}): Promise<Result<SurveillanceEvent[], CreateSurveillanceEventError>> {
		try {
			let query = this.db.selectFrom("surveillance_events").selectAll();

			if (filters?.sessionId) {
				query = query.where("session_id", "=", filters.sessionId);
			}

			if (filters?.deviceId) {
				query = query.where("device_id", "=", filters.deviceId);
			}

			if (filters?.startDate) {
				query = query.where("timestamp", ">=", filters.startDate);
			}

			if (filters?.endDate) {
				query = query.where("timestamp", "<=", filters.endDate);
			}

			if (filters?.detected !== undefined) {
				query = query.where("detected", "=", filters.detected ? 1 : 0);
			}

			// Apply pagination if provided
			if (filters?.page !== undefined && filters?.perPage !== undefined) {
				const offset = (filters.page - 1) * filters.perPage;
				query = query.offset(offset).limit(filters.perPage);
			}

			// Order by timestamp descending (newest first)
			query = query.orderBy("timestamp", "desc");

			const events = await query.execute();

			return Result.ok(
				events.map((event) => ({
					...event,
					detected: event.detected === 1,
				})),
			);
		} catch (error) {
			this.logger.error("Failed to list surveillance events", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async update(
		id: string,
		updates: UpdateSurveillanceEventInput,
	): Promise<Result<Unit, CreateSurveillanceEventError>> {
		try {
			const eventExists = await this.db
				.selectFrom("surveillance_events")
				.select("id")
				.where("id", "=", id)
				.executeTakeFirst();

			if (!eventExists) {
				return Result.err("ERR_EVENT_NOT_FOUND");
			}

			const updateData: Record<string, any> = {};

			if (updates.timestamp !== undefined) {
				updateData.timestamp = updates.timestamp;
			}

			if (updates.detected !== undefined) {
				updateData.detected = updates.detected ? 1 : 0;
			}

			if (updates.media_source !== undefined) {
				updateData.media_source = updates.media_source;
			}

			if (updates.media_id !== undefined) {
				updateData.media_id = updates.media_id;
			}

			if (updates.media_url !== undefined) {
				updateData.media_url = updates.media_url;
			}

			await this.db
				.updateTable("surveillance_events")
				.set(updateData)
				.where("id", "=", id)
				.execute();

			return Result.ok(Unit);
		} catch (error) {
			this.logger.error("Failed to update surveillance event", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async delete(
		id: string,
	): Promise<Result<Unit, CreateSurveillanceEventError>> {
		try {
			const eventExists = await this.db
				.selectFrom("surveillance_events")
				.select("id")
				.where("id", "=", id)
				.executeTakeFirst();

			if (!eventExists) {
				return Result.err("ERR_EVENT_NOT_FOUND");
			}

			await this.db
				.deleteFrom("surveillance_events")
				.where("id", "=", id)
				.execute();

			return Result.ok(Unit);
		} catch (error) {
			this.logger.error("Failed to delete surveillance event", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async count(filters?: {
		sessionId?: string;
		deviceId?: string;
		startDate?: string;
		endDate?: string;
		detected?: boolean;
	}): Promise<Result<number, CreateSurveillanceEventError>> {
		try {
			let query = this.db
				.selectFrom("surveillance_events")
				.select(({ fn }) => fn.countAll<number>().as("count"));

			if (filters?.sessionId) {
				query = query.where("session_id", "=", filters.sessionId);
			}

			if (filters?.deviceId) {
				query = query.where("device_id", "=", filters.deviceId);
			}

			if (filters?.startDate) {
				query = query.where("timestamp", ">=", filters.startDate);
			}

			if (filters?.endDate) {
				query = query.where("timestamp", "<=", filters.endDate);
			}

			if (filters?.detected !== undefined) {
				query = query.where("detected", "=", filters.detected ? 1 : 0);
			}

			const result = await query.executeTakeFirstOrThrow();
			return Result.ok(result.count);
		} catch (error) {
			this.logger.error("Failed to count surveillance events", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}
}
