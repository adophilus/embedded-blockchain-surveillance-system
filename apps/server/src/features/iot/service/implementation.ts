import type { Result, Unit } from "true-myth";
import type {
	IotDeviceService,
	UpdateHeartbeatError,
	UploadStreamError,
} from "./interface";
import type { IotDeviceRepository } from "../repository";
import type { StorageService } from "@/features/storage/service";

export class IotDeviceServiceImplementation implements IotDeviceService {
	constructor(
		private readonly iotDeviceRepository: IotDeviceRepository,
		private readonly storageService: StorageService,
	) {}

	public uploadStream(
		deviceId: string,
		stream: File,
	): Promise<Result<string, UploadStreamError>> {
		throw new Error("Method not implemented.");
	}

	public updateHeartbeat(
		deviceId: string,
		timestamp: Date,
	): Promise<Result<Unit, UpdateHeartbeatError>> {
		return this.iotDeviceRepository.updateHeartbeat(deviceId, timestamp);
	}
}
