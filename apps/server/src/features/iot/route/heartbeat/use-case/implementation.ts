import type { Request, Response } from "../types";
import { Result } from "true-myth";
import type { IotDeviceHeartbeatUseCase } from "./interface";
import type { IotDeviceService } from "@/features/iot/service/interface";

export class IotDeviceHeartbeatUseCaseImplementation
	implements IotDeviceHeartbeatUseCase
{
	constructor(private readonly service: IotDeviceService) {}

	async execute(
		payload: Request.Path & Request.Body,
	): Promise<Result<Response.Success, Response.Error>> {
		const result = await this.service.updateHeartbeat(
			payload.deviceId,
			new Date(),
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
