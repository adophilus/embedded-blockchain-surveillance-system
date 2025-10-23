import { Result } from "true-myth";
import type {
	CriminalProfileService,
	CreateCriminalProfileServiceError,
	FindCriminalProfileByIdServiceError,
} from "./interface";
import type { CriminalProfileRepository } from "../repository";
import type { Logger } from "@/features/logger";
import type { Criminal } from "@/types";

export class CriminalProfileServiceImplementation
	implements CriminalProfileService
{
	constructor(
		private readonly repository: CriminalProfileRepository,
		private readonly logger: Logger,
	) {}

	public async create(
		payload: Criminal.Insertable,
	): Promise<Result<Criminal.Selectable, CreateCriminalProfileServiceError>> {
		const res = await this.repository.create(payload);
		if (res.isErr) {
			this.logger.error("Repository failed to create criminal", res.error);
			return Result.err("ERR_UNEXPECTED");
		}
		return Result.ok(res.value);
	}

	public async findById(
		id: string,
	): Promise<
		Result<Criminal.Selectable | null, FindCriminalProfileByIdServiceError>
	> {
		try {
			const res = await this.repository.findById(id);
			if (res.isErr) {
				this.logger.error(
					"Repository failed to find criminal by id",
					res.error,
				);
				return Result.err("ERR_UNEXPECTED");
			}
			return Result.ok(res.value);
		} catch (error) {
			this.logger.error("Unexpected error finding criminal by id", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}
}
