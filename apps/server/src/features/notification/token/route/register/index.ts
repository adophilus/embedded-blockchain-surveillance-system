import { Hono } from "hono";
import { Container } from "@n8n/di";
import { StatusCodes } from "@/features/http";
import AuthMiddleware from "@/features/auth/middleware";
import middleware from "./middleware";
import type { Response } from "./types";
import { RegisterNotificationTokenUseCase } from "./use-case";

const RegisterNotificationTokenRoute = new Hono().post(
	"/",
	AuthMiddleware.middleware,
	middleware,
	async (c) => {
		let response: Response.Response;
		let statusCode: StatusCodes;

		const user = c.get("user");
		const payload = c.req.valid("json");

		const useCase = Container.get(RegisterNotificationTokenUseCase);
		const result = await useCase.execute(payload, user.id);

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

export default RegisterNotificationTokenRoute;
