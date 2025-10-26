import { Container } from "@n8n/di";
import { Hono } from "hono";
import { StatusCodes } from "@/features/http";
import middleware from "./middleware";
import type { Response } from "./types";
import { ListSurveillanceEventsUseCase } from "./use-case";

const ListSurveillanceEventsRoute = new Hono().get(
	"/",
	middleware,
	async (c) => {
		let response: Response.Response;
		let statusCode: StatusCodes;

		console.log("got here?");

		const path = c.req.valid("param");

		const useCase = Container.get(ListSurveillanceEventsUseCase);
		const result = await useCase.execute(path);

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

export default ListSurveillanceEventsRoute;
