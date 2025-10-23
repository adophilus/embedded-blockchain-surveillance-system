import { Container } from "@n8n/di";
import { Hono } from "hono";
import { StatusCodes } from "@/features/http";
import middleware from "./middleware";
import type { Response } from "./types";
import { GetSurveillanceSessionByIdUseCase } from "./use-case";

const GetSessionByIdRoute = new Hono().get("/", middleware, async (c) => {
	let response: Response.Response;
	let statusCode: StatusCodes;

	const path = c.req.valid("param");

	const useCase = Container.get(GetSurveillanceSessionByIdUseCase);
	const result = await useCase.execute(path);

	if (result.isErr) {
		switch (result.error.code) {
			case "ERR_SESSION_NOT_FOUND": {
				response = result.error;
				statusCode = StatusCodes.NOT_FOUND;
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
		statusCode = StatusCodes.OK;
	}

	return c.json(response, statusCode);
});

export default GetSessionByIdRoute;
