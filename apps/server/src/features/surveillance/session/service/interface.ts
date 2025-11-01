import type { Result, Unit } from "true-myth";
import type { SurveillanceSession } from "@/types";

export type CreateSessionError = "ERR_UNEXPECTED";
export type GetSessionError = "ERR_SESSION_NOT_FOUND" | "ERR_UNEXPECTED";
export type ListSessionsError = "ERR_UNEXPECTED";
export type UpdateSessionStatusByIdError =
	| "ERR_SESSION_NOT_FOUND"
	| "ERR_UNEXPECTED";
export type GetActiveSessionError = "ERR_NO_ACTIVE_SESSION" | "ERR_UNEXPECTED";
export type RotateActiveSessionError =
	| "ERR_NO_ACTIVE_SESSION"
	| "ERR_UNEXPECTED";

export abstract class SurveillanceSessionService {
	/**
	 * Create a new surveillance session
	 * @param session - The surveillance session data
	 * @returns Result containing the created session or error
	 */
	public abstract create(
		session: SurveillanceSession.Insertable,
	): Promise<Result<SurveillanceSession.Selectable, CreateSessionError>>;

	/**
	 * Get a surveillance session by its ID
	 * @param id - The ID of the surveillance session
	 * @returns Result containing the session or error
	 */
	public abstract getById(
		id: string,
	): Promise<Result<SurveillanceSession.Selectable, GetSessionError>>;

	/**
	 * Get active surveillance sessioni
	 * @returns Result containing the session or error
	 */
	public abstract getActiveSession(): Promise<
		Result<SurveillanceSession.Selectable, GetActiveSessionError>
	>;

	/**
	 * List surveillance sessions
	 * @returns Result containing array of sessions or error
	 */
	public abstract list(): Promise<
		Result<SurveillanceSession.Selectable[], ListSessionsError>
	>;

	/**
	 * Rotate the active surveillance session
	 * @returns Result containing the session or error
	 */
	public abstract rotateActiveSession(): Promise<
		Result<SurveillanceSession.Selectable, RotateActiveSessionError>
	>;
}
