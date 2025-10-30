import { Hono } from "hono";
import { Container } from "@n8n/di";
import { StatusCodes } from "@/features/http";
import AuthMiddleware from "@/features/auth/middleware";
import type { Response } from "./types";
import { LogoutUseCase } from "./use-case";

const LogoutRoute = new Hono().get(
	"/",
	AuthMiddleware.middleware,
	async (c) => {
		let response: Response.Response;
		let statusCode: StatusCodes;

		const user = c.get("user");

		const useCase = Container.get(LogoutUseCase);
		const result = await useCase.execute(c);

		if (result.isErr) {
			response = result.error;
			statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
		} else {
			response = result.value;
			statusCode = StatusCodes.OK;
		}

		return c.json(response, statusCode);
	},
);

export default LogoutRoute;
