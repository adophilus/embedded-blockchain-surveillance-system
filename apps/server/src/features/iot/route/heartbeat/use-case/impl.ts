import type { Request, Response } from "../types";
import { Result } from "true-myth";
import type { IotDeviceHeartbeatUseCase } from "./interface";

export class IotDeviceHeartbeatUseCaseImplementation
	implements IotDeviceHeartbeatUseCase
{
	constructor(private service: IotDeviceService) {}

	async execute(
		payload: Request.Path & Request.Body,
	): Promise<Result<Response.Success, Response.Error>> {
		const result = await this.service.updateHeartbeat(
			payload.deviceId,
			new Date(),
		);
	}
}
