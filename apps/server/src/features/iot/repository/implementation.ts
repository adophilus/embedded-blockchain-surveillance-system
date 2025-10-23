import { Result, Unit } from "true-myth";
import type {
	IotDeviceRepository,
	UpdateDeviceRepositoryError,
} from "./interface";
import type { KyselyClient } from "@/features/database/kysely";
import type { Logger } from "@/features/logger";

export class KyselyIotDeviceRepository implements IotDeviceRepository {
	constructor(
		private readonly db: KyselyClient,
		private readonly logger: Logger,
	) {}

	public async updateHeartbeat(
		deviceId: string,
		timestamp: Date,
	): Promise<Result<Unit, UpdateDeviceRepositoryError>> {
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
}
