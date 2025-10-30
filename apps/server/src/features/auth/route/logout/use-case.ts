import { Result } from "true-myth";
import type { Response } from "./types";
import type { Logger } from "@/features/logger";
import { deleteCookie } from "hono/cookie";
import { COOKIE_KEY } from "@/types";
import type { Context } from "hono";

export abstract class LogoutUseCase {
	public abstract execute(
		c: Context,
	): Promise<Result<Response.Success, Response.Error>>;
}

export class LogoutUseCaseImplementation implements LogoutUseCase {
	constructor(private readonly logger: Logger) {}

	public async execute(
		c: Context,
	): Promise<Result<Response.Success, Response.Error>> {
		try {
			deleteCookie(c, COOKIE_KEY);
			return Result.ok({ code: "LOGOUT_SUCCESSFUL" });
		} catch (error) {
			this.logger.error("Error during logout", error);
			return Result.err({ code: "ERR_UNEXPECTED" });
		}
	}
}
