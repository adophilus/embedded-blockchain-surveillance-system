import { Result, type Unit } from "true-myth";
import type {
	CreateCriminalError,
	FindCriminalByIdError,
	UpdateCriminalByIdError,
	DeleteCriminalByIdError,
	ListCriminalsError,
	CriminalProfileRepository,
} from "./interface";
import type { KyselyClient } from "@/features/database/kysely";
import type { Logger } from "@/features/logger";
import type { CriminalProfile } from "@/types";

export class KyselyCriminalProfileRepository
	implements CriminalProfileRepository
{
	constructor(
		private readonly db: KyselyClient,
		private readonly logger: Logger,
	) {}

	public async create(
		payload: CriminalProfile.Insertable,
	): Promise<Result<CriminalProfile.Selectable, CreateCriminalError>> {
		try {
			const inserted = await this.db
				.insertInto("criminals")
				.values(payload)
				.returningAll()
				.executeTakeFirstOrThrow();

			return Result.ok(inserted);
		} catch (error) {
			this.logger.error("Failed to create criminal", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async findById(
		id: string,
	): Promise<Result<CriminalProfile.Selectable | null, FindCriminalByIdError>> {
		try {
			const row = await this.db
				.selectFrom("criminals")
				.selectAll()
				.where("criminals.id", "=", id)
				.executeTakeFirst();

			return Result.ok(row ?? null);
		} catch (error) {
			this.logger.error("Failed to find criminal by id", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async updateById(
		id: string,
		changes: CriminalProfile.Updateable,
	): Promise<Result<CriminalProfile.Selectable, UpdateCriminalByIdError>> {
		try {
			const updated = await this.db
				.updateTable("criminals")
				.set(changes)
				.where("criminals.id", "=", id)
				.returningAll()
				.executeTakeFirst();

			if (!updated) {
				return Result.err("ERR_CRIMINAL_NOT_FOUND");
			}

			return Result.ok(updated);
		} catch (error) {
			this.logger.error("Failed to update criminal", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async deleteById(
		id: string,
	): Promise<Result<Unit, DeleteCriminalByIdError>> {
		try {
			const deleted = await this.db
				.deleteFrom("criminals")
				.where("criminals.id", "=", id)
				.returningAll()
				.executeTakeFirst();

			if (!deleted) {
				return Result.err("ERR_CRIMINAL_NOT_FOUND");
			}

			return Result.ok();
		} catch (error) {
			this.logger.error("Failed to delete criminal", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async list(): Promise<
		Result<CriminalProfile.Selectable[], ListCriminalsError>
	> {
		try {
			const rows = await this.db.selectFrom("criminals").selectAll().execute();
			return Result.ok(rows);
		} catch (error) {
			this.logger.error("Failed to list criminals", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}
}
