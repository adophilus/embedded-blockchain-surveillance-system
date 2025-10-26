import type { IotDevice, MediaDescription } from "@/types";
import type { Result, Unit } from "true-myth";

export type UpdateHeartbeatError = "ERR_DEVICE_NOT_FOUND" | "ERR_UNEXPECTED";
export type UploadStreamError =
	| "ERR_DEVICE_NOT_FOUND"
	| "ERR_INVALID_STREAM"
	| "ERR_UNEXPECTED";
export type ListError = "ERR_UNEXPECTED";
export type CreateError = "ERR_UNEXPECTED";

export abstract class IotDeviceService {
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
	 * Upload a File or ArrayBuffer associated with an IoT device (e.g. logs, telemetry blob, firmware).
	 * In this project a "stream" is represented as an in-memory file, so pass a browser File or an ArrayBuffer.
	 *
	 * @param deviceId - The ID of the IoT device
	 * @param stream - File or ArrayBuffer containing the data to upload
	 * @returns Result containing the uploaded resource URL on success or an error code
	 */
	public abstract uploadStream(
		deviceId: string,
		stream: File,
	): Promise<Result<MediaDescription, UploadStreamError>>;

	/**
	 * Create a new IoT device.
	 *
	 * @param payload - The IoT device data to create
	 */
	public abstract create(
		payload: IotDevice.Insertable,
	): Promise<Result<Unit, CreateError>>;

	/**
	 * List all IoT devices.
	 *
	 * @returns Result indicating success or failure
	 */
	public abstract list(): Promise<Result<IotDevice.Selectable[], ListError>>;
}
