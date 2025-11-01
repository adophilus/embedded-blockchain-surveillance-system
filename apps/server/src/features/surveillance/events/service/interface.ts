import type { Result } from "true-myth";
import type { SurveillanceEvent } from "@/types";

export type CreateEventError = "ERR_UNEXPECTED";
export type GetEventError = "ERR_EVENT_NOT_FOUND" | "ERR_UNEXPECTED";
export type ListEventsError = "ERR_UNEXPECTED";

export abstract class SurveillanceEventService {
	/**
	 * Create a new surveillance event
	 * @param event - The surveillance event data
	 * @returns Result containing the created event or error
	 */
	public abstract create(
		event: SurveillanceEvent.Insertable,
	): Promise<Result<SurveillanceEvent.Selectable, CreateEventError>>;

	/**
	 * Get a surveillance event by its ID
	 * @param id - The ID of the surveillance event
	 * @returns Result containing the event or error
	 */
	public abstract getById(
		id: string,
	): Promise<Result<SurveillanceEvent.Selectable, GetEventError>>;

	/**
	 * List surveillance events
	 * @returns Result containing array of events or error
	 */
	public abstract list(): Promise<
		Result<SurveillanceEvent.Selectable[], ListEventsError>
	>;
}
