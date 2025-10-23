import { Result, type Unit } from "true-myth";
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

	public async uploadStream(
		deviceId: string,
		stream: File,
	): Promise<Result<string, UploadStreamError>> {
		const findDeviceByIdResult =
			await this.iotDeviceRepository.findById(deviceId);
		if (findDeviceByIdResult.isErr) {
			return Result.err("ERR_DEVICE_NOT_FOUND");
		}

		const uploadResult = await this.storageService.upload(stream);

		if (uploadResult.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		const id = uploadResult.value;

		return Result.ok(id);
	}

	public updateHeartbeat(
		deviceId: string,
		timestamp: Date,
	): Promise<Result<Unit, UpdateHeartbeatError>> {
		return this.iotDeviceRepository.updateHeartbeat(deviceId, timestamp);
	}
}
