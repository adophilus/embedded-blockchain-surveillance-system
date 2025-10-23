import type { Request, Response } from "../types";
import type { Result } from "true-myth";

export abstract class GetCriminalProfileByIdUseCase {
	public abstract execute(
		payload: Request.Path,
	): Promise<Result<Response.Success, Response.Error>>;
}
