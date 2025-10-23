import type { Result, Unit } from "true-myth";
import type {
	SurveillanceSession,
	CreateSurveillanceSessionInput,
	UpdateSurveillanceSessionInput,
} from "../repository";

export type CreateSessionError = "ERR_INVALID_INPUT" | "ERR_UNEXPECTED";

export type GetSessionError = "ERR_SESSION_NOT_FOUND" | "ERR_UNEXPECTED";

export type ListSessionsError = "ERR_INVALID_INPUT" | "ERR_UNEXPECTED";

export type UpdateSessionError =
	| "ERR_SESSION_NOT_FOUND"
	| "ERR_INVALID_INPUT"
	| "ERR_UNEXPECTED";

export type DeleteSessionError = "ERR_SESSION_NOT_FOUND" | "ERR_UNEXPECTED";

export type CountSessionsError = "ERR_UNEXPECTED";

export abstract class SurveillanceSessionService {
	/**
	 * Create a new surveillance session
	 * @param session - The surveillance session data
	 * @returns Result containing the created session or error
	 */
	public abstract create(
		session: CreateSurveillanceSessionInput,
	): Promise<Result<SurveillanceSession, CreateSessionError>>;

	/**
	 * Get a surveillance session by its ID
	 * @param id - The ID of the surveillance session
	 * @returns Result containing the session or error
	 */
	public abstract getById(
		id: string,
	): Promise<Result<SurveillanceSession, GetSessionError>>;

	/**
	 * List surveillance sessions
	 * @returns Result containing array of sessions or error
	 */
	public abstract list(): Promise<
		Result<SurveillanceSession[], ListSessionsError>
	>;

	/**
	 * Update a surveillance session
	 * @param id - The ID of the surveillance session to update
	 * @param updates - The updates to apply
	 * @returns Result indicating success or failure
	 */
	public abstract update(
		id: string,
		updates: UpdateSurveillanceSessionInput,
	): Promise<Result<Unit, UpdateSessionError>>;

	/**
	 * Delete a surveillance session
	 * @param id - The ID of the surveillance session to delete
	 * @returns Result indicating success or failure
	 */
	public abstract delete(id: string): Promise<Result<Unit, DeleteSessionError>>;

	/**
	 * Count surveillance sessions with optional filtering
	 * @param filters - Optional filters for counting sessions
	 * @returns Result containing the count or error
	 */
	public abstract count(filters?: {
		status?: "UPCOMING" | "ACTIVE" | "COMPLETED";
	}): Promise<Result<number, CountSessionsError>>;
}
