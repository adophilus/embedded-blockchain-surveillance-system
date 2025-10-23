import { Container } from "@n8n/di";
import { Hono } from "hono";
import { StatusCodes } from "@/features/http";
import middleware from "./middleware";
import type { Response } from "./types";
import SignUpUseCase from "./use-case";

const SignUpRoute = new Hono().post("/", middleware, async (c) => {
	let response: Response.Response;
	let statusCode: StatusCodes;

	const payload = c.req.valid("multipart");

	const useCase = Container.get(SignUpUseCase);
	const result = await useCase.execute(payload);

	if (result.isErr) {
		switch (result.error.code) {
			case "ERR_EMAIL_ALREADY_IN_USE": {
				response = result.error;
				statusCode = StatusCodes.CONFLICT;
				break;
			}
			default: {
				response = result.error;
				statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
				break;
			}
		}
	} else {
		response = result.value;
		statusCode = StatusCodes.CREATED;
	}

	return c.json(response, statusCode);
});

export default SignUpRoute;