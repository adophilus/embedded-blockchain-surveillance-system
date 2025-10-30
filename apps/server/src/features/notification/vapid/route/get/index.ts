import { Hono } from "hono";
import { Container } from "@n8n/di";
import { StatusCodes } from "@/features/http";
import type { Response } from "./types";
import { GetVapidPublicKeyUseCase } from "./use-case";

const GetVapidPublicKeyRoute = new Hono().get(
	"/",
	async (c) => {
		let response: Response.Response;
		let statusCode: StatusCodes;

		const useCase = Container.get(GetVapidPublicKeyUseCase);
		const result = await useCase.execute();

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

export default GetVapidPublicKeyRoute;
