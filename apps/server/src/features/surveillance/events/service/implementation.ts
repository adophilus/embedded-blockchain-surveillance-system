import { Result, Unit } from "true-myth";
import type {
	SurveillanceEventService,
	CreateEventError,
	GetEventError,
	ListEventsError,
	UpdateEventError,
	DeleteEventError,
} from "./interface";
import type {
	SurveillanceEventRepository,
} from "../repository";
import type { Logger } from "@/features/logger";
import type { SurveillanceEvent } from "@/types";

export class SurveillanceEventServiceImpl implements SurveillanceEventService {
	constructor(
		private readonly repository: SurveillanceEventRepository,
		private readonly logger: Logger,
	) {}

	public async create(
		event: SurveillanceEvent.Insertable,
	): Promise<Result<SurveillanceEvent.Selectable, CreateEventError>> {
		const result = await this.repository.create(event);

		if (result.isErr) {
			this.logger.error("Unexpected error creating surveillance event", result.error);
			return Result.err("ERR_UNEXPECTED");
		}

		return Result.ok(result.value);
	}

	public async getById(
		id: string,
	): Promise<Result<SurveillanceEvent.Selectable, GetEventError>> {
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

	public async list(): Promise<Result<SurveillanceEvent.Selectable[], ListEventsError>> {
		const result = await this.repository.list();

		if (result.isErr) {
			this.logger.error("Unexpected error listing surveillance events", result.error);
			return Result.err("ERR_UNEXPECTED");
		}

		return Result.ok(result.value);
	}

	public async update(
		id: string,
		updates: SurveillanceEvent.Updateable,
	): Promise<Result<Unit, UpdateEventError>> {
		const result = await this.repository.update(id, updates);

		if (result.isErr) {
			switch (result.error) {
				case "ERR_EVENT_NOT_FOUND":
					return Result.err("ERR_EVENT_NOT_FOUND");
				default:
					this.logger.error("Unexpected error updating surveillance event", result.error);
					return Result.err("ERR_UNEXPECTED");
			}
		}

		return Result.ok(Unit);
	}

	public async delete(id: string): Promise<Result<Unit, DeleteEventError>> {
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
}