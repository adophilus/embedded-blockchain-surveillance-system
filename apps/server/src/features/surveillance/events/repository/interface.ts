import type { Result, Unit } from "true-myth";
import type { SurveillanceEvent } from "@/types";

export type CreateSurveillanceEventError = "ERR_UNEXPECTED";
export type FindSurveillanceEventByIdError = "ERR_UNEXPECTED";
export type ListSurveillanceEventsError = "ERR_UNEXPECTED";
export type UpdateSurveillanceEventError = "ERR_UNEXPECTED";
export type DeleteSurveillanceEventError = "ERR_UNEXPECTED";

export abstract class SurveillanceEventRepository {
	/**
	 * Create a new surveillance event
	 * @param event - The surveillance event data
	 * @returns Result containing the created event or error
	 */
	public abstract create(
		event: SurveillanceEvent.Insertable,
	): Promise<
		Result<SurveillanceEvent.Selectable, CreateSurveillanceEventError>
	>;

	/**
	 * Find a surveillance event by its ID
	 * @param id - The ID of the surveillance event
	 * @returns Result containing the event or error
	 */
	public abstract findById(
		id: string,
	): Promise<
		Result<SurveillanceEvent.Selectable | null, FindSurveillanceEventByIdError>
	>;

	/**
	 * List surveillance events
	 * @returns Result containing array of events or error
	 */
	public abstract list(): Promise<
		Result<SurveillanceEvent.Selectable[], ListSurveillanceEventsError>
	>;

	/**
	 * Update a surveillance event
	 * @param id - The ID of the surveillance event to update
	 * @param updates - The updates to apply
	 * @returns Result indicating success or failure
	 */
	public abstract update(
		id: string,
		updates: SurveillanceEvent.Updateable,
	): Promise<Result<Unit, UpdateSurveillanceEventError>>;

	/**
	 * Delete a surveillance event
	 * @param id - The ID of the surveillance event to delete
	 * @returns Result indicating success or failure
	 */
	public abstract delete(
		id: string,
	): Promise<Result<Unit, DeleteSurveillanceEventError>>;
}
