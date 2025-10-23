import { Result, Unit } from "true-myth";
import type {
	SurveillanceEventService,
	CreateEventError,
	GetEventError,
	ListEventsError,
	UpdateEventError,
	DeleteEventError,
} from "./interface";
import type { SurveillanceEventRepository } from "../repository";
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
		return this.repository.create(event);
	}

	public async getById(
		id: string,
	): Promise<Result<SurveillanceEvent.Selectable, GetEventError>> {
		const result = await this.repository.findById(id);

		if (result.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		if (result.value === null) {
			return Result.err("ERR_EVENT_NOT_FOUND");
		}

		return Result.ok(result.value);
	}

	public async list(): Promise<
		Result<SurveillanceEvent.Selectable[], ListEventsError>
	> {
		return this.repository.list();
	}

	public async update(
		id: string,
		updates: SurveillanceEvent.Updateable,
	): Promise<Result<Unit, UpdateEventError>> {
		return this.repository.updateById(id, updates);
	}

	public async delete(id: string): Promise<Result<Unit, DeleteEventError>> {
		return this.repository.deleteById(id);
	}
}
