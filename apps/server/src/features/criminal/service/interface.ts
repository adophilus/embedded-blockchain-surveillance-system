import type { Result } from "true-myth";
import type { CriminalProfile } from "@/types";

export type CreateCriminalProfileServiceError =
	| "ERR_INVALID_PAYLOAD"
	| "ERR_UNEXPECTED";
export type FindCriminalProfileByIdServiceError = "ERR_UNEXPECTED";

export type DetectCriminalsInStreamServiceSuccess = {
	detected: boolean;
	matches: Array<{
		criminal: CriminalProfile.Selectable;
		confidence: number;
		boundingBox?: {
			x: number;
			y: number;
			width: number;
			height: number;
		};
	}>;
};
export type DetectCriminalsInStreamServiceError =
	| "ERR_UNEXPECTED"
	| "ERR_IMAGE_PROCESSING_FAILED"
	| "ERR_AI_SERVICE_UNAVAILABLE";

export abstract class CriminalProfileService {
	/**
	 * Create a new criminal profile.
	 *
	 * @param payload - Criminal.Insertable payload to persist
	 * @returns Result containing the created Criminal.Selectable on success, or an error code
	 */
	public abstract create(
		payload: CriminalProfile.Insertable,
	): Promise<Result<CriminalProfile.Selectable, CreateCriminalProfileServiceError>>;

	/**
	 * Get a criminal profile by ID.
	 *
	 * @param id - The criminal ID to look up
	 * @returns Result containing the Criminal.Selectable or null if not found, or an error code
	 */
	public abstract findById(
		id: string,
	): Promise<
		Result<CriminalProfile.Selectable | null, FindCriminalProfileByIdServiceError>
	>;

	/**
	 * Detect if any known criminals are present in a surveillance stream image.
	 *
	 * @param imageData - The image data from the surveillance stream
	 * @returns Result containing detection results with criminal matches and confidence scores, or an error code
	 */
	public abstract detectCriminalsInStream(
		stream: ArrayBuffer,
	): Promise<
		Result<
			DetectCriminalsInStreamServiceSuccess,
			DetectCriminalsInStreamServiceError
		>
	>;
}
