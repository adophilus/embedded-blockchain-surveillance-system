import { Result } from "true-myth";
import type {
	SurveillanceEventRepository,
	CreateSurveillanceEventError,
	FindSurveillanceEventByIdError,
	ListSurveillanceEventsError,
} from "./interface";
import type { SurveillanceEvent } from "@/types";
import type {
	BlockchainSurveillanceSystem,
	SurveillanceEventDetails,
} from "@embedded-blockchain-surveillance-system/core";
import type { Writable } from "type-fest";

export class BlockchainSurveillanceEventRepository
	implements SurveillanceEventRepository {
	constructor(private readonly system: BlockchainSurveillanceSystem) { }

	public async create(
		payload: SurveillanceEvent.Insertable,
	): Promise<
		Result<SurveillanceEvent.Selectable, CreateSurveillanceEventError>
	> {
		const result = await this.system.recordSurveillanceEvent(
			payload.session_id,
			payload.id,
			payload.detections.map((d) => d.criminal_profile_id),
			payload.media.id,
			payload.device_id,
		);

		if (result.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		const findResult = await this.findById(result.value);
		if (findResult.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		if (findResult.value === null) {
			return Result.err("ERR_UNEXPECTED");
		}

		return Result.ok(findResult.value);
	}

	private normalizeSurveillanceEventDetails(
		surveillanceEventDetails: SurveillanceEventDetails,
	): SurveillanceEvent.Selectable {
		const {
			id,
			device_code,
			cid,
			session_id,
			created_at,
			criminal_profile_ids,
		} = surveillanceEventDetails;

		const surveillanceEvent: SurveillanceEvent.Selectable = {
			id,
			device_id: device_code,
			session_id,
			detections: criminal_profile_ids.map((id) => ({
				criminal_profile_id: id,
			})),
			media: {
				id: cid,
				source: "ipfs",
				url: `https://ipfs.io/ipfs/${cid}`,
			},
			created_at: Number(created_at),
		};

		return surveillanceEvent;
	}

	public async findById(
		id: string,
	): Promise<
		Result<SurveillanceEvent.Selectable | null, FindSurveillanceEventByIdError>
	> {
		const result = await this.system.getSurveillanceEvent(id);
		if (result.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		const surveillanceEvent = this.normalizeSurveillanceEventDetails(
			result.value,
		);

		return Result.ok(surveillanceEvent);
	}

	public async list(): Promise<
		Result<SurveillanceEvent.Selectable[], ListSurveillanceEventsError>
	> {
		const result = await this.system.listSurveillanceEvents();
		if (result.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		const surveillanceEvents = result.value.map(
			this.normalizeSurveillanceEventDetails,
		);

		return Result.ok(surveillanceEvents);
	}
}
