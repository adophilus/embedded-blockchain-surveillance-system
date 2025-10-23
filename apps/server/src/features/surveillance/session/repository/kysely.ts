import { Result, Unit } from "true-myth";
import type {
	SurveillanceSessionRepository,
	CreateSurveillanceSessionError,
	FindSurveillanceSessionByIdError,
	ListSurveillanceSessionsError,
	UpdateSurveillanceSessionByIdError,
	DeleteSurveillanceSessionByIdError,
} from "./interface";
import type { KyselyClient } from "@/features/database/kysely";
import type { Logger } from "@/features/logger";
import type { SurveillanceSession } from "@/types";
import { ulid } from "ulidx";

export class KyselySurveillanceSessionRepository
	implements SurveillanceSessionRepository
{
	constructor(
		private readonly db: KyselyClient,
		private readonly logger: Logger,
	) {}

	public async create(
		session: SurveillanceSession.Insertable,
	): Promise<
		Result<SurveillanceSession.Selectable, CreateSurveillanceSessionError>
	> {
		try {
			const newSession = await this.db
				.insertInto("surveillance_sessions")
				.values({
					...session,
					id: ulid(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			return Result.ok(newSession);
		} catch (error) {
			this.logger.error("Failed to create surveillance session", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async findById(
		id: string,
	): Promise<
		Result<
			SurveillanceSession.Selectable | null,
			FindSurveillanceSessionByIdError
		>
	> {
		try {
			const session = await this.db
				.selectFrom("surveillance_sessions")
				.selectAll()
				.where("id", "=", id)
				.executeTakeFirst();

			return Result.ok(session || null);
		} catch (error) {
			this.logger.error("Failed to find surveillance session by ID", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async list(): Promise<
		Result<SurveillanceSession.Selectable[], ListSurveillanceSessionsError>
	> {
		try {
			const sessions = this.db
				.selectFrom("surveillance_sessions")
				.selectAll()
				.orderBy("created_at", "desc")
				.execute();

			return Result.ok(sessions);
		} catch (error) {
			this.logger.error("Failed to list surveillance sessions", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async updateById(
		id: string,
		payload: SurveillanceSession.Updateable,
	): Promise<Result<Unit, UpdateSurveillanceSessionByIdError>> {
		try {
			const update = await this.db
				.updateTable("surveillance_sessions")
				.set(payload)
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirst();

			if (!update) {
				return Result.err("ERR_NOT_FOUND");
			}

			return Result.ok(Unit);
		} catch (error) {
			this.logger.error("Failed to update surveillance session", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async deleteById(
		id: string,
	): Promise<Result<Unit, DeleteSurveillanceSessionByIdError>> {
		try {
			const deleted = await this.db
				.deleteFrom("surveillance_sessions")
				.where("id", "=", id)
				.returningAll()
				.executeTakeFirst();

			if (!deleted) {
				return Result.err("ERR_NOT_FOUND");
			}

			return Result.ok(Unit);
		} catch (error) {
			this.logger.error("Failed to delete surveillance session", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}
}
