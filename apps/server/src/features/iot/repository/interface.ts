import type { Result, Unit } from "true-myth";
import type { IotDevice } from "@/types";

export type UpdateHeartbeatError = "ERR_DEVICE_NOT_FOUND" | "ERR_UNEXPECTED";
export type FindByIdError = "ERR_UNEXPECTED";

export abstract class IotDeviceRepository {
	/**
	 * Update the heartbeat timestamp for an IoT device
	 * @param deviceId - The ID of the IoT device
	 * @param timestamp - The timestamp of the heartbeat
	 * @returns Result indicating success or failure
	 */
	public abstract updateHeartbeat(
		deviceId: string,
		timestamp: Date,
	): Promise<Result<Unit, UpdateHeartbeatError>>;

	/**
	 * Find an IoT device by its ID.
	 *
	 * @param deviceId - The ID of the IoT device to look up
	 * @returns Result indicating success or failure
	 */
	public abstract findById(
		deviceId: string,
	): Promise<Result<IotDevice.Selectable | null, FindByIdError>>;
}
