import type { Request, Response } from "../types";
import type { Result } from "true-myth";

export abstract class ListSurveillanceSessionsUseCase {
	public abstract execute(
		payload: Request.Query,
	): Promise<Result<Response.Success, Response.Error>>;
}
