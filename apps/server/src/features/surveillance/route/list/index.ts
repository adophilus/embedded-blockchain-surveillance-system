import { Container } from "@n8n/di";
import { Hono } from "hono";
import { StatusCodes } from "@/features/http";
import middleware from "./middleware";
import type { Response } from "./types";
import { ListSurveillanceSessionsUseCase } from "./use-case";

const ListSessionsRoute = new Hono().get("/", middleware, async (c) => {
	let response: Response.Response;
	let statusCode: StatusCodes;

	const query = c.req.valid("query");

	const useCase = Container.get(ListSurveillanceSessionsUseCase);
	const result = await useCase.execute(query);

	if (result.isErr) {
		response = result.error;
		statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
	} else {
		response = result.value;
		statusCode = StatusCodes.OK;
	}

	return c.json(response, statusCode);
});

export default ListSessionsRoute;
