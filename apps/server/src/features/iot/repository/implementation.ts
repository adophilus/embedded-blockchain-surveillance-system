import { Result, type Unit } from "true-myth";
import type {
	IotDeviceRepository,
	UpdateHeartbeatError,
	FindByIdError,
	ListError,
	CreateError,
} from "./interface";
import type { KyselyClient } from "@/features/database/kysely";
import type { Logger } from "@/features/logger";
import type { IotDevice } from "@/types";

export class KyselyIotDeviceRepository implements IotDeviceRepository {
	constructor(
		private readonly db: KyselyClient,
		private readonly logger: Logger,
	) {}

	public async create(
		payload: IotDevice.Insertable,
	): Promise<Result<Unit, CreateError>> {
		try {
			await this.db.insertInto("iot_devices").values(payload).execute();

			return Result.ok();
		} catch (error) {
			this.logger.error("Failed to create IoT device", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async list(): Promise<Result<IotDevice.Selectable[], ListError>> {
		try {
			const devices = await this.db
				.selectFrom("iot_devices")
				.selectAll()
				.execute();

			return Result.ok(devices);
		} catch (error) {
			this.logger.error("Failed to list IoT devices", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async updateHeartbeat(
		deviceId: string,
		timestamp: Date,
	): Promise<Result<Unit, UpdateHeartbeatError>> {
		try {
			const device = await this.db
				.updateTable("iot_devices")
				.set("iot_devices.last_heartbeat", timestamp.toISOString())
				.where("iot_devices.id", "=", deviceId)
				.returningAll()
				.executeTakeFirst();

			if (!device) {
				return Result.err("ERR_DEVICE_NOT_FOUND");
			}

			return Result.ok();
		} catch (error) {
			this.logger.error("Failed to update device heartbeat", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async findById(
		deviceId: string,
	): Promise<Result<IotDevice.Selectable | null, FindByIdError>> {
		try {
			const device = await this.db
				.selectFrom("iot_devices")
				.selectAll()
				.where("iot_devices.id", "=", deviceId)
				.executeTakeFirst();

			return Result.ok(device ?? null);
		} catch (error) {
			this.logger.error("Failed to find device by id", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}
}
