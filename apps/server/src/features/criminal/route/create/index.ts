import { Hono } from "hono";
import { StatusCodes } from "@/features/http";
import type { Response } from "./types";
import middleware from "./middleware";
import { Container } from "@n8n/di";
import { CreateCriminalProfileUseCase } from "./use-case";

const CreateCriminalProfileRoute = new Hono().post(
	"/",
	middleware,
	async (c) => {
		let response: Response.Response;
		let statusCode: StatusCodes;

		const body = c.req.valid("form");

		const useCase = Container.get(CreateCriminalProfileUseCase);
		const result = await useCase.execute(body);

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

export default CreateCriminalProfileRoute;
