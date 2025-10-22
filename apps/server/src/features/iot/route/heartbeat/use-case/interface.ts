import type { Request, Response } from "../types";
import type { Result } from "true-myth";

export abstract class IotDeviceHeartbeatUseCase {
	public abstract execute(
		payload: Request.Path & Request.Body,
	): Promise<Result<Response.Success, Response.Error>>;
}
