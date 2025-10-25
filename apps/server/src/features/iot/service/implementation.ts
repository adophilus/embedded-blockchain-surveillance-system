import { Result, type Unit } from "true-myth";
import type {
	IotDeviceService,
	UpdateHeartbeatError,
	UploadStreamError,
} from "./interface";
import type { IotDeviceRepository } from "../repository";
import type { StorageService } from "@/features/storage/service";
import { fileTypeFromBuffer } from "file-type";
import type { MediaDescription } from "@/types";

export class IotDeviceServiceImplementation implements IotDeviceService {
	VALID_EXTS: string[] = ["png", "jpg", "jpeg"];

	constructor(
		private readonly iotDeviceRepository: IotDeviceRepository,
		private readonly storageService: StorageService,
	) {}

	private async isStreamValid(stream: File): Promise<boolean> {
		const result = await fileTypeFromBuffer(await stream.arrayBuffer());
		if (!result) {
			return false;
		}

		if (!this.VALID_EXTS.find((ext) => ext === result.ext)) {
			return false;
		}

		return true;
	}

	public async uploadStream(
		deviceId: string,
		stream: File,
	): Promise<Result<MediaDescription, UploadStreamError>> {
		const findDeviceByIdResult =
			await this.iotDeviceRepository.findById(deviceId);

		if (findDeviceByIdResult.isErr) {
			return Result.err("ERR_DEVICE_NOT_FOUND");
		}

		if (!this.isStreamValid(stream)) {
			return Result.err("ERR_INVALID_STREAM");
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
