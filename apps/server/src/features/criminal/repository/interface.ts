import type { Result, Unit } from "true-myth";
import type { Criminal } from "@/types";

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
		payload: Criminal.Insertable,
	): Promise<Result<Criminal.Selectable, CreateCriminalError>>;

	/**
	 * Find a criminal by ID.
	 *
	 * @param id - The criminal ID to look up
	 * @returns Result containing the Criminal.Selectable or null if not found, or an error code
	 */
	public abstract findById(
		id: string,
	): Promise<Result<Criminal.Selectable | null, FindCriminalByIdError>>;

	/**
	 * Update an existing criminal record.
	 *
	 * @param id - The ID of the criminal to update
	 * @param changes - Partial update payload (Criminal.Updateable)
	 * @returns Result containing the updated Criminal.Selectable on success, or an error code
	 */
	public abstract updateById(
		id: string,
		changes: Criminal.Updateable,
	): Promise<Result<Criminal.Selectable, UpdateCriminalByIdError>>;

	/**
	 * Delete a criminal record by ID.
	 *
	 * @param id - The ID of the criminal to delete
	 * @returns Result indicating success (Unit) or an error code
	 */
	public abstract deleteById(
		id: string,
	): Promise<Result<Unit, DeleteCriminalByIdError>>;

	/**
	 * List criminals. Implementations may support filtering/pagination in the future;
	 * for now this returns all criminals.
	 *
	 * @returns Result containing an array of Criminal.Selectable on success, or an error code
	 */
	public abstract listAll(): Promise<
		Result<Criminal.Selectable[], ListCriminalsError>
	>;
}
