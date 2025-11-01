import type { SurveillanceSession } from "@/types";
import type { Result, Unit } from "true-myth";

export type CreateSurveillanceSessionError = "ERR_UNEXPECTED";
export type FindSurveillanceSessionByIdError = "ERR_UNEXPECTED";
export type ListSurveillanceSessionsError = "ERR_UNEXPECTED";
export type UpdateSurveillanceSessionStatusByIdError =
	| "ERR_NOT_FOUND"
	| "ERR_UNEXPECTED";
export type DeleteSurveillanceSessionByIdError =
	| "ERR_NOT_FOUND"
	| "ERR_UNEXPECTED";

export abstract class SurveillanceSessionRepository {
	/**
	 * Create a new surveillance session
	 * @param payload - The surveillance session data
	 * @returns Result containing the created session or error
	 */
	public abstract create(
		payload: SurveillanceSession.Insertable,
	): Promise<
		Result<SurveillanceSession.Selectable, CreateSurveillanceSessionError>
	>;

	/**
	 * Find a surveillance session by its ID
	 * @param id - The ID of the surveillance session
	 * @returns Result containing the session or error
	 */
	public abstract findById(
		id: string,
	): Promise<
		Result<
			SurveillanceSession.Selectable | null,
			FindSurveillanceSessionByIdError
		>
	>;

	/**
	 * Find the active surveillance session
	 * @returns Result containing the session or error
	 */
	public abstract findActiveSession(): Promise<
		Result<
			SurveillanceSession.Selectable | null,
			FindSurveillanceSessionByIdError
		>
	>;

	/**
	 * List surveillance sessions with optional filtering
	 * @param filters - Optional filters for the sessions
	 * @returns Result containing array of sessions or error
	 */
	public abstract list(): Promise<
		Result<SurveillanceSession.Selectable[], ListSurveillanceSessionsError>
	>;

	/**
	 * Update a surveillance session status by id
	 * @param id - The ID of the surveillance session to update
	 * @param status - The status to update to
	 * @returns Result indicating success or failure
	 */
	public abstract updateStatusById(
		id: string,
		status: SurveillanceSession.Insertable["status"],
	): Promise<Result<Unit, UpdateSurveillanceSessionStatusByIdError>>;
}
