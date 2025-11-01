import type { Result } from "true-myth";
import type { CriminalProfile } from "@/types";

export type CreateCriminalError = "ERR_UNEXPECTED";
export type FindCriminalByIdError = "ERR_UNEXPECTED";
export type UpdateCriminalByIdError =
	| "ERR_CRIMINAL_NOT_FOUND"
	| "ERR_UNEXPECTED";
export type DeleteCriminalByIdError =
	| "ERR_CRIMINAL_NOT_FOUND"
	| "ERR_UNEXPECTED";
export type ListCriminalsError = "ERR_UNEXPECTED";

export abstract class CriminalProfileRepository {
	/**
	 * Create a new criminal record.
	 *
	 * @param payload - Criminal.Insertable payload to persist
	 * @returns Result containing the created Criminal.Selectable on success, or an error code
	 */
	public abstract create(
		payload: CriminalProfile.Insertable,
	): Promise<Result<CriminalProfile.Selectable, CreateCriminalError>>;

	/**
	 * Find a criminal by ID.
	 *
	 * @param id - The criminal ID to look up
	 * @returns Result containing the Criminal.Selectable or null if not found, or an error code
	 */
	public abstract findById(
		id: string,
	): Promise<Result<CriminalProfile.Selectable | null, FindCriminalByIdError>>;

	/**
	 * List criminals. Implementations may support filtering/pagination in the future;
	 * for now this returns all criminals.
	 *
	 * @returns Result containing an array of Criminal.Selectable on success, or an error code
	 */
	public abstract list(): Promise<
		Result<CriminalProfile.Selectable[], ListCriminalsError>
	>;
}
