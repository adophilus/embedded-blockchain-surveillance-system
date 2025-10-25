import { Hono } from "hono";
import { StatusCodes } from "@/features/http";
import type { Response } from "./types";
import { Container } from "@n8n/di";
import { ListCriminalProfileUseCase } from "./use-case";
import middleware from "./middleware";

const ListCriminalProfilesRoute = new Hono().get("/", middleware, async (c) => {
	let response: Response.Response;
	let statusCode: StatusCodes;

	const query = c.req.valid("query");

	const useCase = Container.get(ListCriminalProfileUseCase);
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

export default ListCriminalProfilesRoute;
