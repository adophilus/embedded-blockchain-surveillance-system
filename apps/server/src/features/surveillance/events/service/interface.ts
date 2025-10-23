import type { Result, Unit } from "true-myth";
import type { SurveillanceEvent, CreateSurveillanceEventInput, UpdateSurveillanceEventInput } from "../repository";

export type CreateEventError = 
  | "ERR_INVALID_INPUT"
  | "ERR_SESSION_NOT_FOUND"
  | "ERR_DEVICE_NOT_FOUND"
  | "ERR_UNEXPECTED";

export type GetEventError = 
  | "ERR_EVENT_NOT_FOUND"
  | "ERR_UNEXPECTED";

export type ListEventsError = 
  | "ERR_INVALID_INPUT"
  | "ERR_UNEXPECTED";

export type UpdateEventError = 
  | "ERR_EVENT_NOT_FOUND"
  | "ERR_INVALID_INPUT"
  | "ERR_UNEXPECTED";

export type DeleteEventError = 
  | "ERR_EVENT_NOT_FOUND"
  | "ERR_UNEXPECTED";

export type CountEventsError = 
  | "ERR_UNEXPECTED";

export abstract class SurveillanceEventService {
  /**
   * Create a new surveillance event
   * @param event - The surveillance event data
   * @returns Result containing the created event or error
   */
  public abstract create(
    event: CreateSurveillanceEventInput
  ): Promise<Result<SurveillanceEvent, CreateEventError>>;

  /**
   * Get a surveillance event by its ID
   * @param id - The ID of the surveillance event
   * @returns Result containing the event or error
   */
  public abstract getById(
    id: string
  ): Promise<Result<SurveillanceEvent, GetEventError>>;

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
  ): Promise<Result<SurveillanceEvent[], ListEventsError>>;

  /**
   * Update a surveillance event
   * @param id - The ID of the surveillance event to update
   * @param updates - The updates to apply
   * @returns Result indicating success or failure
   */
  public abstract update(
    id: string,
    updates: UpdateSurveillanceEventInput
  ): Promise<Result<Unit, UpdateEventError>>;

  /**
   * Delete a surveillance event
   * @param id - The ID of the surveillance event to delete
   * @returns Result indicating success or failure
   */
  public abstract delete(
    id: string
  ): Promise<Result<Unit, DeleteEventError>>;

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
  ): Promise<Result<number, CountEventsError>>;
}