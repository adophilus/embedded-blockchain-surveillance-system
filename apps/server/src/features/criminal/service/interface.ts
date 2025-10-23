import type { Result } from "true-myth";
import type { Criminal } from "@/types";

export type CreateCriminalProfileServiceError =
	| "ERR_INVALID_PAYLOAD"
	| "ERR_UNEXPECTED";
export type FindCriminalProfileByIdServiceError = "ERR_UNEXPECTED";

export abstract class CriminalProfileService {
	/**
	 * Create a new criminal profile.
	 *
	 * @param payload - Criminal.Insertable payload to persist
	 * @returns Result containing the created Criminal.Selectable on success, or an error code
	 */
	public abstract create(
		payload: Criminal.Insertable,
	): Promise<Result<Criminal.Selectable, CreateCriminalProfileServiceError>>;

	/**
	 * Get a criminal profile by ID.
	 *
	 * @param id - The criminal ID to look up
	 * @returns Result containing the Criminal.Selectable or null if not found, or an error code
	 */
	public abstract findById(
		id: string,
	): Promise<
		Result<Criminal.Selectable | null, FindCriminalProfileByIdServiceError>
	>;
}
