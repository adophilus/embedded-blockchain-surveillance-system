import type { Response } from "../types";
import type { Result } from "true-myth";

export abstract class GetSurveillanceMetricsUseCase {
	public abstract execute(): Promise<Result<Response.Success, Response.Error>>;
}
