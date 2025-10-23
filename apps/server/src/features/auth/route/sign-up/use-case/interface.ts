import type { Request, Response } from "../types";
import type { Result } from "true-myth";

export abstract class SignUpUseCase {
	public abstract execute(
		payload: Request.Body,
	): Promise<Result<Response.Success, Response.Error>>;
}
