import { Result, Unit } from "true-myth";
import type {
  SurveillanceEventService,
  CreateEventError,
  GetEventError,
  ListEventsError,
  UpdateEventError,
  DeleteEventError,
  CountEventsError,
} from "./interface";
import type {
  SurveillanceEventRepository,
  CreateSurveillanceEventInput,
  UpdateSurveillanceEventInput,
} from "../repository";
import type { Logger } from "@/features/logger";

export class SurveillanceEventServiceImpl implements SurveillanceEventService {
  constructor(
    private readonly repository: SurveillanceEventRepository,
    private readonly logger: Logger,
  ) {}

  public async create(
    event: CreateSurveillanceEventInput
  ): Promise<Result<SurveillanceEvent, CreateEventError>> {
    // Validate required fields
    if (!event.session_id || !event.device_id || !event.timestamp) {
      return Result.err("ERR_INVALID_INPUT");
    }

    const result = await this.repository.create(event);

    if (result.isErr) {
      switch (result.error) {
        case "ERR_SESSION_NOT_FOUND":
          return Result.err("ERR_SESSION_NOT_FOUND");
        case "ERR_DEVICE_NOT_FOUND":
          return Result.err("ERR_DEVICE_NOT_FOUND");
        case "ERR_INVALID_INPUT":
          return Result.err("ERR_INVALID_INPUT");
        default:
          this.logger.error("Unexpected error creating surveillance event", result.error);
          return Result.err("ERR_UNEXPECTED");
      }
    }

    return Result.ok(result.value);
  }

  public async getById(
    id: string
  ): Promise<Result<SurveillanceEvent, GetEventError>> {
    const result = await this.repository.findById(id);

    if (result.isErr) {
      this.logger.error("Unexpected error getting surveillance event by ID", result.error);
      return Result.err("ERR_UNEXPECTED");
    }

    if (result.value === null) {
      return Result.err("ERR_EVENT_NOT_FOUND");
    }

    return Result.ok(result.value);
  }

  public async list(
    filters?: {
      sessionId?: string;
      deviceId?: string;
      startDate?: string;
      endDate?: string;
      detected?: boolean;
      page?: number;
      perPage?: number;
    }
  ): Promise<Result<SurveillanceEvent[], ListEventsError>> {
    // Validate pagination parameters
    if (filters?.page !== undefined && filters.page < 1) {
      return Result.err("ERR_INVALID_INPUT");
    }

    if (filters?.perPage !== undefined && (filters.perPage < 1 || filters.perPage > 100)) {
      return Result.err("ERR_INVALID_INPUT");
    }

    const result = await this.repository.list(filters);

    if (result.isErr) {
      this.logger.error("Unexpected error listing surveillance events", result.error);
      return Result.err("ERR_UNEXPECTED");
    }

    return Result.ok(result.value);
  }

  public async update(
    id: string,
    updates: UpdateSurveillanceEventInput
  ): Promise<Result<Unit, UpdateEventError>> {
    // Validate that at least one update field is provided
    if (Object.keys(updates).length === 0) {
      return Result.err("ERR_INVALID_INPUT");
    }

    const result = await this.repository.update(id, updates);

    if (result.isErr) {
      switch (result.error) {
        case "ERR_EVENT_NOT_FOUND":
          return Result.err("ERR_EVENT_NOT_FOUND");
        case "ERR_INVALID_INPUT":
          return Result.err("ERR_INVALID_INPUT");
        default:
          this.logger.error("Unexpected error updating surveillance event", result.error);
          return Result.err("ERR_UNEXPECTED");
      }
    }

    return Result.ok(Unit);
  }

  public async delete(
    id: string
  ): Promise<Result<Unit, DeleteEventError>> {
    const result = await this.repository.delete(id);

    if (result.isErr) {
      switch (result.error) {
        case "ERR_EVENT_NOT_FOUND":
          return Result.err("ERR_EVENT_NOT_FOUND");
        default:
          this.logger.error("Unexpected error deleting surveillance event", result.error);
          return Result.err("ERR_UNEXPECTED");
      }
    }

    return Result.ok(Unit);
  }

  public async count(
    filters?: {
      sessionId?: string;
      deviceId?: string;
      startDate?: string;
      endDate?: string;
      detected?: boolean;
    }
  ): Promise<Result<number, CountEventsError>> {
    const result = await this.repository.count(filters);

    if (result.isErr) {
      this.logger.error("Unexpected error counting surveillance events", result.error);
      return Result.err("ERR_UNEXPECTED");
    }

    return Result.ok(result.value);
  }
}