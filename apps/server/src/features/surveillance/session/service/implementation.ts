import { Result, Unit } from "true-myth";
import type {
	SurveillanceSessionService,
	CreateSessionError,
	GetSessionError,
	ListSessionsError,
	UpdateSessionError,
	DeleteSessionError,
	CountSessionsError,
} from "./interface";
import type {
	SurveillanceSessionRepository,
	CreateSurveillanceSessionInput,
	UpdateSurveillanceSessionInput,
} from "../repository";
import type { Logger } from "@/features/logger";

export class SurveillanceSessionServiceImpl
	implements SurveillanceSessionService
{
	constructor(
		private readonly repository: SurveillanceSessionRepository,
		private readonly logger: Logger,
	) {}

	public async create(
		session: CreateSurveillanceSessionInput,
	): Promise<Result<SurveillanceSession, CreateSessionError>> {
		// Validate required fields
		if (
			!session.title ||
			!session.start_timestamp ||
			!session.end_timestamp ||
			!session.status
		) {
			return Result.err("ERR_INVALID_INPUT");
		}

		// Validate timestamps
		const startTimestamp = new Date(session.start_timestamp);
		const endTimestamp = new Date(session.end_timestamp);

		if (isNaN(startTimestamp.getTime()) || isNaN(endTimestamp.getTime())) {
			return Result.err("ERR_INVALID_INPUT");
		}

		if (startTimestamp >= endTimestamp) {
			return Result.err("ERR_INVALID_INPUT");
		}

		const result = await this.repository.create(session);

		if (result.isErr) {
			switch (result.error) {
				case "ERR_INVALID_INPUT":
					return Result.err("ERR_INVALID_INPUT");
				default:
					this.logger.error(
						"Unexpected error creating surveillance session",
						result.error,
					);
					return Result.err("ERR_UNEXPECTED");
			}
		}

		return Result.ok(result.value);
	}

	public async getById(
		id: string,
	): Promise<Result<SurveillanceSession, GetSessionError>> {
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

	public async list(filters?: {
		status?: "UPCOMING" | "ACTIVE" | "COMPLETED";
		page?: number;
		perPage?: number;
	}): Promise<Result<SurveillanceSession[], ListSessionsError>> {
		// Validate pagination parameters
		if (filters?.page !== undefined && filters.page < 1) {
			return Result.err("ERR_INVALID_INPUT");
		}

		if (
			filters?.perPage !== undefined &&
			(filters.perPage < 1 || filters.perPage > 100)
		) {
			return Result.err("ERR_INVALID_INPUT");
		}

		const result = await this.repository.list(filters);

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
		updates: UpdateSurveillanceSessionInput,
	): Promise<Result<Unit, UpdateSessionError>> {
		// Validate that at least one update field is provided
		if (Object.keys(updates).length === 0) {
			return Result.err("ERR_INVALID_INPUT");
		}

		// Validate timestamps if provided
		if (
			updates.start_timestamp !== undefined &&
			isNaN(new Date(updates.start_timestamp).getTime())
		) {
			return Result.err("ERR_INVALID_INPUT");
		}

		if (
			updates.end_timestamp !== undefined &&
			isNaN(new Date(updates.end_timestamp).getTime())
		) {
			return Result.err("ERR_INVALID_INPUT");
		}

		// Validate start_timestamp is before end_timestamp if both are provided
		if (
			updates.start_timestamp !== undefined &&
			updates.end_timestamp !== undefined
		) {
			const startTimestamp = new Date(updates.start_timestamp);
			const endTimestamp = new Date(updates.end_timestamp);

			if (startTimestamp >= endTimestamp) {
				return Result.err("ERR_INVALID_INPUT");
			}
		}

		const result = await this.repository.updateById(id, updates);

		if (result.isErr) {
			switch (result.error) {
				case "ERR_SESSION_NOT_FOUND":
					return Result.err("ERR_SESSION_NOT_FOUND");
				case "ERR_INVALID_INPUT":
					return Result.err("ERR_INVALID_INPUT");
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
				case "ERR_SESSION_NOT_FOUND":
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

	public async count(filters?: {
		status?: "UPCOMING" | "ACTIVE" | "COMPLETED";
	}): Promise<Result<number, CountSessionsError>> {
		const result = await this.repository.count(filters);

		if (result.isErr) {
			this.logger.error(
				"Unexpected error counting surveillance sessions",
				result.error,
			);
			return Result.err("ERR_UNEXPECTED");
		}

		return Result.ok(result.value);
	}
}
