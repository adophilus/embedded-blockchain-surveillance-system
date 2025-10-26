import { Result, Unit } from "true-myth";
import type {
	SurveillanceSessionService,
	CreateSessionError,
	GetSessionError,
	ListSessionsError,
	UpdateSessionError,
	DeleteSessionError,
	GetActiveSessionError,
	RotateActiveSessionError,
} from "./interface";
import type { SurveillanceSessionRepository } from "../repository";
import type { Logger } from "@/features/logger";
import type { SurveillanceSession } from "@/types";
import { ulid } from "ulidx";
import { addDays, getUnixTime, startOfDay } from "date-fns";

export class SurveillanceSessionServiceImpl
	implements SurveillanceSessionService
{
	constructor(
		private readonly repository: SurveillanceSessionRepository,
		private readonly logger: Logger,
	) {}

	private getNextDayMidnightTimestamp(timestamp: number): number {
		const nextDay = addDays(timestamp, 1);
		const midnightNextDay = startOfDay(nextDay);
		return getUnixTime(midnightNextDay);
	}

	public async getActiveSession(): Promise<
		Result<SurveillanceSession.Selectable, GetActiveSessionError>
	> {
		const result = await this.repository.findActiveSession();

		if (result.isErr) {
			this.logger.error(
				"Unexpected error retrieving active surveillance session",
				result.error,
			);
			return Result.err("ERR_UNEXPECTED");
		}

		if (result.value === null) {
			return Result.err("ERR_NO_ACTIVE_SESSION");
		}

		return Result.ok(result.value);
	}

	public async rotateActiveSession(): Promise<
		Result<SurveillanceSession.Selectable, RotateActiveSessionError>
	> {
		const findActiveSessionResult = await this.repository.findActiveSession();

		if (findActiveSessionResult.isErr) {
			this.logger.error(
				"Unexpected error retrieving active surveillance session for rotation",
				findActiveSessionResult.error,
			);
			return Result.err("ERR_UNEXPECTED");
		}

		if (findActiveSessionResult.value === null) {
			return Result.err("ERR_NO_ACTIVE_SESSION");
		}

		const deactivateResult = await this.repository.updateById(
			findActiveSessionResult.value.id,
			{ status: "COMPLETED" },
		);

		if (deactivateResult.isErr) {
			this.logger.error(
				"Unexpected error deactivating current active surveillance session",
				deactivateResult.error,
			);
			return Result.err("ERR_UNEXPECTED");
		}

		const startTimestamp = getUnixTime(new Date());

		const newSessionResult = await this.repository.create({
			id: ulid(),
			title: "Routine surveillance focusing on known organized crime areas.",
			end_timestamp: this.getNextDayMidnightTimestamp(startTimestamp),
			start_timestamp: startTimestamp,
			status: "ACTIVE",
		});

		if (newSessionResult.isErr) {
			this.logger.error(
				"Unexpected error creating new active surveillance session",
				newSessionResult.error,
			);
			return Result.err("ERR_UNEXPECTED");
		}

		return Result.ok(newSessionResult.value);
	}

	public async create(
		session: SurveillanceSession.Insertable,
	): Promise<Result<SurveillanceSession.Selectable, CreateSessionError>> {
		const result = await this.repository.create(session);

		if (result.isErr) {
			this.logger.error(
				"Unexpected error creating surveillance session",
				result.error,
			);
			return Result.err("ERR_UNEXPECTED");
		}

		return Result.ok(result.value);
	}

	public async getById(
		id: string,
	): Promise<Result<SurveillanceSession.Selectable, GetSessionError>> {
		const result = await this.repository.findById(id);

		if (result.isErr) {
			this.logger.error(
				"Unexpected error getting surveillance session by ID",
				result.error,
			);
			return Result.err("ERR_UNEXPECTED");
		}

		if (result.value === null) {
			return Result.err("ERR_SESSION_NOT_FOUND");
		}

		return Result.ok(result.value);
	}

	public async list(): Promise<
		Result<SurveillanceSession.Selectable[], ListSessionsError>
	> {
		const result = await this.repository.list();

		if (result.isErr) {
			this.logger.error(
				"Unexpected error listing surveillance sessions",
				result.error,
			);
			return Result.err("ERR_UNEXPECTED");
		}

		return Result.ok(result.value);
	}

	public async update(
		id: string,
		updates: SurveillanceSession.Updateable,
	): Promise<Result<Unit, UpdateSessionError>> {
		const result = await this.repository.updateById(id, updates);

		if (result.isErr) {
			switch (result.error) {
				case "ERR_NOT_FOUND":
					return Result.err("ERR_SESSION_NOT_FOUND");
				default:
					this.logger.error(
						"Unexpected error updating surveillance session",
						result.error,
					);
					return Result.err("ERR_UNEXPECTED");
			}
		}

		return Result.ok(Unit);
	}

	public async delete(id: string): Promise<Result<Unit, DeleteSessionError>> {
		const result = await this.repository.deleteById(id);

		if (result.isErr) {
			switch (result.error) {
				case "ERR_NOT_FOUND":
					return Result.err("ERR_SESSION_NOT_FOUND");
				default:
					this.logger.error(
						"Unexpected error deleting surveillance session",
						result.error,
					);
					return Result.err("ERR_UNEXPECTED");
			}
		}

		return Result.ok(Unit);
	}
}
