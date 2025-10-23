import type { Request, Response } from "../types";
import { Result } from "true-myth";
import type { IotDeviceUploadUseCase } from "./interface";
import type { IotDeviceService } from "@/features/iot/service";

export class IotDeviceUploadUseCaseImplementation
	implements IotDeviceUploadUseCase
{
	constructor(private readonly service: IotDeviceService) {}

	async execute(
		payload: Request.Path & Request.Body,
	): Promise<Result<Response.Success, Response.Error>> {
		const result = await this.service.uploadStream(
			payload.deviceId,
			payload.image,
		);

		if (result.isErr) {
			switch (result.error) {
				case "ERR_DEVICE_NOT_FOUND": {
					return Result.err({
						code: "ERR_DEVICE_NOT_FOUND",
					});
				}
				default: {
					return Result.err({
						code: "ERR_UNEXPECTED",
					});
				}
			}
		}

		return Result.ok({
			code: "HEARTBEAT_RECEIVED",
		});
	}
}
