import { Hono } from "hono";
import { StatusCodes } from "@/features/http";
import type { Response } from "./types";
import middleware from "./middleware";
import { Container } from "@n8n/di";
import { GetCriminalProfileByIdUseCase } from "./use-case";

const GetCriminalProfileByIdRoute = new Hono().post(
	"/",
	middleware,
	async (c) => {
		let response: Response.Response;
		let statusCode: StatusCodes;

		const path = c.req.valid("param");

		const useCase = Container.get(GetCriminalProfileByIdUseCase);
		const result = await useCase.execute(path);

		if (result.isErr) {
			response = result.error;
			switch (result.error.code) {
				case "ERR_CRIMINAL_PROFILE_NOT_FOUND": {
					statusCode = StatusCodes.NOT_FOUND;
					break;
				}
				default: {
					statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
				}
			}
		} else {
			response = result.value;
			statusCode = StatusCodes.OK;
		}

		return c.json(response, statusCode);
	},
);

export default GetCriminalProfileByIdRoute;
