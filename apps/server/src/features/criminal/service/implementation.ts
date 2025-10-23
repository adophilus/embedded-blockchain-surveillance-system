import { Result } from "true-myth";
import type {
	CriminalProfileService,
	CreateCriminalProfileServiceError,
	FindCriminalProfileByIdServiceError,
	DetectCriminalsInStreamServiceError,
	DetectCriminalsInStreamServiceSuccess,
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

	public async detectCriminalsInStream(
		stream: ArrayBuffer,
	): Promise<
		Result<
			DetectCriminalsInStreamServiceSuccess,
			DetectCriminalsInStreamServiceError
		>
	> {
		try {
			// TODO: Implement face detection and recognition using face-api.js
			// This is a placeholder implementation until the AI dependencies are properly set up

			this.logger.info(
				"Criminal detection requested - placeholder implementation",
			);

			// Validate input
			if (!stream || stream.byteLength === 0) {
				this.logger.error("Invalid stream data received");
				return Result.err("ERR_IMAGE_PROCESSING_FAILED");
			}

			// Get all criminal profiles for potential matching
			const criminalsResult = await this.repository.list();
			if (criminalsResult.isErr) {
				this.logger.error(
					"Failed to load criminal profiles",
					criminalsResult.error,
				);
				return Result.err("ERR_UNEXPECTED");
			}

			const criminals = criminalsResult.value;

			// For now, return no detections as this is a placeholder
			// In the real implementation, this would:
			// 1. Load face-api.js models
			// 2. Convert ArrayBuffer to image
			// 3. Detect faces in the image
			// 4. Match faces against criminal mugshots
			// 5. Return matches with confidence scores and bounding boxes

			this.logger.info(
				`Loaded ${criminals.length} criminal profiles for matching`,
			);

			return Result.ok({
				detected: false,
				matches: [],
			});
		} catch (error) {
			this.logger.error("Error in criminal detection", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}
}
