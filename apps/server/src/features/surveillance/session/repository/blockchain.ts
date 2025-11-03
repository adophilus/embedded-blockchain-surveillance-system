import { Result, Unit } from "true-myth";
import type {
	SurveillanceSessionRepository,
	CreateSurveillanceSessionError,
	FindSurveillanceSessionByIdError,
	ListSurveillanceSessionsError,
	UpdateSurveillanceSessionStatusByIdError,
} from "./interface";
import type { SurveillanceSession } from "@/types";
import type {
	BlockchainSurveillanceSystem,
	SurveillanceSessionDetails,
} from "@embedded-blockchain-surveillance-system/core";
import type { Writable } from "type-fest";

export class BlockchainSurveillanceSessionRepository
	implements SurveillanceSessionRepository {
	constructor(private readonly system: BlockchainSurveillanceSystem) { }

	public async create(
		payload: SurveillanceSession.Insertable,
	): Promise<
		Result<SurveillanceSession.Selectable, CreateSurveillanceSessionError>
	> {
		const result = await this.system.createSurveillanceSession(
			payload.id,
			payload.title,
			payload.description ?? "",
			BigInt(payload.start_timestamp),
			BigInt(payload.end_timestamp),
			payload.status,
		);

		if (result.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		const findResult = await this.findById(result.value);
		if (findResult.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		if (findResult.value === null) {
			return Result.err("ERR_UNEXPECTED");
		}

		return Result.ok(findResult.value);
	}

	private normalizeSurveillanceSessionDetails(
		surveillanceSessionDetails: SurveillanceSessionDetails,
	): SurveillanceSession.Selectable {
		const { start_timestamp, end_timestamp, created_at, updated_at, ..._rest } =
			surveillanceSessionDetails;

		const surveillanceSession: SurveillanceSession.Selectable = {
			..._rest,
			start_timestamp: Number(start_timestamp),
			end_timestamp: Number(end_timestamp),
			created_at: Number(created_at),
			updated_at: Number(updated_at),
		};

		return surveillanceSession;
	}

	public async findById(
		id: string,
	): Promise<
		Result<
			SurveillanceSession.Selectable | null,
			FindSurveillanceSessionByIdError
		>
	> {
		const result = await this.system.getSurveillanceSession(id);
		if (result.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		const surveillanceSession = this.normalizeSurveillanceSessionDetails(
			result.value,
		);

		return Result.ok(surveillanceSession);
	}

	public async findActiveSession(): Promise<
		Result<
			SurveillanceSession.Selectable | null,
			FindSurveillanceSessionByIdError
		>
	> {
		const result = await this.system.getActiveSurveillanceSession();
		if (result.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		const surveillanceSession = this.normalizeSurveillanceSessionDetails(
			result.value,
		);

		return Result.ok(surveillanceSession);
	}

	public async list(): Promise<
		Result<SurveillanceSession.Selectable[], ListSurveillanceSessionsError>
	> {
		const result = await this.system.listSurveillanceSessions();
		if (result.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		const surveillanceSessions = result.value.map(
			this.normalizeSurveillanceSessionDetails,
		);

		return Result.ok(surveillanceSessions);
	}

	public async updateStatusById(
		id: string,
		status: SurveillanceSession.Insertable["status"],
	): Promise<Result<Unit, UpdateSurveillanceSessionStatusByIdError>> {
		const result = await this.system.updateSurveillanceSessionStatus(
			id,
			status,
		);
		if (result.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		return Result.ok(Unit);
	}
}
