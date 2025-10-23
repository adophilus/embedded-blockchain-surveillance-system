import type { Result, Unit } from "true-myth";

export type SurveillanceEvent = {
  id: string;
  session_id: string;
  device_id: string;
  timestamp: string;
  detected: boolean;
  media_source: string | null;
  media_id: string | null;
  media_url: string | null;
  created_at: string;
};

export type CreateSurveillanceEventInput = Omit<SurveillanceEvent, "id" | "created_at">;
export type UpdateSurveillanceEventInput = Partial<Omit<SurveillanceEvent, "id" | "created_at" | "session_id" | "device_id">>;

export type SurveillanceEventRepositoryError = 
  | "ERR_EVENT_NOT_FOUND"
  | "ERR_SESSION_NOT_FOUND"
  | "ERR_DEVICE_NOT_FOUND"
  | "ERR_INVALID_INPUT"
  | "ERR_UNEXPECTED";

export abstract class SurveillanceEventRepository {
  /**
   * Create a new surveillance event
   * @param event - The surveillance event data
   * @returns Result containing the created event or error
   */
  public abstract create(
    event: CreateSurveillanceEventInput
  ): Promise<Result<SurveillanceEvent, SurveillanceEventRepositoryError>>;

  /**
   * Find a surveillance event by its ID
   * @param id - The ID of the surveillance event
   * @returns Result containing the event or error
   */
  public abstract findById(
    id: string
  ): Promise<Result<SurveillanceEvent | null, SurveillanceEventRepositoryError>>;

  /**
   * List surveillance events with optional filtering
   * @param filters - Optional filters for the events
   * @returns Result containing array of events or error
   */
  public abstract list(
    filters?: {
      sessionId?: string;
      deviceId?: string;
      startDate?: string;
      endDate?: string;
      detected?: boolean;
      page?: number;
      perPage?: number;
    }
  ): Promise<Result<SurveillanceEvent[], SurveillanceEventRepositoryError>>;

  /**
   * Update a surveillance event
   * @param id - The ID of the surveillance event to update
   * @param updates - The updates to apply
   * @returns Result indicating success or failure
   */
  public abstract update(
    id: string,
    updates: UpdateSurveillanceEventInput
  ): Promise<Result<Unit, SurveillanceEventRepositoryError>>;

  /**
   * Delete a surveillance event
   * @param id - The ID of the surveillance event to delete
   * @returns Result indicating success or failure
   */
  public abstract delete(
    id: string
  ): Promise<Result<Unit, SurveillanceEventRepositoryError>>;

  /**
   * Count surveillance events with optional filtering
   * @param filters - Optional filters for counting events
   * @returns Result containing the count or error
   */
  public abstract count(
    filters?: {
      sessionId?: string;
      deviceId?: string;
      startDate?: string;
      endDate?: string;
      detected?: boolean;
    }
  ): Promise<Result<number, SurveillanceEventRepositoryError>>;
}