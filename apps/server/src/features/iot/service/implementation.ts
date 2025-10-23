import type { Result, Unit } from "true-myth";
import type { IotDeviceService, IotDeviceServiceError } from "./interface";
import type { IotDeviceRepository } from "../repository";

export class IotDeviceServiceImplementation implements IotDeviceService {
	constructor(private readonly repository: IotDeviceRepository) {}

	public updateHeartbeat(
		deviceId: string,
		timestamp: Date,
	): Promise<Result<Unit, IotDeviceServiceError>> {
		return this.repository.updateHeartbeat(deviceId, timestamp);
	}
}
